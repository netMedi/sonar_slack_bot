"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientSearch = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const client_oauth2_1 = __importDefault(require("client-oauth2"));
const site_settings_client_1 = require("./site-settings-client");
const assert_1 = __importDefault(require("assert"));
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
const getAuthToken = async () => {
    const config = getOauth2Config();
    const auth = new client_oauth2_1.default(config);
    const token = await auth.credentials.getToken();
    return token.accessToken;
};
class PatientSearch {
    async search(emailAddress) {
        (0, assert_1.default)(process.env.SITE_SETTINGS_URL, "SITE_SETTINGS_URL is not set");
        const siteSettingsClient = new site_settings_client_1.SiteSettingsClient(process.env.SITE_SETTINGS_URL);
        const siteUrls = await siteSettingsClient.getSiteUrls();
        // const siteUrls = ["http://localhost:8080"];
        const authToken = await getAuthToken();
        // Search by email in all sites
        const promises = siteUrls.map(async (baseUrl) => {
            const requestUrl = `${baseUrl}${SEARCH_BY_EMAIL_PATH}?email=${encodeURIComponent(emailAddress)}`;
            const response = await (0, node_fetch_1.default)(requestUrl, {
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
exports.PatientSearch = PatientSearch;
