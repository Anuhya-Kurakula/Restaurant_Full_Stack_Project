import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.36:8000/"
});

export const getMenu = () => API.get("menu/");
export const createOrder = (data) => API.post("order/", data);