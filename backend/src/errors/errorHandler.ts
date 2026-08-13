import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";
import { logger } from "../logging/logger";
import { sanitizeError } from "../responses/errorSanitizer";

/**
 * Central Express error-handling middleware. Must be registered LAST
 * (after all routes) in app.ts.
 *
 * Responsibility split:
 * - This middleware decides HTTP status + logs the full internal error.
 * - responses/errorSanitizer.ts decides what subset of the error is safe
 *   to send back to the customer (spec principle #9).
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const appError =
    err instanceof AppError
      ? err
      : new AppError(
          err instanceof Error ? err.message : "Unexpected error",
          500,
          "INTERNAL_ERROR",
          false
        );

  logger.error("Request failed", {
    path: req.path,
    method: req.method,
    statusCode: appError.statusCode,
    code: appError.code,
    message: appError.message,
    details: appError.details,
    stack: appError.stack,
  });

  const safeError = sanitizeError(appError);

  res.status(appError.statusCode).json({
    success: false,
    error: safeError,
  });
}
