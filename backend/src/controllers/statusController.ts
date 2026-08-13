import { NextFunction, Request, Response } from "express";
import { getTransactionStatus } from "../services/statusService";
import { OperationType } from "../types/operations";

/**
 * GET /transactions/:transactionId/status
 */
export async function handleTransactionStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getTransactionStatus({
      operation: OperationType.TRANSACTION_STATUS,
      transactionId: req.params.transactionId,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
