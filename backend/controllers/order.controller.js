import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const requiredAddressFields = [
  "fullName",
  "phone",
  "addressLine1",
  "city",
  "state",
  "pincode",
];

const validateShippingAddress = (shippingAddress) => {
  if (!shippingAddress || requiredAddressFields.some((field) => !shippingAddress[field]?.trim())) {
    return "All shipping fields are required";
  }

  if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
    return "Phone must contain 10 digits";
  }

  if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
    return "Pincode must contain 6 digits";
  }

  return "";
};

export const createPaymentOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  const addressError = validateShippingAddress(shippingAddress);

  if (addressError) {
    return res.status(400).json({ message: addressError });
  }

  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!customer.cart.length) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const products = await Promise.all(
      customer.cart.map((cartItem) => Product.findById(cartItem.product)),
    );
    const orderItems = [];
    let totalAmount = 0;

    for (let index = 0; index < customer.cart.length; index += 1) {
      const cartItem = customer.cart[index];
      const product = products[index];

      if (!product) {
        return res.status(404).json({ message: "A product in your cart no longer exists" });
      }

      if (cartItem.quantity > product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      });
      totalAmount += product.price * cartItem.quantity;
    }

    const order = await Order.create({
      user: customer._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
    });

    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: order._id.toString(),
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(201).json({
        success: true,
        shopKartOrderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (razorpayError) {
      await Order.findByIdAndDelete(order._id);
      return res.status(500).json({ message: "Unable to create payment order" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Unable to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  const {
    shopKartOrderId,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
    return res.status(400).json({ message: "Invalid ShopKart order ID" });
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ message: "Incomplete payment details" });
  }

  try {
    const order = await Order.findOne({
      _id: shopKartOrderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(200).json({ success: true, order });
    }

    if (order.razorpayOrderId !== razorpayOrderId) {
      return res.status(400).json({ message: "Payment order does not match" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpaySignature);
    const signaturesMatch =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signaturesMatch) {
      order.paymentStatus = "FAILED";
      await order.save();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const customer = await Customer.findById(req.user.id);
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    if (customer) {
      customer.cart = [];
      await customer.save();
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ message: "Unable to verify payment" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load orders" });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const order = await Order.findOne({ _id: id, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load order" });
  }
};
