function Navbar() {
  return (
    <div
      style={{
        background: "#111827",
        padding: "20px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #1f2937"
      }}
    >

      <div>
        <h2
          style={{
            color: "white",
            margin: 0
          }}
        >
          QuantumTrade AI
        </h2>

        <small style={{ color: "#94a3b8" }}>
          Professional Trading Intelligence Platform
        </small>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          color: "#94a3b8"
        }}
      >
        <span>Dashboard</span>
        <span>Markets</span>
        <span>Portfolio</span>
        <span>Watchlist</span>
      </div>

    </div>
  );
}

export default Navbar;