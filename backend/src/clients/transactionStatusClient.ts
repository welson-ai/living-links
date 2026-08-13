import { config } from "../config";
import { createAuthorizedClient } from "./httpClient";
import { ThirdPartyError } from "../errors/ThirdPartyError";
import { logger } from "../logging/logger";
import { ThirdPartyTarget } from "../types/operations";
import {
  TransactionStatusRequest,
  TransactionStatusResponse,
} from "../types/thirdPartyContracts";

/**
 * Calls the Transaction Status API with an already-built request body.
 */
export async function callTransactionStatusApi(
  accessToken: string,
  body: TransactionStatusRequest
): Promise<TransactionStatusResponse> {
  const client = createAuthorizedClient(accessToken);

  try {
    const response = await client.get<TransactionStatusResponse>(
      config.transactionStatus.url(),
      { params: body }
    );
    return response.data;
  } catch (err) {
    logger.error("Transaction Status API call failed", {
      target: ThirdPartyTarget.TRANSACTION_STATUS,
      error: err instanceof Error ? err.message : err,
    });
    throw new ThirdPartyError(
      ThirdPartyTarget.TRANSACTION_STATUS,
      "Failed to retrieve transaction status",
      err
    );
  }
}
