import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

const populateCart = async (customer) => {
  await customer.populate({
    path: "cart.product",
    select: "name description price category image stock",
  });

  return customer.cart;
};

const validateProductId = (productId, res) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ message: "Invalid product ID" });
    return false;
  }

  return true;
};

export const addToCart = async (req, res) => {
  const { productId } = req.params;

  if (!validateProductId(productId, res)) return;

  try {
    const [customer, product] = await Promise.all([
      Customer.findById(req.user.id),
      Product.findById(productId),
    ]);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const cartItem = customer.cart.find((item) =>
      item.product.equals(product._id),
    );
    const nextQuantity = cartItem ? cartItem.quantity + 1 : 1;

    if (nextQuantity > product.stock) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock",
      });
    }

    if (cartItem) {
      cartItem.quantity = nextQuantity;
    } else {
      customer.cart.push({ product: product._id, quantity: 1 });
    }

    await customer.save();
    const cart = await populateCart(customer);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const cart = await populateCart(customer);

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load cart" });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!validateProductId(productId, res)) return;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({
      message: "Quantity must be a whole number greater than 0",
    });
  }

  try {
    const [customer, product] = await Promise.all([
      Customer.findById(req.user.id),
      Product.findById(productId),
    ]);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const cartItem = customer.cart.find((item) =>
      item.product.equals(product._id),
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock",
      });
    }

    cartItem.quantity = quantity;
    await customer.save();
    const cart = await populateCart(customer);

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update cart quantity" });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!validateProductId(productId, res)) return;

  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const cartIndex = customer.cart.findIndex((item) =>
      item.product.equals(productId),
    );

    if (cartIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    customer.cart.splice(cartIndex, 1);
    await customer.save();
    const cart = await populateCart(customer);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to remove product from cart" });
  }
};
