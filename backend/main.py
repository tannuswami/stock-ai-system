from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import uvicorn

# ==========================
# FastAPI App
# ==========================
app = FastAPI(
    title="AI Stock Platform",
    version="1.0.0"
)

# ==========================
# CORS
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Root
# ==========================
@app.get("/")
def root():
    return {
        "message": "🚀 AI Stock Platform Running!",
        "docs": "/docs"
    }

# ==========================
# Health Check
# ==========================
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "backend": "working"
    }

# ==========================
# RSI Calculator
# ==========================
def calculate_rsi(prices, period=14):
    delta = prices.diff()

    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(period).mean()
    avg_loss = loss.rolling(period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    latest = rsi.iloc[-1]

    if pd.isna(latest):
        return 50.0

    return round(float(latest), 2)

# ==========================
# Stock Route
# ==========================
@app.get("/api/stocks/{symbol}")
def get_stock(symbol: str):

    try:
        symbol = symbol.upper()

        ticker = yf.Ticker(symbol)

        hist = ticker.history(
            period="6mo",
            interval="1d"
        )

        if hist.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No stock data found for {symbol}"
            )

        current = hist.iloc[-1]
        prev = hist.iloc[-2]

        price = float(current["Close"])
        prev_price = float(prev["Close"])

        change_pct = ((price - prev_price) / prev_price) * 100

        rsi = calculate_rsi(hist["Close"])

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

        for idx, row in hist.tail(50).iterrows():
            chart_data.append({
                "date": str(idx.date()),
                "close": round(float(row["Close"]), 2)
            })

        return {
            "basic": {
                "symbol": symbol,
                "price": round(price, 2),
                "change_pct": round(change_pct, 2)
            },
            "indicators": {
                "rsi": rsi,
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

# ==========================
# Run Server
# ==========================
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )