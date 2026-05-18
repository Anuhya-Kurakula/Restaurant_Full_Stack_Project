import axios from "axios";

const API = axios.create({
  baseURL: "https://restaurant-qr-backend.onrender.com/"
});

export const getMenu = () => API.get("menu/");
export const createOrder = (data) => API.post("order/", data);