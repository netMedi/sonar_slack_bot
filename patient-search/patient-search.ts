import fetch from "node-fetch";
import { SiteSettingsClient } from "./site-settings-client";
import assert from "assert";

const SEARCH_BY_EMAIL_PATH = "/api/patient-search/search-by-email";

export class HolvikaariPatientSearch {
  public async search(emailAddress: string): Promise<any[]> {
    assert(process.env.SITE_SETTINGS_URL, "SITE_SETTINGS_URL is not set");

    const siteSettingsClient = new SiteSettingsClient(
      process.env.SITE_SETTINGS_URL
    );
    const siteUrls = await siteSettingsClient.getSiteUrls();

    // Search by email in all sites
    const promises = siteUrls.map(async ({ url }) => {
      const response = await fetch(
        `${url}${SEARCH_BY_EMAIL_PATH}?email=${encodeURIComponent(
          emailAddress
        )}`
      );
      return response.json();
    });

    const results = await Promise.all(promises);
    return results.flat();
  }
}
