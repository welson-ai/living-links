import { OperationType } from "../types/operations";
import { CustomerResponseBody } from "../types/customerRequest";
import {
  MpesaLoopBizResponse,
  LoopLoopBizResponse,
  TransactionStatusResponse,
  TransactionHistoryResponse,
} from "../types/thirdPartyContracts";

/**
 * Maps each third-party response shape onto the single, unified
 * CustomerResponseBody shape the frontend receives — regardless of which
 * third-party API actually served the request (spec principle #1: hide
 * third-party details from the customer).
 */

export function normalizePaymentResponse(
  result: MpesaLoopBizResponse | LoopLoopBizResponse
): CustomerResponseBody {
  return {
    success: true,
    operation: OperationType.PAYMENT,
    data: {
      transactionId: result.transactionId,
      status: result.status,
    },
  };
}

export function normalizeStatusResponse(
  result: TransactionStatusResponse
): CustomerResponseBody {
  return {
    success: true,
    operation: OperationType.TRANSACTION_STATUS,
    data: {
      transactionId: result.transactionId,
      status: result.status,
      updatedAt: result.updatedAt,
    },
  };
}

export function normalizeHistoryResponse(
  result: TransactionHistoryResponse
): CustomerResponseBody {
  return {
    success: true,
    operation: OperationType.TRANSACTION_HISTORY,
    data: {
      transactions: result.transactions,
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    },
  };
}
