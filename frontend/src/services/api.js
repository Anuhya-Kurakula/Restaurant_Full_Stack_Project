import axios from "axios";

// Automatically use local backend during development or configured REACT_APP_API_URL
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, "") + "/",
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getMenu = () => API.get("menu/");
export const createOrder = (data) => API.post("order/", data);
export const getOrders = () => API.get("orders/");
export const updateOrder = (id, data) => API.patch(`orders/${id}/`, data);
export const getOrderStatus = () => API.get("order-status/");

export default API;