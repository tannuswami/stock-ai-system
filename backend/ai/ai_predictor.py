import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.ensemble import RandomForestClassifier
import joblib
import warnings
warnings.filterwarnings('ignore')

class AIPredictor:
    def __init__(self):
        self.scaler = MinMaxScaler()
        self.lstm_model = None
        self.rf_model = None
        
    def prepare_features(self, df: pd.DataFrame) -> np.ndarray:
        """Prepare features for ML model"""
        df = df.copy()
        
        # Technical indicators
        df['returns'] = df['Close'].pct_change()
        df['sma_20'] = df['Close'].rolling(20).mean()
        df['rsi'] = self.calculate_rsi(df['Close'])
        df['volume_sma'] = df['Volume'].rolling(20).mean()
        
        # Target: 1 if next day up, 0 if down
        df['target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
        
        features = ['returns', 'sma_20', 'rsi', 'volume_sma']
        return df[features].dropna()
    
    def calculate_rsi(self, prices, window=14):
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))
    
    def predict_signal(self, symbol: str, df: pd.DataFrame) -> dict:
        """Generate AI trading signal"""
        features = self.prepare_features(df)
        
        if len(features) < 30:
            return {"prediction": "HOLD", "confidence": 0.5}
        
        # Scale features
        scaled_features = self.scaler.fit_transform(features)
        
        # Simple ML prediction (production would use trained model)
        latest_features = scaled_features[-1].reshape(1, -1)
        
        # RSI-based signal
        rsi = features['rsi'].iloc[-1]
        price_trend = df['Close'].iloc[-1] > df['sma_20'].iloc[-1]
        
        if rsi < 30 and price_trend:
            signal = "BUY"
            confidence = min(0.95, (30 - rsi) / 30)
        elif rsi > 70 and not price_trend:
            signal = "SELL"
            confidence = min(0.95, (rsi - 70) / 30)
        else:
            signal = "HOLD"
            confidence = 0.6
        
        return {
            "prediction": signal,
            "confidence": float(confidence),
            "price_target": float(df['Close'].iloc[-1] * (1.02 if signal == "BUY" else 0.98)),
            "rsi": float(rsi),
            "trend": "BULLISH" if price_trend else "BEARISH"
        }

# Global predictor instance
predictor = AIPredictor()