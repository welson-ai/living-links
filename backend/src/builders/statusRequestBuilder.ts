import { ValidatedStatusRequest } from "../validation/statusRequestSchema";
import { TransactionStatusRequest } from "../types/thirdPartyContracts";

/**
 * Transforms a validated customer TRANSACTION_STATUS request into the
 * request body expected by the Transaction Status API.
 */
export function buildTransactionStatusRequest(
  request: ValidatedStatusRequest
): TransactionStatusRequest {
  return {
    transactionId: request.transactionId,
  };
}
