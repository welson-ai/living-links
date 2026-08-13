import { z } from "zod";
import { OperationType, PaymentMethod } from "../types/operations";

/**
 * Validation schema for incoming PAYMENT requests (§16.2 spec: request
 * validation happens before routing/token checks conceptually, though in
 * practice it can run in parallel with the token check — see services/).
 *
 * Field names are placeholders pending the real frontend contract.
 */
export const paymentRequestSchema = z.object({
  operation: z.literal(OperationType.PAYMENT),
  paymentMethod: z.nativeEnum(PaymentMethod),
  amount: z.number().positive(),
  currency: z.string().length(3), // e.g. "KES"
  customer: z.object({
    customerId: z.string().min(1),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
  }),
  transaction: z
    .object({
      reference: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export type ValidatedPaymentRequest = z.infer<typeof paymentRequestSchema>;
