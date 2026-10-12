import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4567").replace(
  /\/$/,
  "",
);

const withCredentials = {
  withCredentials: true,
};

const api = axios.create({
  baseURL: `${API_URL}/customers`,
  ...withCredentials,
});

const productApi = axios.create({
  baseURL: `${API_URL}/products`,
});

const wishlistApi = axios.create({
  baseURL: `${API_URL}/wishlist`,
  ...withCredentials,
});

const cartApi = axios.create({
  baseURL: `${API_URL}/cart`,
  ...withCredentials,
});

const orderApi = axios.create({
  baseURL: `${API_URL}/orders`,
  ...withCredentials,
});

export const registerCustomer = (customerData) => {
  return api.post("/register", customerData);
};

export const changePassword = (passwordData) => {
  return api.patch("/change-password", passwordData);
};

export const loginCustomer = (customerData) => {
  return api.post("/login", customerData);
};

export const getMe = () => {
  return api.get("/me");
};

export const logoutCustomer = () => {
  return api.post("/logout");
};

export const getProducts = (params) => {
  return productApi.get("/", { params });
};

export const getProduct = (id) => {
  return productApi.get(`/${id}`);
};

export const addToWishlist = (id) => {
  return wishlistApi.post(`/${id}`);
};

export const getWishlist = () => {
  return wishlistApi.get("/");
};

export const removeFromWishlist = (id) => {
  return wishlistApi.delete(`/${id}`);
};

export const getCart = () => {
  return cartApi.get("/");
};

export const addToCart = (id) => {
  return cartApi.post(`/${id}`);
};

export const updateCartQuantity = (id, quantity) => {
  return cartApi.patch(`/${id}`, { quantity });
};

export const removeFromCart = (id) => {
  return cartApi.delete(`/${id}`);
};

export const createPaymentOrder = (shippingAddress) => {
  return orderApi.post("/create-payment-order", { shippingAddress });
};

export const verifyPayment = (paymentData) => {
  return orderApi.post("/verify-payment", paymentData);
};

export const getOrders = () => {
  return orderApi.get("/");
};

export const getOrder = (id) => {
  return orderApi.get(`/${id}`);
};
