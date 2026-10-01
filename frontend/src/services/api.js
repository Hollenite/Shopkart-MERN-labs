import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4567/customers",
  withCredentials: true,
});

export const registerCustomer = (customerData) => {
  return api.post("/register", customerData);
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

const productApi = axios.create({
  baseURL: "http://localhost:4567/products",
});

export const getProducts = (params) => {
  return productApi.get("/", { params });
};

export const getProduct = (id) => {
  return productApi.get(`/${id}`);
};

const wishlistApi = axios.create({
  baseURL: "http://localhost:4567/wishlist",
  withCredentials: true,
});

export const addToWishlist = (id) => {
  return wishlistApi.post(`/${id}`);
};

export const getWishlist = () => {
  return wishlistApi.get("/");
};

export const removeFromWishlist = (id) => {
  return wishlistApi.delete(`/${id}`);
};
