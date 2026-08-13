import { OperationType, ThirdPartyTarget } from "../types/operations";
import { CustomerRequestBody } from "../types/customerRequest";
import { resolvePaymentTarget } from "./paymentMethodRouter";
import { ValidationError } from "../errors/ValidationError";

/**
 * Top-level routing decision (spec §14): given a validated customer
 * request, determine which third-party API target should handle it.
 *
 * This module contains NO request-body construction logic — that is the
 * responsibility of builders/*. Its only job is "where does this go"
 * (spec §14 closing note).
 */
export function resolveThirdPartyTarget(
  request: CustomerRequestBody
): ThirdPartyTarget {
  switch (request.operation) {
    case OperationType.PAYMENT:
      return resolvePaymentTarget(request.paymentMethod);

    case OperationType.TRANSACTION_STATUS:
      return ThirdPartyTarget.TRANSACTION_STATUS;

    case OperationType.TRANSACTION_HISTORY:
      return ThirdPartyTarget.TRANSACTION_HISTORY;

    default:
      // Exhaustiveness guard — if a new OperationType is added without
      // updating this router, fail loudly instead of silently misrouting.
      throw new ValidationError(
        `Unsupported operation: ${(request as CustomerRequestBody).operation}`
      );
  }
}
