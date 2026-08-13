import { config } from "../config";
import { RefreshTokenRequest } from "../types/thirdPartyContracts";

/**
 * Builds the request body for the Refresh Token API.
 *
 * Kept separate from auth/refreshTokenClient.ts per spec principle #7
 * (each third-party API gets its own request-mapping logic, distinct from
 * the client that actually sends it).
 */
export function buildRefreshTokenRequest(
  refreshToken?: string
): RefreshTokenRequest {
  return {
    clientId: config.refreshToken.clientId(),
    clientSecret: config.refreshToken.clientSecret(),
    grantType: refreshToken ? "refresh_token" : "client_credentials",
    refreshToken,
  };
}
