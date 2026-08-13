import { AppError } from "./AppError";

/**
 * Raised for failures in token validation or refresh (e.g. refresh call
 * failed, no token available at all, refresh token itself expired).
 */
export class TokenError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 401, "TOKEN_ERROR", true, details);
  }
}
