import { config } from "../config";
import { createAuthorizedClient } from "./httpClient";
import { ThirdPartyError } from "../errors/ThirdPartyError";
import { logger } from "../logging/logger";
import { ThirdPartyTarget } from "../types/operations";
import {
  MpesaLoopBizRequest,
  MpesaLoopBizResponse,
} from "../types/thirdPartyContracts";

/**
 * Calls the M-Pesa -> Loop Biz API with an already-built request body.
 * This module owns NO routing or request-construction logic (spec §14) —
 * it only sends the request and surfaces the response/error.
 */
export async function callMpesaLoopBizApi(
  accessToken: string,
  body: MpesaLoopBizRequest
): Promise<MpesaLoopBizResponse> {
  const client = createAuthorizedClient(accessToken);

  try {
    const response = await client.post<MpesaLoopBizResponse>(
      config.mpesaLoopBiz.url(),
      body
    );
    return response.data;
  } catch (err) {
    logger.error("M-Pesa Loop Biz API call failed", {
      target: ThirdPartyTarget.MPESA_LOOP_BIZ,
      error: err instanceof Error ? err.message : err,
    });
    throw new ThirdPartyError(
      ThirdPartyTarget.MPESA_LOOP_BIZ,
      "Failed to process M-Pesa payment",
      err
    );
  }
}
