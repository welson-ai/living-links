import { config } from "../config";
import { createAuthorizedClient } from "./httpClient";
import { ThirdPartyError } from "../errors/ThirdPartyError";
import { logger } from "../logging/logger";
import { ThirdPartyTarget } from "../types/operations";
import {
  TransactionHistoryRequest,
  TransactionHistoryResponse,
} from "../types/thirdPartyContracts";

/**
 * Calls the Transaction History API with an already-built request body.
 */
export async function callTransactionHistoryApi(
  accessToken: string,
  body: TransactionHistoryRequest
): Promise<TransactionHistoryResponse> {
  const client = createAuthorizedClient(accessToken);

  try {
    const response = await client.get<TransactionHistoryResponse>(
      config.transactionHistory.url(),
      { params: body }
    );
    return response.data;
  } catch (err) {
    logger.error("Transaction History API call failed", {
      target: ThirdPartyTarget.TRANSACTION_HISTORY,
      error: err instanceof Error ? err.message : err,
    });
    throw new ThirdPartyError(
      ThirdPartyTarget.TRANSACTION_HISTORY,
      "Failed to retrieve transaction history",
      err
    );
  }
}
