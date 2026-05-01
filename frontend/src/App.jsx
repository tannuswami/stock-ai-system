import { useEffect, useState } from "react";

function App() {
  const [symbol, setSymbol] = useState("AAPL");
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchStock = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/stocks/${symbol}`);
      const data = await response.json();

      setStock(data);
    } catch (error) {
      console.error("Error fetching stock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "40px" }}>
        📈 AI Stock Prediction Platform
      </h1>

      <div style={{ marginTop: "30px" }}>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter Stock Symbol"
          style={{
            padding: "12px",
            fontSize: "18px",
            width: "250px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <button
          onClick={fetchStock}
          style={{
            marginLeft: "10px",
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Analyze
        </button>
      </div>

      {loading && <h2>Loading...</h2>}

      {stock && (
        <div
          style={{
            marginTop: "40px",
            background: "#1e293b",
            padding: "30px",
            borderRadius: "15px",
            maxWidth: "700px",
          }}
        >
          <h2>{stock.basic.symbol}</h2>

          <h3>Price: ${stock.basic.price}</h3>

          <h3>Change: {stock.basic.change_pct.toFixed(2)}%</h3>

          <h3>RSI: {stock.indicators.rsi}</h3>

          <h2>AI Signal: {stock.ai.signal}</h2>

          <h3>
            Confidence: {(stock.ai.confidence * 100).toFixed(0)}%
          </h3>
        </div>
      )}
    </div>
  );
}

export default App;