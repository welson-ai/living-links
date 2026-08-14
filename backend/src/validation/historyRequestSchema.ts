import { z } from "zod";
import { OperationType } from "../types/operations";

/**
 * Validation schema for TRANSACTION_HISTORY requests.
 */
export const historyRequestSchema = z.object({
  operation: z.literal(OperationType.TRANSACTION_HISTORY),
  serviceCode: "MRCHNT_TXN_HISTORY",
  txnReference: z.string().min(1),
  requestParameters: z.object({
    merchantTill: z.number().int().positive(),
    limit: 10,
    timestamp: z.string().min(1),
    nonce: z.string().min(1),
    signature: z.string().min(1)
  })
});
export type ValidatedHistoryRequest = z.infer<typeof historyRequestSchema>;
