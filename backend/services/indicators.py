"""
Technical Indicators Engine - Pure Python (No TA-Lib Required)
Used by StockService for RSI, MACD, Bollinger Bands, etc.
"""

import pandas as pd
import numpy as np
from typing import Dict, Tuple, Optional


class IndicatorService:
    """Professional Technical Indicators - Production Ready"""
    
    @staticmethod
    def rsi(prices: pd.Series, period: int = 14) -> float:
        """
        Relative Strength Index (RSI)
        Values: 0-100 (30=oversold, 70=overbought)
        """
        delta = prices.diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        
        avg_gain = gain.rolling(window=period, min_periods=1).mean()
        avg_loss = loss.rolling(window=period, min_periods=1).mean()
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi.iloc[-1] if len(rsi) > 0 else 50.0
    
    @staticmethod
    def sma(prices: pd.Series, period: int = 20) -> float:
        """Simple Moving Average"""
        return prices.rolling(window=period).mean().iloc[-1]
    
    @staticmethod
    def ema(prices: pd.Series, period: int = 12) -> float:
        """Exponential Moving Average"""
        return prices.ewm(span=period, adjust=False).mean().iloc[-1]
    
    @staticmethod
    def macd(prices: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> Tuple[float, float, float]:
        """
        MACD (Moving Average Convergence Divergence)
        Returns: (MACD line, Signal line, Histogram)
        """
        ema_fast = prices.ewm(span=fast, adjust=False).mean()
        ema_slow = prices.ewm(span=slow, adjust=False).mean()
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        histogram = macd_line - signal_line
        
        return macd_line.iloc[-1], signal_line.iloc[-1], histogram.iloc[-1]
    
    @staticmethod
    def bollinger_bands(prices: pd.Series, period: int = 20, std_dev: int = 2) -> Tuple[float, float, float]:
        """
        Bollinger Bands
        Returns: (Upper Band, Middle Band, Lower Band)
        """
        sma = prices.rolling(window=period).mean()
        std = prices.rolling(window=period).std()
        upper = sma + (std * std_dev)
        lower = sma - (std * std_dev)
        
        return upper.iloc[-1], sma.iloc[-1], lower.iloc[-1]
    
    @staticmethod
    def stochastic(high: pd.Series, low: pd.Series, close: pd.Series, k_period: int = 14, d_period: int = 3) -> Tuple[float, float]:
        """
        Stochastic Oscillator
        Returns: (%K, %D)
        """
        lowest_low = low.rolling(window=k_period).min()
        highest_high = high.rolling(window=k_period).max()
        
        k_percent = 100 * ((close - lowest_low) / (highest_high - lowest_low))
        d_percent = k_percent.rolling(window=d_period).mean()
        
        return k_percent.iloc[-1], d_percent.iloc[-1]
    
    @staticmethod
    def atr(high: pd.Series, low: pd.Series, close: pd.Series, period: int = 14) -> float:
        """
        Average True Range (Volatility)
        """
        high_low = high - low
        high_close = np.abs(high - close.shift())
        low_close = np.abs(low - close.shift())
        
        tr = np.maximum(high_low, np.maximum(high_close, low_close))
        atr = tr.rolling(window=period).mean()
        
        return atr.iloc[-1]
    
    @staticmethod
    def calculate_all(df: pd.DataFrame) -> Dict[str, float]:
        """
        Calculate ALL indicators for stock analysis
        Input: OHLCV DataFrame
        Output: Complete indicator dictionary
        """
        if df.empty or len(df) < 30:
            return {
                'rsi': 50.0,
                'sma_20': 0.0,
                'ema_12': 0.0,
                'macd': 0.0,
                'macd_signal': 0.0,
                'bb_upper': 0.0,
                'bb_middle': 0.0,
                'bb_lower': 0.0,
                'stoch_k': 50.0,
                'stoch_d': 50.0,
                'atr': 0.0,
                'volume_sma': 0.0
            }
        
        close = df['Close']
        high = df['High']
        low = df['Low']
        volume = df['Volume']
        
        indicators = {}
        
        # Trend Indicators
        indicators['sma_20'] = IndicatorService.sma(close, 20)
        indicators['ema_12'] = IndicatorService.ema(close, 12)
        indicators['ema_26'] = IndicatorService.ema(close, 26)
        
        # MACD
        macd, macd_signal, macd_hist = IndicatorService.macd(close)
        indicators['macd'] = macd
        indicators['macd_signal'] = macd_signal
        indicators['macd_histogram'] = macd_hist
        
        # Momentum
        indicators['rsi'] = IndicatorService.rsi(close)
        indicators['stoch_k'], indicators['stoch_d'] = IndicatorService.stochastic(high, low, close)
        
        # Volatility
        indicators['atr'] = IndicatorService.atr(high, low, close)
        bb_upper, bb_middle, bb_lower = IndicatorService.bollinger_bands(close)
        indicators['bb_upper'] = bb_upper
        indicators['bb_middle'] = bb_middle
        indicators['bb_lower'] = bb_lower
        
        # Volume
        indicators['volume_sma'] = volume.rolling(20).mean().iloc[-1]
        
        return indicators
    
    @staticmethod
    def generate_signals(indicators: Dict[str, float], price: float) -> Dict[str, Any]:
        """
        Generate trading signals from indicators
        Returns buy/sell strength + confidence
        """
        signals = {
            'rsi_signal': 'NEUTRAL',
            'macd_signal': 'NEUTRAL',
            'bb_signal': 'NEUTRAL',
            'overall_signal': 'HOLD',
            'confidence': 0.5
        }
        
        rsi = indicators.get('rsi', 50)
        macd = indicators.get('macd', 0)
        macd_signal = indicators.get('macd_signal', 0)
        bb_position = (price - indicators.get('bb_lower', price)) / (indicators.get('bb_upper', price) - indicators.get('bb_lower', price))
        
        # RSI Signal
        if rsi < 30:
            signals['rsi_signal'] = 'BUY'
        elif rsi > 70:
            signals['rsi_signal'] = 'SELL'
        
        # MACD Signal
        if macd > macd_signal:
            signals['macd_signal'] = 'BUY'
        else:
            signals['macd_signal'] = 'SELL'
        
        # Bollinger Bands
        if bb_position < 0.2:
            signals['bb_signal'] = 'BUY'
        elif bb_position > 0.8:
            signals['bb_signal'] = 'SELL'
        
        # Overall Signal Logic
        buy_signals = sum(1 for s in [signals['rsi_signal'], signals['macd_signal'], signals['bb_signal']] if s == 'BUY')
        sell_signals = sum(1 for s in [signals['rsi_signal'], signals['macd_signal'], signals['bb_signal']] if s == 'SELL')
        
        if buy_signals >= 2:
            signals['overall_signal'] = 'STRONG BUY'
            signals['confidence'] = min(0.95, buy_signals * 0.4)
        elif sell_signals >= 2:
            signals['overall_signal'] = 'STRONG SELL'
            signals['confidence'] = min(0.95, sell_signals * 0.4)
        elif buy_signals > sell_signals:
            signals['overall_signal'] = 'BUY'
            signals['confidence'] = 0.65
        elif sell_signals > buy_signals:
            signals['overall_signal'] = 'SELL'
            signals['confidence'] = 0.65
        else:
            signals['overall_signal'] = 'HOLD'
            signals['confidence'] = 0.5
        
        return signals


# Usage Example (for testing)
if __name__ == "__main__":
    # Test data
    dates = pd.date_range('2024-01-01', periods=100)
    prices = 100 + np.cumsum(np.random.randn(100) * 0.5)
    df_test = pd.DataFrame({
        'Close': prices,
        'High': prices + np.random.rand(100),
        'Low': prices - np.random.rand(100),
        'Volume': np.random.randint(1000000, 10000000, 100)
    }, index=dates)
    
    indicators = IndicatorService.calculate_all(df_test)
    signals = IndicatorService.generate_signals(indicators, prices[-1])
    
    print("=== TECHNICAL INDICATORS ===")
    for key, value in indicators.items():
        print(f"{key.upper()}: {value:.4f}")
    
    print("\n=== TRADING SIGNALS ===")
    print(f"OVERALL: {signals['overall_signal']} ({signals['confidence']*100:.1f}% confidence)")
    print(f"RSI: {signals['rsi_signal']}, MACD: {signals['macd_signal']}, BB: {signals['bb_signal']}")