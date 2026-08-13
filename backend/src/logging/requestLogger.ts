import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

/**
 * Logs every incoming request and its resulting status/duration.
 * Register this early in the middleware chain in app.ts.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs,
    });
  });

  next();
}
