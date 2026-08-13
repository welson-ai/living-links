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
    url: () => required("https://sandbox.loop.co.ke/gateway/auth/1.0/oauth2/token"),
    clientId: () => required(process.env.REFRESH_TOKEN_CLIENT_ID),
    clientSecret: () => required(process.env.REFRESH_TOKEN_CLIENT_SECRET),
  },

  mpesaLoopBiz: {
    url: () => required("https://sandbox.loop.co.ke/gateway/mpesa-prompt/2.0/services/process-request"),
  },

  loopLoopBiz: {
    url: () => required("https://sandbox.loop.co.ke/gateway/loop-prompt/2/services/process-request"),
  },

  transactionStatus: {
    url: () => required("https://sandbox.loop.co.ke/gateway/transaction-inquiry/1.0.0/services/process-request"),
  },

  transactionHistory: {
    url: () => required("https://sandbox.loop.co.ke/gateway/transaction-history/1.0.0/services/process-request"),
  },
};
