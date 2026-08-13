import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors/ValidationError";

/**
 * Parses `input` against `schema`, converting any ZodError into our own
 * ValidationError so the rest of the app (error handler, sanitizer) only
 * ever deals with AppError subclasses — it doesn't need to know about zod.
 */
export function validate<T>(schema: ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError("Request failed validation", err.issues);
    }
    throw err;
  }
}
