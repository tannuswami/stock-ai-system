const BASE_URL = "http://localhost:8000"; // change if your backend runs on different port

export const fetchStockData = async (symbol) => {
  try {
    if (!symbol) throw new Error("Empty Symbol");

    const cleanSymbol = symbol.trim().toUpperCase();

    const response = await fetch(`${BASE_URL}/stock/${cleanSymbol}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Stock fetch failed");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API ERROR:", error.message);
    return { error: error.message };
  }
};