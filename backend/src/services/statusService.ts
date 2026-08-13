import { getValidAccessToken } from "../auth/tokenManager";
import { statusRequestSchema } from "../validation/statusRequestSchema";
import { validate } from "../validation/validate";
import { buildTransactionStatusRequest } from "../builders/statusRequestBuilder";
import { callTransactionStatusApi } from "../clients/transactionStatusClient";
import { normalizeStatusResponse } from "../responses/responseNormalizer";
import { CustomerResponseBody } from "../types/customerRequest";

/**
 * Orchestrates a full TRANSACTION_STATUS request lifecycle (spec §7/§12).
 * No payment-method routing is involved for this operation.
 */
export async function getTransactionStatus(
  rawBody: unknown
): Promise<CustomerResponseBody> {
  const request = validate(statusRequestSchema, rawBody);

  const accessToken = await getValidAccessToken();

  const body = buildTransactionStatusRequest(request);
  const result = await callTransactionStatusApi(accessToken, body);

  return normalizeStatusResponse(result);
}
