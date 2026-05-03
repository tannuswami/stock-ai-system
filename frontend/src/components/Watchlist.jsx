import React, { useState } from "react";

function Watchlist() {

  const [watchlist, setWatchlist] = useState([
    "AAPL",
    "TSLA",
    "MSFT",
    "RELIANCE.NS",
    "TCS.NS"
  ]);

  const [newStock, setNewStock] = useState("");

  const addStock = () => {

    if (!newStock) return;

    if (!watchlist.includes(newStock.toUpperCase())) {

      setWatchlist([
        ...watchlist,
        newStock.toUpperCase()
      ]);

      setNewStock("");
    }
  };

  const removeStock = (symbol) => {

    const filtered = watchlist.filter(
      (item) => item !== symbol
    );

    setWatchlist(filtered);
  };

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "30px"
      }}
    >

      <h2 style={{ marginBottom: "20px" }}>
        Watchlist
      </h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}
      >

        <input
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          placeholder="Add Symbol"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            width: "250px"
          }}
        />

        <button
          onClick={addStock}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Add
        </button>

      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >

        {watchlist.map((stock, index) => (

          <div
            key={index}
            style={{
              background: "#0f172a",
              padding: "10px 15px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >

            <span>{stock}</span>

            <button
              onClick={() => removeStock(stock)}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                padding: "3px 8px"
              }}
            >
              X
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Watchlist;