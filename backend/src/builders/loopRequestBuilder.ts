import { ValidatedPaymentRequest } from "../validation/paymentRequestSchema";
import { LoopLoopBizRequest } from "../types/thirdPartyContracts";

/**
 * Transforms a validated customer PAYMENT request (paymentMethod = LOOP)
 * into the request body expected by the Loop -> Loop Biz API.
 *
 * Field names are placeholders pending real API documentation.
 */
export function buildLoopLoopBizRequest(
  request: ValidatedPaymentRequest
): LoopLoopBizRequest {
  return {
    amount: request.amount,
    currency: request.currency,
    customerId: request.customer.customerId,
    memo: request.transaction?.description ?? request.transaction?.reference,
  };
}
