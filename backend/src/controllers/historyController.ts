import { NextFunction, Request, Response } from "express";
import { getTransactionHistory } from "../services/historyService";
import { OperationType } from "../types/operations";

/**
 * GET /transactions/history
 * Expects query params: customerId (required), from, to, page, pageSize.
 */
export async function handleTransactionHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { customerId, from, to, page, pageSize } = req.query;

    const result = await getTransactionHistory({
      operation: OperationType.TRANSACTION_HISTORY,
      customer: { customerId: String(customerId ?? "") },
      from: from ? String(from) : undefined,
      to: to ? String(to) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
