import { ValidatedHistoryRequest } from "../validation/historyRequestSchema";
import { TransactionHistoryRequest } from "../types/thirdPartyContracts";

/**
 * Transforms a validated customer TRANSACTION_HISTORY request into the
 * request body expected by the Transaction History API.
 */
export function buildTransactionHistoryRequest(
  request: ValidatedHistoryRequest
): TransactionHistoryRequest {
  return {
    customerId: request.customer.customerId,
    from: request.from,
    to: request.to,
    page: request.page ?? 1,
    pageSize: request.pageSize ?? 20,
  };
}
