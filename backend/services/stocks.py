import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import talib

class StockService:
    @staticmethod
    def get_stock_data(symbol: str, period: str = "1mo", interval: str = "1d") -> Dict:
        """Fetch comprehensive stock data"""
        ticker = yf.Ticker(symbol)
        
        # Basic info
        info = ticker.info
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            raise ValueError(f"No data found for {symbol}")
        
        current = hist.iloc[-1]
        prev = hist.iloc[-2] if len(hist) > 1 else current
        
        stock_data = {
            "symbol": symbol,
            "price": float(current['Close']),
            "open": float(current['Open']),
            "high": float(current['High']),
            "low": float(current['Low']),
            "volume": int(current['Volume']),
            "change": float(current['Close'] - prev['Close']),
            "change_percent": float((current['Close'] - prev['Close']) / prev['Close'] * 100),
            "market_cap": info.get('marketCap', 0),
            "pe_ratio": info.get('trailingPE', 0),
            "dividend_yield": info.get('dividendYield', 0) * 100,
            "chart_data": hist.reset_index().to_dict('records')
        }
        return stock_data
    
    @staticmethod
    def calculate_indicators(df: pd.DataFrame) -> Dict:
        """Calculate all technical indicators"""
        close = df['Close'].values
        high = df['High'].values
        low = df['Low'].values
        volume = df['Volume'].values
        
        indicators = {}
        
        # Moving Averages
        indicators['sma_20'] = talib.SMA(close, timeperiod=20)[-1]
        indicators['ema_12'] = talib.EMA(close, timeperiod=12)[-1]
        indicators['ema_26'] = talib.EMA(close, timeperiod=26)[-1]
        
        # MACD
        macd, macdsignal, macdhist = talib.MACD(close)
        indicators['macd'] = macd[-1]
        indicators['macd_signal'] = macdsignal[-1]
        
        # RSI
        indicators['rsi'] = talib.RSI(close, timeperiod=14)[-1]
        
        # Bollinger Bands
        upper, middle, lower = talib.BBANDS(close, timeperiod=20)
        indicators['bb_upper'] = upper[-1]
        indicators['bb_middle'] = middle[-1]
        indicators['bb_lower'] = lower[-1]
        
        # Stochastic
        slowk, slowd = talib.STOCH(high, low, close)
        indicators['stoch_k'] = slowk[-1]
        indicators['stoch_d'] = slowd[-1]
        
        return indicators