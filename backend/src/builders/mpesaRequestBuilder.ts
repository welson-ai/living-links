import { ValidatedPaymentRequest } from "../validation/paymentRequestSchema";
import { MpesaLoopBizRequest } from "../types/thirdPartyContracts";
import { ValidationError } from "../errors/ValidationError";

/**
 * Transforms a validated customer PAYMENT request (paymentMethod = MPESA)
 * into the request body expected by the M-Pesa -> Loop Biz API.
 *
 * Per spec principle #2: never forward the customer body as-is — this is
 * the dedicated translation point for M-Pesa specifically. Field names on
 * the third-party side (e.g. `msisdn`) are placeholders pending real docs.
 */
export function buildMpesaLoopBizRequest(
  request: ValidatedPaymentRequest
): MpesaLoopBizRequest {
  if (!request.customer.phoneNumber) {
    throw new ValidationError(
      "phoneNumber is required for M-Pesa payments",
      { field: "customer.phoneNumber" }
    );
  }

  return {
    amount: request.amount,
    currency: request.currency,
    msisdn: normalizeMsisdn(request.customer.phoneNumber),
    accountReference: request.transaction?.reference,
    narrative: request.transaction?.description,
  };
}
/**
 * Placeholder normalization — real M-Pesa format requirements (e.g.
 * 2547XXXXXXXX vs +2547XXXXXXXX) must be confirmed against the actual
 * M-Pesa -> Loop Biz API documentation.
 */
function normalizeMsisdn(phoneNumber: string): string {
  return phoneNumber.replace(/^\+/, "");
}

