# Backend API Orchestration Service

An Express + TypeScript backend that sits between the customer/frontend and
several third-party APIs (M-Pesa, Loop, Transaction Status, Transaction
History, Refresh Token), hiding all third-party implementation details from
the customer.

This implementation follows the accompanying specification document
section by section. **Field names, endpoint paths, and third-party request
formats throughout this codebase are placeholders** — per the spec's own
principle #10, these must be confirmed against real API documentation and
the existing repository before being treated as final.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev             # ts-node-dev, auto-restart
```

Build & run compiled JS:

```bash
npm run build
npm start
```

Run tests:

```bash
npm test
```

## Project layout

```
src/
├── auth/            Token validation, refresh, and storage
├── router/           Determines WHERE a request goes (operation -> target)
├── validation/        Zod schemas for incoming customer requests
├── builders/          Transforms validated requests into third-party bodies
├── clients/           Thin HTTP clients per third-party API
├── responses/         Normalizes third-party responses; sanitizes errors
├── errors/            AppError hierarchy + central error middleware
├── logging/           Structured logger + request logging middleware
├── controllers/       HTTP entry points (thin — delegate to services/)
├── services/          Orchestrates auth -> router -> builder -> client per operation
├── types/             Shared TypeScript types/enums
├── config/            Environment configuration
├── routes.ts          Route table mapping paths to controllers
└── app.ts             Express app bootstrap
```

## Endpoints

| Method | Path                                | Operation             |
|--------|--------------------------------------|------------------------|
| POST   | `/payments`                          | PAYMENT (M-Pesa or Loop, decided by `paymentMethod` in body) |
| GET    | `/transactions/:transactionId/status`| TRANSACTION_STATUS     |
| GET    | `/transactions/history`              | TRANSACTION_HISTORY    |
| GET    | `/health`                            | Health check           |

Token refresh is **not** a customer-facing endpoint — it happens
transparently inside `auth/tokenManager.ts` whenever a service needs a
valid access token.

## Design principles encoded in this codebase

1. **Customer never talks to third parties directly** — only to this
   backend (`controllers/` + `routes.ts`).
2. **No raw proxying** — every operation has a dedicated builder in
   `builders/` that constructs the third-party-specific request body.
3. **Routing is separate from request-body construction** — `router/`
   only decides the target; `builders/` only decides the shape.
4. **Auth is separate from business routing** — `auth/tokenManager.ts`
   knows nothing about payments/status/history.
5. **Transparent token refresh** — `getValidAccessToken()` in
   `tokenManager.ts` refreshes only when needed and the calling service
   never has to handle refresh logic itself.
6. **No unnecessary refreshes** — a proactive refresh threshold
   (`TOKEN_REFRESH_THRESHOLD_SECONDS`) avoids refreshing a still-valid
   token.
7. **Per-API request mapping** — one builder + one client per third-party
   API (M-Pesa, Loop, Transaction Status, Transaction History, Refresh
   Token).
8. **Consistent response handling** — `responses/responseNormalizer.ts`
   maps every third-party response onto one unified customer response
   shape.
9. **No leaking internal error details** — `responses/errorSanitizer.ts`
   returns only generic, stable messages to the customer; full details go
   to the logger only.
10. **Nothing here is assumed final** — placeholder field names and URLs
    are marked with comments throughout and must be validated against real
    API docs and the existing repository before going to production.

## What's still a placeholder / needs real input

- Exact field names/types for each third-party request & response body
  (`src/types/thirdPartyContracts.ts`).
- Refresh Token API grant type and headers
  (`src/auth/refreshTokenClient.ts`, `src/builders/refreshRequestBuilder.ts`).
- Token persistence — currently in-memory only
  (`src/auth/tokenStore.ts`); replace with Redis/DB for multi-instance
  deployments.
- Real frontend request/response contract
  (`src/types/customerRequest.ts`).
- Auth on the customer-facing endpoints themselves (this spec covers
  backend -> third-party auth, not customer -> backend auth, which isn't
  addressed here and should be added, e.g. API keys, JWT, session).
