import React, { useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import MarketIndices from "../components/MarketIndices";
import Watchlist from "../components/Watchlist";
import CandleChart from "../components/CandleChart";
import NewsPanel from "../components/NewsPanel";
import MarketMovers from "../components/MarketMovers";
import TradingSignals from "../components/TradingSignals";
import TimeframeAnalysis from "../components/TimeframeAnalysis";
import SupportResistance from "../components/SupportResistance";

function Dashboard() {

  const [symbol, setSymbol] = useState("AAPL");
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStock = async () => {

    if (!symbol.trim()) {
      alert("Enter Stock Symbol");
      return;
    }

    try {

      setLoading(true);

      const response = await API.get(`/api/stocks/${symbol}`);

      setStock(response.data);

    } catch (error) {

      console.error(error);
      alert("Stock Not Found");

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#0f172a",
          minHeight: "100vh",
          color: "white",
          padding: "30px"
        }}
      >

        {/* Top Dashboard */}
        <MarketIndices />
        <Watchlist />
        <NewsPanel />
        <MarketMovers />

        {/* Analysis Panels */}
        <TradingSignals stock={stock} />
        <TimeframeAnalysis stock={stock} />
        <SupportResistance stock={stock} />

        {/* Header */}
        <div style={{ marginBottom: "30px" }}>

          <h1
            style={{
              marginBottom: "10px",
              fontSize: "34px"
            }}
          >
            QuantumTrade AI Dashboard
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Professional Stock Intelligence & AI Trading Analytics
          </p>

        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "30px"
          }}
        >

          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter Stock Symbol (AAPL / TSLA / RELIANCE.NS)"
            style={{
              padding: "14px",
              width: "350px",
              borderRadius: "10px",
              border: "none",
              background: "#1e293b",
              color: "white",
              outline: "none",
              fontSize: "16px"
            }}
          />

          <button
            onClick={fetchStock}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "14px 30px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Analyze Stock
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px"
            }}
          >
            <h2>Loading AI Analysis...</h2>
          </div>
        )}

        {/* Results */}
        {stock && (
          <>

            {/* Main Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginBottom: "30px"
              }}
            >

              <Card title="Current Price" value={`$${stock.basic.price}`} />
              <Card title="Price Change" value={`${stock.basic.change_pct}%`} />
              <Card title="RSI" value={stock.technical_indicators.rsi} />
              <Card title="AI Signal" value={stock.ai_prediction.signal} />
              <Card title="Confidence" value={`${(stock.ai_prediction.confidence * 100).toFixed(0)}%`} />
              <Card title="Risk Score" value={stock.risk_analysis.risk_score} />

            </div>

            {/* Technical Indicators */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginBottom: "30px"
              }}
            >

              <SmallCard
                title="20-Day MA"
                value={stock.technical_indicators.moving_average_20}
              />

              <SmallCard
                title="Volatility"
                value={`${stock.technical_indicators.volatility}%`}
              />

              <SmallCard
                title="Volume"
                value={stock.technical_indicators.volume}
              />

              <SmallCard
                title="Market Structure"
                value={stock.smart_money.market_structure}
              />

            </div>

            {/* Chart */}
            <div
              style={{
                background: "#1e293b",
                padding: "25px",
                borderRadius: "15px",
                marginBottom: "30px"
              }}
            >

              <h2 style={{ marginBottom: "20px" }}>
                Professional Candlestick Chart
              </h2>

              <CandleChart data={stock.chart_data} />

            </div>

            {/* Bottom Analysis */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}
            >

              <div
                style={{
                  background: "#1e293b",
                  padding: "25px",
                  borderRadius: "15px"
                }}
              >

                <h2 style={{ marginBottom: "20px" }}>
                  AI Trading Summary
                </h2>

                <p><strong>Signal:</strong> {stock.ai_prediction.signal}</p>
                <p><strong>Confidence:</strong> {(stock.ai_prediction.confidence * 100).toFixed(0)}%</p>
                <p><strong>Risk Level:</strong> {stock.risk_analysis.risk_level}</p>
                <p><strong>Prediction Accuracy:</strong> {stock.ai_prediction.prediction_accuracy}%</p>

              </div>

              <div
                style={{
                  background: "#1e293b",
                  padding: "25px",
                  borderRadius: "15px"
                }}
              >

                <h2 style={{ marginBottom: "20px" }}>
                  Smart Money Analysis
                </h2>

                <p><strong>Market Structure:</strong> {stock.smart_money.market_structure}</p>
                <p><strong>Institutional Activity:</strong> {stock.smart_money.institutional_activity}</p>
                <p><strong>Volatility:</strong> {stock.technical_indicators.volatility}%</p>
                <p><strong>Volume:</strong> {stock.technical_indicators.volume}</p>

              </div>

            </div>

          </>
        )}

      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "25px",
        borderRadius: "15px",
        textAlign: "center"
      }}
    >
      <h3 style={{ color: "#94a3b8", marginBottom: "10px" }}>
        {title}
      </h3>

      <h2>{value}</h2>
    </div>
  );
}

function SmallCard({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center"
      }}
    >
      <h4 style={{ color: "#94a3b8", marginBottom: "10px" }}>
        {title}
      </h4>

      <h3>{value}</h3>
    </div>
  );
}

export default Dashboard;