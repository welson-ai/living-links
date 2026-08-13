/**
 * Minimal structured logger. Swap the console calls for a real logging
 * library (pino, winston, etc.) as needed — kept dependency-free here so
 * the orchestration logic isn't coupled to a specific logging stack.
 */

type LogMeta = Record<string, unknown>;

function write(level: "info" | "warn" | "error" | "debug", message: string, meta?: LogMeta) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };
  const line = JSON.stringify(entry);

  if (level === "error") {
    // eslint-disable-next-line no-console
    console.error(line);
  } else if (level === "warn") {
    // eslint-disable-next-line no-console
    console.warn(line);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
}

export const logger = {
  info: (message: string, meta?: LogMeta) => write("info", message, meta),
  warn: (message: string, meta?: LogMeta) => write("warn", message, meta),
  error: (message: string, meta?: LogMeta) => write("error", message, meta),
  debug: (message: string, meta?: LogMeta) => write("debug", message, meta),
};
