import React from "react";

function NewsPanel() {

  const news = [
    {
      title: "Apple Reports Strong Quarterly Earnings",
      sentiment: "Positive"
    },
    {
      title: "Tesla Faces Production Slowdown",
      sentiment: "Negative"
    },
    {
      title: "NIFTY Hits New High This Week",
      sentiment: "Positive"
    },
    {
      title: "Bank Nifty Shows Bullish Momentum",
      sentiment: "Positive"
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
        Market News & Sentiment
      </h2>

      {news.map((item, index) => (

        <div
          key={index}
          style={{
            background: "#0f172a",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >

          <span>{item.title}</span>

          <span
            style={{
              color:
                item.sentiment === "Positive"
                  ? "#22c55e"
                  : "#ef4444",
              fontWeight: "bold"
            }}
          >
            {item.sentiment}
          </span>

        </div>
      ))}

    </div>
  );
}

export default NewsPanel;