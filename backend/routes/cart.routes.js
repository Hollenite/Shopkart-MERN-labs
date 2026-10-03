import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cart.controller.js";

const cartRoutes = Router();

cartRoutes.post("/:productId", protect, addToCart);
cartRoutes.get("/", protect, getCart);
cartRoutes.patch("/:productId", protect, updateCartQuantity);
cartRoutes.delete("/:productId", protect, removeFromCart);

export default cartRoutes;
