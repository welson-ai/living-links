/**
 * Shared enums describing the operations this backend supports and the
 * payment-method sub-routing used for PAYMENT operations.
 *
 * These are internal, canonical values the router/services use once a
 * customer request has been validated — they are not necessarily the same
 * literal strings the frontend sends (validation layer maps external input
 * onto these).
 */

export enum OperationType {
  PAYMENT = "PAYMENT",
  TRANSACTION_STATUS = "TRANSACTION_STATUS",
  TRANSACTION_HISTORY = "TRANSACTION_HISTORY",
}

export enum PaymentMethod {
  MPESA = "MPESA",
  LOOP = "LOOP",
}

export enum ThirdPartyTarget {
  MPESA_LOOP_BIZ = "MPESA_LOOP_BIZ",
  LOOP_LOOP_BIZ = "LOOP_LOOP_BIZ",
  TRANSACTION_STATUS = "TRANSACTION_STATUS",
  TRANSACTION_HISTORY = "TRANSACTION_HISTORY",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}
