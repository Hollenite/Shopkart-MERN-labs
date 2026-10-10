import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import { cookieOptions, generateToken } from "../utils/generateToken.js";

const toPublicCustomer = (customer) => ({
  _id: customer._id,
  fullName: customer.fullName || customer.fullname,
  email: customer.email,
  phone: customer.phone,
});

export const createCustomer = async (req, res) => {
  const fullName = req.body.fullName || req.body.fullname;
  const { email, password, phone } = req.body;

  if (!fullName || !email || !password || !phone) {
    return res.status(400).json({
      message: "Missing Field",
    });
  }

  const emailExist = await Customer.findOne({ email });
  if (emailExist) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password length must be atleast 6",
    });
  }

  const hashedPass = await bcrypt.hash(password, 10);
  const newUser = await Customer.create({
    fullname: fullName,
    email,
    password: hashedPass,
    phone,
  });

  const customer = toPublicCustomer(newUser);

  return res.status(201).json({
    success: true,
    message: "Customer registered successfully",
    customer,
  });
};

export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing Field" });
  }

  const customer = await Customer.findOne({ email });
  if (!customer) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const status = await bcrypt.compare(password, customer.password);
  if (!status) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  generateToken(res, customer._id);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    customer: toPublicCustomer(customer),
  });
};

export const getMe = async (req, res) => {
  const { id } = req.user;
  const customer = await Customer.findById(id).select("-password");

  if (!customer) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const publicCustomer = toPublicCustomer(customer);

  return res.status(200).json({
    ...publicCustomer,
    success: true,
    customer: publicCustomer,
  });
};

export const logoutCustomer = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "Password length must be atleast 6",
    });
  }

  const customer = await Customer.findById(req.user.id);

  if (!customer) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const matches = await bcrypt.compare(oldPassword, customer.password);
  if (!matches) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  customer.password = await bcrypt.hash(newPassword, 10);
  await customer.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};
