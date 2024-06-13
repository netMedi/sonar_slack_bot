"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettingsClient = void 0;
const assert_1 = __importDefault(require("assert"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const ALLOWED_SITES = ["staging-katedraali", "staging-horizon"];
class SiteSettingsClient {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async getSiteUrls() {
        const siteSettings = await this.fetchSiteSettings();
        return siteSettings
            .filter((s) => ALLOWED_SITES.includes(s.siteId))
            .map((s) => `https://${s.siteSettings.hostname}`);
    }
    async fetchSiteSettings() {
        const { access_token } = await this.fetchAccessToken();
        const siteSettings = await this.fetchSettings(`${process.env.SITE_SETTINGS_URL}/sites-v2`, access_token);
        return siteSettings;
    }
    async fetchAccessToken() {
        (0, assert_1.default)(process.env.OAUTH2_ACCESS_TOKEN_URI, "OAUTH2_ACCESS_TOKEN_URI is not set");
        (0, assert_1.default)(process.env.OAUTH2_CLIENT_ID, "OAUTH2_CLIENT_ID is not set");
        (0, assert_1.default)(process.env.OAUTH2_CLIENT_SECRET, "OAUTH2_CLIENT_SECRET is not set");
        const url = process.env.OAUTH2_ACCESS_TOKEN_URI;
        const method = "POST";
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };
        const body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: process.env.OAUTH2_CLIENT_ID,
            client_secret: process.env.OAUTH2_CLIENT_SECRET,
        }).toString();
        const response = await (0, node_fetch_1.default)(url, { method, headers, body });
        const responseJson = (await response.json());
        const { access_token, expires_in } = responseJson;
        if (response.status !== 200) {
            const bodyString = JSON.stringify(responseJson, null, 2);
            const msg = `SiteSettingsClient: fetching token failed, status: ${response.status}, body: ${bodyString}`;
            if (response.status >= 500)
                throw new Error(msg);
            else
                throw new Error(msg);
        }
        if (typeof access_token !== "string" || typeof expires_in !== "number") {
            const bodyString = JSON.stringify(responseJson, null, 2);
            throw new Error(`SiteSettingsClient: invalid response, expected { access_token: string, expires_in: number }, got ${bodyString}`);
        }
        return { access_token, expires_in };
    }
    async fetchSettings(url, accessToken) {
        const method = "GET";
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await (0, node_fetch_1.default)(url, { method, headers });
        if (response.status === 204) {
            const msg = `SiteSettingsClient: empty response from ${method} ${url}`;
            throw new Error(msg);
        }
        const body = (await response.json());
        if (response.status !== 200) {
            const bodyString = JSON.stringify(body, null, 2);
            const msg = `SiteSettingsClient: fetching site settings failed, status: ${response.status}, body: ${bodyString}`;
            if (response.status >= 500)
                throw new Error(msg);
            else
                throw new Error(msg);
        }
        return body;
    }
}
exports.SiteSettingsClient = SiteSettingsClient;
