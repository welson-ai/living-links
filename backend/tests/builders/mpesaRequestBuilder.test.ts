import { buildMpesaLoopBizRequest } from "../../src/builders/mpesaRequestBuilder";
import { PaymentMethod, OperationType } from "../../src/types/operations";

describe("mpesaRequestBuilder", () => {
  it("builds a valid M-Pesa request body from a validated payment request", () => {
    const result = buildMpesaLoopBizRequest({
      operation: OperationType.PAYMENT,
      paymentMethod: PaymentMethod.MPESA,
      amount: 500,
      currency: "KES",
      customer: { customerId: "cust-1", phoneNumber: "+254700000000" },
      transaction: { reference: "REF123", description: "Order #123" },
    });

    expect(result).toEqual({
      amount: 500,
      currency: "KES",
      msisdn: "254700000000",
      accountReference: "REF123",
      narrative: "Order #123",
    });
  });

  it("throws a ValidationError when phoneNumber is missing", () => {
    expect(() =>
      buildMpesaLoopBizRequest({
        operation: OperationType.PAYMENT,
        paymentMethod: PaymentMethod.MPESA,
        amount: 500,
        currency: "KES",
        customer: { customerId: "cust-1" },
      })
    ).toThrow(/phoneNumber is required/);
  });
});
