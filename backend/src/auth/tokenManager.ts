import { config } from "../config";
import { logger } from "../logging/logger";
import { tokenStore, StoredToken } from "./tokenStore";
import { callRefreshTokenApi } from "./refreshTokenClient";
import { TokenError } from "../errors/TokenError";

/**
 * Central responsibility (spec section 5): determine whether the current
 * access token is valid, refresh it when required, and guarantee that
 * whatever calls getValidAccessToken() always gets back a usable token
 * without needing to know refresh happened.
 *
 * Rules encoded here per spec principles #5 and #6:
 * - Do not refresh a token that is still valid.
 * - After a refresh, the original caller's request continues normally —
 *   getValidAccessToken() just returns the new token and the caller is
 *   none the wiser.
 */

// Prevents concurrent requests from triggering duplicate refresh calls.
let inFlightRefresh: Promise<StoredToken> | null = null;

function isExpiredOrNearExpiry(token: StoredToken): boolean {
  const thresholdMs = config.token.refreshThresholdSeconds * 1000;
  return Date.now() >= token.expiresAt - thresholdMs;
}

async function refreshAndStore(): Promise<StoredToken> {
  logger.info("Refreshing access token");

  const refreshed = await callRefreshTokenApi();

  const newToken: StoredToken = {
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    expiresAt: Date.now() + refreshed.expiresIn * 1000,
  };

  await tokenStore.set(newToken);
  logger.info("Access token refreshed successfully");

  return newToken;
}

/**
 * Returns a guaranteed-valid access token, refreshing it first if the
 * stored token is missing, expired, or within the proactive-refresh
 * threshold.
 */
export async function getValidAccessToken(): Promise<string> {
  const existing = await tokenStore.get();

  if (existing && !isExpiredOrNearExpiry(existing)) {
    return existing.accessToken;
  }

  // Coalesce concurrent refresh attempts into a single call.
  if (!inFlightRefresh) {
    inFlightRefresh = refreshAndStore().finally(() => {
      inFlightRefresh = null;
    });
  }

  try {
    const refreshed = await inFlightRefresh;
    return refreshed.accessToken;
  } catch (err) {
    throw err instanceof TokenError
      ? err
      : new TokenError("Unable to obtain a valid access token", err);
  }
}

/**
 * Forces a refresh regardless of current token state. Useful if a
 * downstream third-party call fails with a 401, indicating the token was
 * invalidated server-side despite our local expiry tracking.
 */
export async function forceRefreshAccessToken(): Promise<string> {
  await tokenStore.clear();
  return getValidAccessToken();
}
