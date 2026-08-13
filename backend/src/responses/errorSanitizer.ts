import { AppError } from "../errors/AppError";
import { ThirdPartyError } from "../errors/ThirdPartyError";

/**
 * Decides what subset of an internal error is safe to return to the
 * customer. Per spec principle #9: third-party errors must not be blindly
 * exposed if they contain internal implementation details.
 *
 * Strategy: customer-facing messages are always generic, stable strings
 * keyed off the error `code`. Full details (raw third-party payloads,
 * stack traces) only ever go to the logger (see errors/errorHandler.ts).
 */

const CUSTOMER_SAFE_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: "The request could not be processed due to invalid input.",
  TOKEN_ERROR: "Unable to authenticate the request. Please try again shortly.",
  THIRD_PARTY_ERROR:
    "The payment/transaction provider could not complete this request.",
  INTERNAL_ERROR: "An unexpected error occurred. Please try again later.",
};

export function sanitizeError(error: AppError): { code: string; message: string } {
  const safeMessage =
    CUSTOMER_SAFE_MESSAGES[error.code] ?? CUSTOMER_SAFE_MESSAGES.INTERNAL_ERROR;

  // Validation errors are safe to pass through as-is since they describe
  // the customer's own input, not internal/third-party details.
  if (error.code === "VALIDATION_ERROR") {
    return { code: error.code, message: error.message };
  }

  if (error instanceof ThirdPartyError) {
    return { code: error.code, message: safeMessage };
  }

  return { code: error.code, message: safeMessage };
}
