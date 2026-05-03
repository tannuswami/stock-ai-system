import React, { useEffect, useState } from "react";
import API from "../services/api";

function MarketIndices() {

  const [indices, setIndices] = useState([]);

  useEffect(() => {
    fetchIndices();
  }, []);

  const fetchIndices = async () => {

    try {

      const response = await API.get("/api/indices");

      setIndices(response.data);

    } catch (error) {

      console.error("Indices Error:", error);

    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "30px"
      }}
    >

      {indices.map((item, index) => (

        <div
          key={index}
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 0 15px rgba(0,0,0,0.2)"
          }}
        >

          <h3
            style={{
              color: "#94a3b8",
              marginBottom: "10px"
            }}
          >
            {item.name}
          </h3>

          <h2>{item.price}</h2>

          <p
            style={{
              color: item.change >= 0 ? "#22c55e" : "#ef4444",
              fontWeight: "bold"
            }}
          >
            {item.change}%
          </p>

        </div>
      ))}

    </div>
  );
}

export default MarketIndices;