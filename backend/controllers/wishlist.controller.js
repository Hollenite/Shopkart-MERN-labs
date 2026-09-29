import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const addToWishlist = async (req, res) => {
  const { productId } = req.params;
  const customerId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);
    const customer = await Customer.findById(customerId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    if (customer.wishlist.some((wishlistProduct) => wishlistProduct.equals(product._id))) {
      return res.status(409).json({
        message: "The product is already wishlisted",
      });
    }

    customer.wishlist.push(product._id);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const wishlistIndex = customer.wishlist.findIndex((wishlistProduct) =>
      wishlistProduct.equals(productId),
    );

    if (wishlistIndex === -1) {
      return res.status(404).json({
        message: "Product not found in wishlist",
      });
    }

    customer.wishlist.splice(wishlistIndex, 1);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    await customer.populate({
      path: "wishlist",
      select: "name description price category image stock",
    });

    return res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load wishlist",
    });
  }
};
