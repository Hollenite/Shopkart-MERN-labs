import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";

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

  return res.status(200).json({
    success: true,
    message: "Login successful",
    customer: toPublicCustomer(customer),
  });
};
