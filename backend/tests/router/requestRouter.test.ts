import { resolveThirdPartyTarget } from "../../src/router/requestRouter";
import { OperationType, PaymentMethod, ThirdPartyTarget } from "../../src/types/operations";

describe("requestRouter", () => {
  it("routes M-Pesa payments to MPESA_LOOP_BIZ", () => {
    const target = resolveThirdPartyTarget({
      operation: OperationType.PAYMENT,
      paymentMethod: PaymentMethod.MPESA,
      amount: 100,
      currency: "KES",
      customer: { customerId: "cust-1", phoneNumber: "254700000000" },
    });
    expect(target).toBe(ThirdPartyTarget.MPESA_LOOP_BIZ);
  });

  it("routes Loop payments to LOOP_LOOP_BIZ", () => {
    const target = resolveThirdPartyTarget({
      operation: OperationType.PAYMENT,
      paymentMethod: PaymentMethod.LOOP,
      amount: 100,
      currency: "KES",
      customer: { customerId: "cust-1" },
    });
    expect(target).toBe(ThirdPartyTarget.LOOP_LOOP_BIZ);
  });

  it("routes transaction status requests to TRANSACTION_STATUS", () => {
    const target = resolveThirdPartyTarget({
      operation: OperationType.TRANSACTION_STATUS,
      transactionId: "txn-1",
    });
    expect(target).toBe(ThirdPartyTarget.TRANSACTION_STATUS);
  });

  it("routes transaction history requests to TRANSACTION_HISTORY", () => {
    const target = resolveThirdPartyTarget({
      operation: OperationType.TRANSACTION_HISTORY,
      customer: { customerId: "cust-1" },
    });
    expect(target).toBe(ThirdPartyTarget.TRANSACTION_HISTORY);
  });
});
