import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),

  token: {
    // How many seconds before actual expiry we proactively refresh.
    refreshThresholdSeconds: Number(
      process.env.TOKEN_REFRESH_THRESHOLD_SECONDS ?? 60
    ),
  },

  thirdParty: {
    timeoutMs: Number(process.env.THIRD_PARTY_TIMEOUT_MS ?? 15000),
  },

  refreshToken: {
    url: () => required("REFRESH_TOKEN_API_URL"),
    clientId: () => required("REFRESH_TOKEN_CLIENT_ID"),
    clientSecret: () => required("REFRESH_TOKEN_CLIENT_SECRET"),
  },

  mpesaLoopBiz: {
    url: () => required("MPESA_LOOP_BIZ_API_URL"),
  },

  loopLoopBiz: {
    url: () => required("LOOP_LOOP_BIZ_API_URL"),
  },

  transactionStatus: {
    url: () => required("TRANSACTION_STATUS_API_URL"),
  },

  transactionHistory: {
    url: () => required("TRANSACTION_HISTORY_API_URL"),
  },
};
