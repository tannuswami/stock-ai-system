import React from "react";

function TradingSignals({ stock }) {

  if (!stock) return null;

  const signal = stock.ai_prediction.signal;
  const confidence = (stock.ai_prediction.confidence * 100).toFixed(0);

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
        Trading Signals
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px"
        }}
      >

        <SignalCard
          title="AI Signal"
          value={signal}
          color={
            signal.includes("BUY")
              ? "#22c55e"
              : signal.includes("SELL")
              ? "#ef4444"
              : "#facc15"
          }
        />

        <SignalCard
          title="Confidence"
          value={`${confidence}%`}
          color="#3b82f6"
        />

        <SignalCard
          title="Suggested Entry"
          value={`$${stock.basic.price}`}
          color="#14b8a6"
        />

        <SignalCard
          title="Risk Level"
          value={stock.risk_analysis.risk_level}
          color="#f97316"
        />

      </div>

    </div>
  );
}

function SignalCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        border: `1px solid ${color}`
      }}
    >
      <h4
        style={{
          color: "#94a3b8",
          marginBottom: "10px"
        }}
      >
        {title}
      </h4>

      <h2 style={{ color }}>
        {value}
      </h2>
    </div>
  );
}

export default TradingSignals;