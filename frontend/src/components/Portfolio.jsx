import React, { useState } from "react";

function Portfolio() {

  const [portfolio, setPortfolio] = useState([
    {
      symbol: "AAPL",
      shares: 10,
      buyPrice: 180,
      currentPrice: 195
    },
    {
      symbol: "TSLA",
      shares: 5,
      buyPrice: 220,
      currentPrice: 240
    }
  ]);

  const calculateProfit = (item) => {
    return (
      (item.currentPrice - item.buyPrice) * item.shares
    ).toFixed(2);
  };

  const totalPortfolioValue = portfolio.reduce((acc, item) => {
    return acc + (item.currentPrice * item.shares);
  }, 0);

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
        Portfolio Tracker
      </h2>

      <div
        style={{
          display: "grid",
          gap: "15px"
        }}
      >

        {portfolio.map((stock, index) => (

          <div
            key={index}
            style={{
              background: "#0f172a",
              padding: "15px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >

            <div>
              <h3>{stock.symbol}</h3>
              <p>Shares: {stock.shares}</p>
            </div>

            <div>
              <p>Buy: ${stock.buyPrice}</p>
              <p>Current: ${stock.currentPrice}</p>
            </div>

            <div>
              <h3
                style={{
                  color:
                    calculateProfit(stock) >= 0
                      ? "#22c55e"
                      : "#ef4444"
                }}
              >
                ${calculateProfit(stock)}
              </h3>
            </div>

          </div>
        ))}

      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#0f172a",
          borderRadius: "10px"
        }}
      >

        <h2>
          Total Portfolio Value: $
          {totalPortfolioValue.toFixed(2)}
        </h2>

      </div>

    </div>
  );
}

export default Portfolio;