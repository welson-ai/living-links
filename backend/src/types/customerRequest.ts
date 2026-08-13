import { OperationType, PaymentMethod } from "./operations";

/**
 * Shapes of the requests the customer/frontend sends to OUR backend.
 *
 * IMPORTANT: These are placeholders. The exact field names/types must be
 * confirmed against the real frontend contract before this is treated as
 * final (see spec principle #10 — do not assume fields without inspecting
 * existing integrations).
 */

export interface CustomerInfo {
  customerId: string;
  phoneNumber?: string;
  email?: string;
}

export interface TransactionInfo {
  reference?: string;
  description?: string;
}

export interface PaymentRequestBody {
  operation: OperationType.PAYMENT;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  customer: CustomerInfo;
  transaction?: TransactionInfo;
}

export interface TransactionStatusRequestBody {
  operation: OperationType.TRANSACTION_STATUS;
  transactionId: string;
}

export interface TransactionHistoryRequestBody {
  operation: OperationType.TRANSACTION_HISTORY;
  customer: CustomerInfo;
  from?: string; // ISO date
  to?: string; // ISO date
  page?: number;
  pageSize?: number;
}

export type CustomerRequestBody =
  | PaymentRequestBody
  | TransactionStatusRequestBody
  | TransactionHistoryRequestBody;

/**
 * Unified, normalized shape returned to the customer regardless of which
 * third-party API actually handled the request. Third-party-specific
 * fields/errors must never leak through untranslated (spec principle #9).
 */
export interface CustomerResponseBody {
  success: boolean;
  operation: OperationType;
  data?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
  };
}
