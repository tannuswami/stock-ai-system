import React from "react";

function SupportResistance({ stock }) {

  if (!stock) return null;

  const currentPrice = stock.basic.price;

  const resistance1 = (currentPrice * 1.03).toFixed(2);
  const resistance2 = (currentPrice * 1.06).toFixed(2);

  const support1 = (currentPrice * 0.97).toFixed(2);
  const support2 = (currentPrice * 0.94).toFixed(2);

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
        Support & Resistance Zones
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px"
        }}
      >

        <LevelCard
          title="Support 1"
          value={`$${support1}`}
          color="#22c55e"
        />

        <LevelCard
          title="Support 2"
          value={`$${support2}`}
          color="#16a34a"
        />

        <LevelCard
          title="Resistance 1"
          value={`$${resistance1}`}
          color="#ef4444"
        />

        <LevelCard
          title="Resistance 2"
          value={`$${resistance2}`}
          color="#dc2626"
        />

      </div>

    </div>
  );
}

function LevelCard({ title, value, color }) {
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

export default SupportResistance;