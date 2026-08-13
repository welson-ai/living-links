import { z } from "zod";
import { OperationType } from "../types/operations";

/**
 * Validation schema for TRANSACTION_HISTORY requests.
 */
export const historyRequestSchema = z.object({
  operation: z.literal(OperationType.TRANSACTION_HISTORY),
  customer: z.object({
    customerId: z.string().min(1),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
  }),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

export type ValidatedHistoryRequest = z.infer<typeof historyRequestSchema>;
