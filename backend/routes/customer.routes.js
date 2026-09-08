import { Router } from "express";
import { createCustomer, loginCustomer } from "../controllers/customer.controller.js";

const customerRoutes = Router();

customerRoutes.post("/register", createCustomer);
customerRoutes.post("/create", createCustomer);
customerRoutes.post("/login", loginCustomer);

export default customerRoutes;
