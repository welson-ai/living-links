import { getValidAccessToken } from "../auth/tokenManager";
import { historyRequestSchema } from "../validation/historyRequestSchema";
import { validate } from "../validation/validate";
import { buildTransactionHistoryRequest } from "../builders/historyRequestBuilder";
import { callTransactionHistoryApi } from "../clients/transactionHistoryClient";
import { normalizeHistoryResponse } from "../responses/responseNormalizer";
import { CustomerResponseBody } from "../types/customerRequest";

/**
 * Orchestrates a full TRANSACTION_HISTORY request lifecycle (spec §8/§13).
 * No payment-method routing is involved for this operation.
 */
export async function getTransactionHistory(
  rawBody: unknown
): Promise<CustomerResponseBody> {
  const request = validate(historyRequestSchema, rawBody);

  const accessToken = await getValidAccessToken();

  const body = buildTransactionHistoryRequest(request);
  const result = await callTransactionHistoryApi(accessToken, body);

  return normalizeHistoryResponse(result);
}
