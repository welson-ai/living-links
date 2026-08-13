import { AppError } from "./AppError";

/**
 * Raised when a call to a third-party API fails or returns an error
 * response. The raw third-party error is kept on `details` for internal
 * logging only — it must be stripped before anything reaches the customer
 * (see errors/errorHandler.ts and responses/errorSanitizer.ts).
 */
export class ThirdPartyError extends AppError {
  public readonly thirdPartyTarget: string;

  constructor(thirdPartyTarget: string, message: string, details?: unknown) {
    super(
      `Third-party API error (${thirdPartyTarget}): ${message}`,
      502,
      "THIRD_PARTY_ERROR",
      true,
      details
    );
    this.thirdPartyTarget = thirdPartyTarget;
  }
}
