import fetch from "node-fetch";
import ClientOAuth2 from "client-oauth2";
import { SiteSettingsClient } from "./site-settings-client";
import assert from "assert";

const SEARCH_BY_EMAIL_PATH = "/rest/support/find_patient_by_email";
const getOauth2Config = () => {
  const keycloakUrl = process.env.KEYCLOAK_URL || "http://localhost:8081";
  const realm = process.env.KEYCLOAK_REALM || "katedraali";
  const accessTokenUri = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;
  return {
    clientId: process.env.KEYCLOAK_RESOURCE || "sonar",
    clientSecret: process.env.KEYCLOAK_SECRET || "secret",
    accessTokenUri: accessTokenUri,
  };
};

const getAuthToken = async (): Promise<string> => {
  const config = getOauth2Config();
  const auth = new ClientOAuth2(config);
  const token: ClientOAuth2.Token = await auth.credentials.getToken();

  return token.accessToken;
};

export class PatientSearch {
  public async search(emailAddress: string): Promise<any[]> {
    assert(process.env.SITE_SETTINGS_URL, "SITE_SETTINGS_URL is not set");

    const siteSettingsClient = new SiteSettingsClient(
      process.env.SITE_SETTINGS_URL
    );

    const siteUrls = await siteSettingsClient.getSiteUrls();
    // const siteUrls = ["http://localhost:8080"];

    const authToken = await getAuthToken();

    // Search by email in all sites
    const promises = siteUrls.map(async (baseUrl) => {
      const requestUrl = `${baseUrl}${SEARCH_BY_EMAIL_PATH}?email=${encodeURIComponent(
        emailAddress
      )}`;

      const response = await fetch(requestUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        console.log(`WARNING: Unexpected response from ${baseUrl}`);
        console.log("status:", response.status);
        console.error(await response.text());
        return [];
      }
      return await response.json();
    });

    const results = await Promise.all(promises);
    return results.flat().filter((v) => v);
  }
}
