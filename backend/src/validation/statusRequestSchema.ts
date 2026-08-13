import { z } from "zod";
import { OperationType } from "../types/operations";

/**
 * Validation schema for TRANSACTION_STATUS requests.
 */
export const statusRequestSchema = z.object({
  operation: z.literal(OperationType.TRANSACTION_STATUS),
  transactionId: z.string().min(1),
});

export type ValidatedStatusRequest = z.infer<typeof statusRequestSchema>;
