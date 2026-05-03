import React from "react";

function TimeframeAnalysis({ stock }) {

  if (!stock) return null;

  const data = [
    {
      timeframe: "15 Min",
      signal: "BUY",
      trend: "Bullish"
    },
    {
      timeframe: "1 Hour",
      signal: "HOLD",
      trend: "Neutral"
    },
    {
      timeframe: "1 Day",
      signal: "BUY",
      trend: "Bullish"
    },
    {
      timeframe: "1 Week",
      signal: "STRONG BUY",
      trend: "Strong Bullish"
    }
  ];

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
        Multi-Timeframe Analysis
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px"
        }}
      >

        {data.map((item, index) => (

          <div
            key={index}
            style={{
              background: "#0f172a",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center"
            }}
          >

            <h3 style={{ marginBottom: "10px" }}>
              {item.timeframe}
            </h3>

            <p
              style={{
                color:
                  item.signal.includes("BUY")
                    ? "#22c55e"
                    : "#facc15",
                fontWeight: "bold"
              }}
            >
              {item.signal}
            </p>

            <p style={{ color: "#94a3b8" }}>
              {item.trend}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default TimeframeAnalysis;