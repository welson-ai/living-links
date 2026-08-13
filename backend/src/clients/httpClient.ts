import axios, { AxiosInstance } from "axios";
import { config } from "../config";

/**
 * Shared axios instance with common timeout config. Individual third-party
 * clients attach their own auth headers per-call (via createAuthorizedClient)
 * since the access token can change between requests after a refresh.
 */
export function createHttpClient(): AxiosInstance {
  return axios.create({
    timeout: config.thirdParty.timeoutMs,
  });
}

/**
 * Returns an axios instance pre-configured with the given bearer token.
 * Call this per-request (not once at module load) so a freshly refreshed
 * token is always used.
 */
export function createAuthorizedClient(accessToken: string): AxiosInstance {
  return axios.create({
    timeout: config.thirdParty.timeoutMs,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
