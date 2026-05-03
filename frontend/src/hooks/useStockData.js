import { useState } from "react";
import { fetchStockData } from "../services/api";

export default function useStockData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStock = async (symbol) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchStockData(symbol);

      if (result?.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result);
      }

    } catch (err) {
      setError("Unexpected error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getStock };
}