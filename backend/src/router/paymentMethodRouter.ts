import { PaymentMethod, ThirdPartyTarget } from "../types/operations";
import { ValidationError } from "../errors/ValidationError";

/**
 * Sub-routing for PAYMENT operations, based on the customer's selected
 * payment method (spec §6). Kept as its own module so payment-method
 * routing can grow (e.g. a third payment method later) without touching
 * the top-level requestRouter.ts.
 */
export function resolvePaymentTarget(
  paymentMethod: PaymentMethod
): ThirdPartyTarget {
  switch (paymentMethod) {
    case PaymentMethod.MPESA:
      return ThirdPartyTarget.MPESA_LOOP_BIZ;

    case PaymentMethod.LOOP:
      return ThirdPartyTarget.LOOP_LOOP_BIZ;

    default:
      throw new ValidationError(
        `Unsupported payment method: ${paymentMethod as PaymentMethod}`
      );
  }
}
