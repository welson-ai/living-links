import axios from "axios";
import { config } from "../config";
import { ThirdPartyError } from "../errors/ThirdPartyError";
import { logger } from "../logging/logger";
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../types/thirdPartyContracts";
import { ThirdPartyTarget } from "../types/operations";

/**
 * Calls the Refresh Token API to obtain a new access token.
 *
 * NOTE: The exact grant type, field names, and headers required by the
 * real Refresh Token API are unconfirmed — this follows a generic
 * client-credentials-style shape per spec section 9 ("do not assume exact
 * fields until API documentation has been inspected"). Adjust once the
 * real contract is known.
 */
export async function callRefreshTokenApi(): Promise<RefreshTokenResponse> {
  const requestBody: RefreshTokenRequest = {
    clientId: config.refreshToken.clientId(),
    clientSecret: config.refreshToken.clientSecret(),
    grantType: "client_credentials",
  };

  try {
    const response = await axios.post<RefreshTokenResponse>(
      config.refreshToken.url(),
      requestBody,
      { timeout: config.thirdParty.timeoutMs }
    );

    return response.data;
  } catch (err) {
    logger.error("Refresh Token API call failed", {
      target: ThirdPartyTarget.REFRESH_TOKEN,
      error: err instanceof Error ? err.message : err,
    });
    throw new ThirdPartyError(
      ThirdPartyTarget.REFRESH_TOKEN,
      "Failed to refresh access token",
      err
    );
  }
}
