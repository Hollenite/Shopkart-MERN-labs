import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createPaymentOrder,
  getOrderById,
  getOrders,
  verifyPayment,
} from "../controllers/order.controller.js";

const orderRoutes = Router();

orderRoutes.post("/create-payment-order", protect, createPaymentOrder);
orderRoutes.post("/verify-payment", protect, verifyPayment);
orderRoutes.get("/", protect, getOrders);
orderRoutes.get("/:id", protect, getOrderById);

export default orderRoutes;
