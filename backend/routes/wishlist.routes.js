import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const wishlistRoutes = Router();

wishlistRoutes.post("/:productId", protect, addToWishlist);
wishlistRoutes.get("/", protect, getWishlist);
wishlistRoutes.delete("/:productId", protect, removeFromWishlist);

export default wishlistRoutes;
