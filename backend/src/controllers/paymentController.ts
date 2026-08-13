import { NextFunction, Request, Response } from "express";
import { processPayment } from "../services/paymentService";

/**
 * POST /payments
 * Handles both M-Pesa and Loop payments — paymentMethod in the body
 * decides the downstream routing (spec §6). This controller stays thin:
 * it only translates HTTP <-> service call.
 */
export async function handlePayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await processPayment(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
