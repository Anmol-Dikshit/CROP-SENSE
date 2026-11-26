import axios from "axios";

const API = axios.create({
  baseURL: "https://crop-sense-backend.onrender.com",
  timeout: 30000,
});

export const predict = (formData) => API.post("/predict", formData);

export const getHistory = () => API.get("/history");

export const getModelMetrics = () => API.get("/model/metrics");

export default API;