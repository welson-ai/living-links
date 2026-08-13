import { getValidAccessToken } from "../auth/tokenManager";
import { paymentRequestSchema } from "../validation/paymentRequestSchema";
import { validate } from "../validation/validate";
import { resolvePaymentTarget } from "../router/paymentMethodRouter";
import { buildMpesaLoopBizRequest } from "../builders/mpesaRequestBuilder";
import { buildLoopLoopBizRequest } from "../builders/loopRequestBuilder";
import { callMpesaLoopBizApi } from "../clients/mpesaLoopBizClient";
import { callLoopLoopBizApi } from "../clients/loopLoopBizClient";
import { normalizePaymentResponse } from "../responses/responseNormalizer";
import { CustomerResponseBody } from "../types/customerRequest";
import { PaymentMethod, ThirdPartyTarget } from "../types/operations";
import { ValidationError } from "../errors/ValidationError";

/**
 * Orchestrates a full PAYMENT request lifecycle end to end (spec §4/§10/§11):
 * validate -> ensure valid token -> resolve payment-method target ->
 * build third-party-specific body -> call third-party -> normalize response.
 *
 * This is the only place that sequences auth + routing + building + calling
 * together — each of those stays single-responsibility in its own module.
 */
export async function processPayment(
  rawBody: unknown
): Promise<CustomerResponseBody> {
  const request = validate(paymentRequestSchema, rawBody);

  // Token check/refresh happens transparently; the caller never has to
  // handle refresh logic itself (spec principle #5).
  const accessToken = await getValidAccessToken();

  const target = resolvePaymentTarget(request.paymentMethod);

  switch (target) {
    case ThirdPartyTarget.MPESA_LOOP_BIZ: {
      const body = buildMpesaLoopBizRequest(request);
      const result = await callMpesaLoopBizApi(accessToken, body);
      return normalizePaymentResponse(result);
    }

    case ThirdPartyTarget.LOOP_LOOP_BIZ: {
      const body = buildLoopLoopBizRequest(request);
      const result = await callLoopLoopBizApi(accessToken, body);
      return normalizePaymentResponse(result);
    }

    default:
      throw new ValidationError(
        `Unsupported payment method: ${request.paymentMethod as PaymentMethod}`
      );
  }
}
