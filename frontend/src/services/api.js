import axios from "axios";

const BASE_URL = "http://localhost:8000"; // change if your backend runs on different port

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;

export const fetchStockData = async (symbol) => {
  try {
    if (!symbol) throw new Error("Empty Symbol");

    const cleanSymbol = symbol.trim().toUpperCase();

    const response = await API.get(`/api/stocks/${cleanSymbol}`);
    return response.data;

  } catch (error) {
    console.error("API ERROR:", error.message);
    return { error: error.message };
  }
};