import { config } from "../config";
import { createAuthorizedClient } from "./httpClient";
import { ThirdPartyError } from "../errors/ThirdPartyError";
import { logger } from "../logging/logger";
import { ThirdPartyTarget } from "../types/operations";
import {
  LoopLoopBizRequest,
  LoopLoopBizResponse,
} from "../types/thirdPartyContracts";

/**
 * Calls the Loop -> Loop Biz API with an already-built request body.
 */
export async function callLoopLoopBizApi(
  accessToken: string,
  body: LoopLoopBizRequest
): Promise<LoopLoopBizResponse> {
  const client = createAuthorizedClient(accessToken);

  try {
    const response = await client.post<LoopLoopBizResponse>(
      config.loopLoopBiz.url(),
      body
    );
    return response.data;
  } catch (err) {
    logger.error("Loop Loop Biz API call failed", {
      target: ThirdPartyTarget.LOOP_LOOP_BIZ,
      error: err instanceof Error ? err.message : err,
    });
    throw new ThirdPartyError(
      ThirdPartyTarget.LOOP_LOOP_BIZ,
      "Failed to process Loop payment",
      err
    );
  }
}
