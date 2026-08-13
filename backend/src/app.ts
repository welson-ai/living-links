import express, { Express } from "express";
import { config } from "./config";
import { router } from "./routes";
import { requestLogger } from "./logging/requestLogger";
import { errorHandler } from "./errors/errorHandler";
import { logger } from "./logging/logger";

/**
 * App bootstrap. Middleware order matters:
 * 1. JSON body parsing
 * 2. Request logging
 * 3. Routes (customer-facing endpoints -> controllers -> services)
 * 4. Central error handler — MUST be registered last so it catches
 *    errors passed via next(err) from any controller.
 */
export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  app.use("/", router);

  app.use(errorHandler);

  return app;
}

// Only start listening when this file is run directly (not when imported
// by tests).
if (require.main === module) {
  const app = createApp();

  app.listen(config.port, () => {
    logger.info(`Backend orchestration service listening`, {
      port: config.port,
      env: config.env,
    });
  });
}
