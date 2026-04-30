from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
import uvicorn

# =========================
# FastAPI App
# =========================
app = FastAPI(
    title="AI Stock Platform",
    version="1.0.0"
)

# =========================
# CORS Middleware
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Models
# =========================
class StockBasic(BaseModel):
    symbol: str
    price: float
    change_pct: float


class StockResponse(BaseModel):
    basic: Dict
    indicators: Dict
    ai: Dict
    chart_data: list


# =========================
# Root Route
# =========================
@app.get("/")
def root():
    return {
        "message": "🚀 AI Stock Platform Running!",
        "docs": "/docs"
    }


# =========================
# Health Check
# =========================
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "backend": "working"
    }


# =========================
# Search Stock
# =========================
@app.get("/api/stocks/search")
def search_stocks(q: str):
    try:
        symbol = q.upper()

        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="1d")

        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock not found")

        current = hist.iloc[-1]

        return {
            "symbol": symbol,
            "name": info.get("longName", symbol),
            "price": float(current["Close"]),
            "change_pct": info.get("regularMarketChangePercent", 0)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# RSI Calculator
# =========================
def calculate_rsi(prices, period=14):
    delta = prices.diff()

    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return float(rsi.iloc[-1]) if not rsi.empty else 50.0


# =========================
# Stock Details
# =========================
@app.get("/api/stocks/{symbol}")
def get_stock(symbol: str):
    try:
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period="3mo")

        if hist.empty:
            raise HTTPException(status_code=404, detail="No stock data found")

        current = hist.iloc[-1]
        prev = hist.iloc[-2] if len(hist) > 1 else current

        rsi = calculate_rsi(hist["Close"])

        # AI Signal Logic
        if rsi < 30:
            signal = "STRONG BUY"
            confidence = 0.90
        elif rsi > 70:
            signal = "STRONG SELL"
            confidence = 0.90
        else:
            signal = "HOLD"
            confidence = 0.60

        chart_data = []

        for index, row in hist.tail(50).iterrows():
            chart_data.append({
                "date": str(index.date()),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"])
            })

        return {
            "basic": {
                "symbol": symbol.upper(),
                "price": float(current["Close"]),
                "change": float(current["Close"] - prev["Close"]),
                "change_pct": float(
                    ((current["Close"] - prev["Close"]) / prev["Close"]) * 100
                )
            },
            "indicators": {
                "rsi": round(rsi, 2),
                "volume": int(current["Volume"])
            },
            "ai": {
                "signal": signal,
                "confidence": confidence
            },
            "chart_data": chart_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# Run Server
# =========================
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )