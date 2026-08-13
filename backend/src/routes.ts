import { Router } from "express";
import { handlePayment } from "./controllers/paymentController";
import { handleTransactionStatus } from "./controllers/statusController";
import { handleTransactionHistory } from "./controllers/historyController";

/**
 * Customer-facing route table. This is the only place that maps HTTP
 * verbs/paths to controllers — keeps app.ts focused on app-level wiring.
 */
export const router = Router();

// PAYMENT (both M-Pesa and Loop go through this single endpoint; the
// paymentMethod field in the body determines downstream routing).
router.post("/payments", handlePayment);

// TRANSACTION_STATUS
router.get("/transactions/:transactionId/status", handleTransactionStatus);

// TRANSACTION_HISTORY
router.get("/transactions/history", handleTransactionHistory);

// Basic health check — not part of the spec's operations but useful for
// deployment/monitoring.
router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
