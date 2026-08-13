/**
 * Thin re-export layer so third-party endpoint URLs can be imported
 * without reaching into the whole config object. Kept separate from
 * config/index.ts so endpoint wiring is easy to find/update on its own.
 */
import { config } from "./index";

export const thirdPartyEndpoints = {
  refreshToken: config.refreshToken.url,
  mpesaLoopBiz: config.mpesaLoopBiz.url,
  loopLoopBiz: config.loopLoopBiz.url,
  transactionStatus: config.transactionStatus.url,
  transactionHistory: config.transactionHistory.url,
};
