import { useEffect, useState } from "react";
import {
  addToCart as addToCartRequest,
  getCart,
  removeFromCart as removeFromCartRequest,
  updateCartQuantity as updateCartQuantityRequest,
} from "../services/api";
import { CartContext } from "./cart-context";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const refreshCart = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCart();
      setCartItems(response.data.cart || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart()
      .then((response) => {
        setCartItems(response.data.cart || []);
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load cart");
      })
      .finally(() => setLoading(false));
  }, []);

  const runCartAction = async (productId, request) => {
    setActionLoading(productId);
    setError("");

    try {
      const response = await request();
      setCartItems(response.data.cart || []);
      return response;
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update cart");
      throw requestError;
    } finally {
      setActionLoading("");
    }
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0,
  );
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        clearCart,
        loading,
        error,
        actionLoading,
        refreshCart,
        addToCart: (productId) =>
          runCartAction(productId, () => addToCartRequest(productId)),
        updateQuantity: (productId, quantity) =>
          runCartAction(productId, () =>
            updateCartQuantityRequest(productId, quantity),
          ),
        removeFromCart: (productId) =>
          runCartAction(productId, () => removeFromCartRequest(productId)),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
