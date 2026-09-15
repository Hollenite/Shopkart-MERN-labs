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
