import { z } from "zod";
import { OperationType } from "../types/operations";

/**
 * Validation schema for TRANSACTION_STATUS requests.
 */

export const statusRequestSchema = z.object({
  operation: z.literal(OperationType.TRANSACTION_STATUS),
  txnReference: z.string().min(1),
  requestParameters: {
    merchantTill: z.number().int().positive(),
    txnReference: z.string().min(1),
    timestamp: z.string().min(1),
    nonce: z.string().min(1),
    signature: z.string().min(1)
  }
});
export type ValidatedStatusRequest = z.infer<typeof statusRequestSchema>;
