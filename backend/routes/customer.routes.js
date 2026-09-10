import { Router } from "express";
import {
  changePassword,
  createCustomer,
  getMe,
  loginCustomer,
  logoutCustomer,
} from "../controllers/customer.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const customerRoutes = Router();

customerRoutes.post("/register", createCustomer);
customerRoutes.post("/create", createCustomer);
customerRoutes.post("/login", loginCustomer);

customerRoutes.get("/me", protect, getMe);
customerRoutes.post("/logout", protect, logoutCustomer);
customerRoutes.patch("/change-password", protect, changePassword);

export default customerRoutes;
