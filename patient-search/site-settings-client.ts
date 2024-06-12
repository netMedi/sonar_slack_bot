const ALLOWED_SITES = ["staging-katedaali", "staging-horizon"];

type SiteSettings = any;

export class SiteSettingsClient {
  constructor(private baseUrl: string) {}

  public async getSiteUrls(): Promise<{ site: string; url: string }[]> {
    const siteSettings = await this.fetchSiteSettings();
    return siteSettings.map((site: any) => site.siteSettings.hostname);
  }

  private async fetchSiteSettings(): Promise<SiteSettings> {
    throw new Error("Not implemented");
  }
}
