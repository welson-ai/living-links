import { AppError } from "./AppError";

/**
 * Raised when an incoming customer request fails schema validation.
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", true, details);
  }
}
