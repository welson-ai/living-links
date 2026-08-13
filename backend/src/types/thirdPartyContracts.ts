/**
 * Placeholder shapes for each third-party API's request/response bodies.
 *
 * These are intentionally generic. Per spec section 9 and principle #10,
 * the real field names, required/optional fields, data types, enumerated
 * values, and headers must be confirmed against actual API documentation
 * before these are relied upon. Treat every interface here as a contract
 * stub to be replaced once the real docs are available.
 */

// ---- M-Pesa -> Loop Biz -------------------------------------------------

export interface MpesaLoopBizRequest {
  amount?: number;
  currency?: string;
  msisdn?: string; // phone number, third-party-specific field name
  accountReference?: string;
  narrative?: string;
}

export interface MpesaLoopBizResponse {
  transactionId?: string;
  status?: string;
  raw?: unknown;
}

// ---- Loop -> Loop Biz ----------------------------------------------------

export interface LoopLoopBizRequest {
  amount?: number;
  currency?: string;
  customerId?: string;
  memo?: string;
}

export interface LoopLoopBizResponse {
  transactionId?: string;
  status?: string;
  raw?: unknown;
}

// ---- Transaction Status ---------------------------------------------------

export interface TransactionStatusRequest {
  transactionId?: string;
}

export interface TransactionStatusResponse {
  transactionId?: string;
  status?: string;
  updatedAt?: string;
  raw?: unknown;
}

// ---- Transaction History ---------------------------------------------------

export interface TransactionHistoryRequest {
  customerId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface TransactionHistoryResponse {
  transactions?: unknown[];
  page?: number;
  pageSize?: number;
  total?: number;
  raw?: unknown;
}

// ---- Refresh Token ---------------------------------------------------------

export interface RefreshTokenRequest {
  clientId?: string;
  clientSecret?: string;
  grantType?: "client_credentials" | "refresh_token";
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  accessToken?: string;
  expiresIn?: number; // seconds
  tokenType?: string;
  refreshToken?: string;
}
