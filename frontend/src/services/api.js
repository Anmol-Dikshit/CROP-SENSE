import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5001",
  timeout: 15000,
});

export const predict = (formData) => API.post("/predict", formData);
export const getHistory = () => API.get("/history");