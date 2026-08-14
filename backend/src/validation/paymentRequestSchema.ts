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

// loop-loop
body: JSON.stringify({
  "serviceCode": "NEO_MRCHNT_RTP",
  "txnReference": "9f1b2c3e-8a4d-4f6b-9c2e-7d5a1e8b4f0c",
  "requestParameters": {
    "merchantTill": "133239",
    "mobileNo": "254704540384",
    "amount": "100.00",
    "reason": "Payment for goods",
    "callBackUrl": "https://partner.example.com/api/v1/payments/callback",
    "timestamp": "2026-07-21T07:37:56Z",
    "nonce": "3a4c1f3d-5b00-478f-bd18-4ccf6fae895a",
    "signature": "557dc74f9e53ec51b1c48aeaebe60bc89e108b753d7874336286c333a3692c5c"
  }
}),

// mpesa-loop
body: JSON.stringify({
  "serviceCode": "NEO_MRCHNT_STK",
  "txnReference": "016e8669-f7e2-442d-b37b-7df8d4e0f8a7",
  "requestParameters": {
    "tillNo": "127041",
    "payMblNo": "0704540384",
    "amount": "2",
    "extRefNo": "12312312",
    "callBackUrl": "https://your-domain.com/webhook",
    "timestamp": "2026-08-07T10:30:00Z",
    "nonce": "7f768f08-20e5-4720-ba6c-5431f67e3c5c",
    "signature": "a3f8b2c1d0e9..."
  }
}),
