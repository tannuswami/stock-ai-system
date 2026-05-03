import React from "react";

function MarketMovers() {

  const gainers = [
    { symbol: "NVDA", change: "+5.21%" },
    { symbol: "RELIANCE.NS", change: "+3.80%" },
    { symbol: "TCS.NS", change: "+2.95%" }
  ];

  const losers = [
    { symbol: "TSLA", change: "-4.10%" },
    { symbol: "META", change: "-2.35%" },
    { symbol: "INFY.NS", change: "-1.85%" }
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "30px"
      }}
    >

      {/* Top Gainers */}
      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "15px"
        }}
      >

        <h2 style={{ marginBottom: "20px", color: "#22c55e" }}>
          Top Gainers
        </h2>

        {gainers.map((stock, index) => (
          <div
            key={index}
            style={{
              background: "#0f172a",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{stock.symbol}</span>
            <span style={{ color: "#22c55e" }}>
              {stock.change}
            </span>
          </div>
        ))}

      </div>

      {/* Top Losers */}
      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "15px"
        }}
      >

        <h2 style={{ marginBottom: "20px", color: "#ef4444" }}>
          Top Losers
        </h2>

        {losers.map((stock, index) => (
          <div
            key={index}
            style={{
              background: "#0f172a",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{stock.symbol}</span>
            <span style={{ color: "#ef4444" }}>
              {stock.change}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}

export default MarketMovers;