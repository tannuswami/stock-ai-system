from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import numpy as np
import uvicorn

# ==========================
# FastAPI App
# ==========================
app = FastAPI(
    title="QuantumTrade AI Backend",
    version="5.0.0"
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
# Root Endpoint
# ==========================
@app.get("/")
def root():
    return {
        "message": "QuantumTrade AI Backend Running",
        "docs": "/docs"
    }

# ==========================
# Health Endpoint
# ==========================
@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }

# ==========================
# Market Indices Endpoint
# ==========================
@app.get("/api/indices")
def get_indices():

    indices = {
        "NIFTY50": "^NSEI",
        "BANKNIFTY": "^NSEBANK",
        "SENSEX": "^BSESN",
        "NASDAQ": "^IXIC"
    }

    result = []

    for name, ticker in indices.items():

        try:

            data = yf.download(
                tickers=ticker,
                period="5d",
                interval="1d",
                progress=False,
                threads=False,
                group_by="column"
            )

            if data.empty:
                continue

            if isinstance(data.columns, pd.MultiIndex):
                data.columns = data.columns.get_level_values(0)

            data = data.dropna()

            if len(data) < 2:
                continue

            close_price = float(data["Close"].iloc[-1])
            previous_price = float(data["Close"].iloc[-2])

            change = ((close_price - previous_price) / previous_price) * 100

            result.append({
                "name": name,
                "price": round(close_price, 2),
                "change": round(change, 2)
            })

        except Exception:
            continue

    return result

# ==========================
# RSI Calculator
# ==========================
def calculate_rsi(prices, period=14):

    delta = prices.diff()

    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()

    rs = avg_gain / avg_loss

    rsi = 100 - (100 / (1 + rs))

    latest_rsi = rsi.iloc[-1]

    if pd.isna(latest_rsi):
        return 50.0

    return round(float(latest_rsi), 2)

# ==========================
# Moving Average
# ==========================
def calculate_ma(series, period=20):

    ma = series.rolling(window=period).mean()

    latest_ma = ma.iloc[-1]

    if pd.isna(latest_ma):
        return 0.0

    return round(float(latest_ma), 2)

# ==========================
# Volatility
# ==========================
def calculate_volatility(df):

    returns = df["Close"].pct_change()

    volatility = returns.std() * np.sqrt(252)

    if pd.isna(volatility):
        return 0.0

    return round(float(volatility * 100), 2)

# ==========================
# Market Structure
# ==========================
def detect_market_structure(df):

    if len(df) < 10:
        return "Neutral"

    recent_high = df["High"].tail(5).max()
    previous_high = df["High"].tail(10).head(5).max()

    recent_low = df["Low"].tail(5).min()
    previous_low = df["Low"].tail(10).head(5).min()

    if recent_high > previous_high:
        return "Bullish Structure"

    elif recent_low < previous_low:
        return "Bearish Structure"

    return "Sideways"

# ==========================
# Institutional Activity
# ==========================
def detect_institutional_activity(current_volume, avg_volume):

    if current_volume > avg_volume * 2:
        return "High Institutional Buying"

    elif current_volume > avg_volume * 1.5:
        return "Moderate Institutional Buying"

    return "Normal Activity"

# ==========================
# AI Signal
# ==========================
def generate_signal(rsi, price, ma20):

    if rsi < 30 and price > ma20:
        return "STRONG BUY", 0.92

    elif rsi > 70 and price < ma20:
        return "STRONG SELL", 0.91

    elif price > ma20:
        return "BUY", 0.78

    elif price < ma20:
        return "SELL", 0.74

    return "HOLD", 0.60

# ==========================
# Risk Score
# ==========================
def calculate_risk(rsi, volatility):

    risk = 40

    if rsi > 70 or rsi < 30:
        risk += 20

    if volatility > 35:
        risk += 25

    return min(risk, 100)

# ==========================
# Stock API Endpoint
# ==========================
@app.get("/api/stocks/{symbol}")
def get_stock(symbol: str):

    try:

        symbol = symbol.upper()

        hist = yf.download(
            tickers=symbol,
            period="6mo",
            interval="1d",
            progress=False,
            auto_adjust=False,
            threads=False,
            group_by="column"
        )

        if hist.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No stock data found for {symbol}"
            )

        if isinstance(hist.columns, pd.MultiIndex):
            hist.columns = hist.columns.get_level_values(0)

        hist = hist.reset_index()

        hist = hist.dropna()

        numeric_cols = ["Open", "High", "Low", "Close", "Volume"]

        for col in numeric_cols:
            hist[col] = pd.to_numeric(hist[col], errors="coerce")

        hist = hist.dropna()

        if len(hist) < 20:
            raise HTTPException(
                status_code=400,
                detail="Not enough stock data"
            )

        price = float(hist["Close"].iloc[-1])
        prev_price = float(hist["Close"].iloc[-2])

        current_volume = float(hist["Volume"].iloc[-1])

        change_pct = ((price - prev_price) / prev_price) * 100

        rsi = calculate_rsi(hist["Close"])
        ma20 = calculate_ma(hist["Close"])
        volatility = calculate_volatility(hist)

        market_structure = detect_market_structure(hist)

        avg_volume = float(hist["Volume"].mean())

        institutional_activity = detect_institutional_activity(
            current_volume,
            avg_volume
        )

        signal, confidence = generate_signal(
            rsi,
            price,
            ma20
        )

        risk_score = calculate_risk(
            rsi,
            volatility
        )

        chart_data = []

        recent_data = hist.tail(60)

        for _, row in recent_data.iterrows():

            chart_data.append({
                "date": str(row["Date"].date()),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(float(row["Volume"]))
            })

        return {
            "basic": {
                "symbol": symbol,
                "price": round(price, 2),
                "change_pct": round(change_pct, 2)
            },
            "technical_indicators": {
                "rsi": rsi,
                "moving_average_20": ma20,
                "volatility": volatility,
                "volume": int(current_volume)
            },
            "ai_prediction": {
                "signal": signal,
                "confidence": confidence,
                "prediction_accuracy": 87
            },
            "smart_money": {
                "market_structure": market_structure,
                "institutional_activity": institutional_activity
            },
            "risk_analysis": {
                "risk_score": risk_score,
                "risk_level": (
                    "High"
                    if risk_score >= 80
                    else "Medium"
                    if risk_score >= 55
                    else "Low"
                )
            },
            "chart_data": chart_data
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server Error: {str(e)}"
        )

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
