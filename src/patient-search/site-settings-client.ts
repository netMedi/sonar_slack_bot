import assert from "assert";
import fetch from "node-fetch";

const ALLOWED_SITES = ["staging-katedraali", "staging-miracle"];

type SiteSettings = {
  hostname: string;
};

export type SiteSettingsResponse = {
  siteId: string;
  siteSettings: SiteSettings;
}[];

export class SiteSettingsClient {
  constructor(private baseUrl: string) {}

  public async getSiteUrls(): Promise<string[]> {
    const siteSettings = await this.fetchSiteSettings();

    return siteSettings
      .filter((s) => ALLOWED_SITES.includes(s.siteId))
      .map((s) => `https://${s.siteSettings.hostname}`);
  }

  private async fetchSiteSettings(): Promise<SiteSettingsResponse> {
    const { access_token } = await this.fetchAccessToken();

    const siteSettings = await this.fetchSettings(
      `${process.env.SITE_SETTINGS_URL}/sites-v2`,
      access_token
    );

    return siteSettings;
  }

  private async fetchAccessToken(): Promise<{
    access_token: string;
    expires_in: number;
  }> {
    assert(
      process.env.OAUTH2_ACCESS_TOKEN_URI,
      "OAUTH2_ACCESS_TOKEN_URI is not set"
    );
    assert(process.env.OAUTH2_CLIENT_ID, "OAUTH2_CLIENT_ID is not set");
    assert(process.env.OAUTH2_CLIENT_SECRET, "OAUTH2_CLIENT_SECRET is not set");

    const url = process.env.OAUTH2_ACCESS_TOKEN_URI;
    const method = "POST";
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.OAUTH2_CLIENT_ID,
      client_secret: process.env.OAUTH2_CLIENT_SECRET,
    }).toString();

    const response = await fetch(url, { method, headers, body });
    const responseJson: { access_token: string; expires_in: number } =
      (await response.json()) as any;
    const { access_token, expires_in } = responseJson;

    if (response.status !== 200) {
      const bodyString = JSON.stringify(responseJson, null, 2);
      const msg = `SiteSettingsClient: fetching token failed, status: ${response.status}, body: ${bodyString}`;
      if (response.status >= 500) throw new Error(msg);
      else throw new Error(msg);
    }

    if (typeof access_token !== "string" || typeof expires_in !== "number") {
      const bodyString = JSON.stringify(responseJson, null, 2);
      throw new Error(
        `SiteSettingsClient: invalid response, expected { access_token: string, expires_in: number }, got ${bodyString}`
      );
    }

    return { access_token, expires_in };
  }

  async fetchSettings(
    url: string,
    accessToken: string
  ): Promise<SiteSettingsResponse> {
    const method = "GET";
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await fetch(url, { method, headers });

    if (response.status === 204) {
      const msg = `SiteSettingsClient: empty response from ${method} ${url}`;
      throw new Error(msg);
    }

    const body = (await response.json()) as SiteSettingsResponse;

    if (response.status !== 200) {
      const bodyString = JSON.stringify(body, null, 2);
      const msg = `SiteSettingsClient: fetching site settings failed, status: ${response.status}, body: ${bodyString}`;
      if (response.status >= 500) throw new Error(msg);
      else throw new Error(msg);
    }

    return body;
  }
}
