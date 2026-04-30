from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class StockData(BaseModel):
    symbol: str
    price: float
    change: float
    change_percent: float
    volume: int
    market_cap: float

class ChartData(BaseModel):
    symbol: str
    timeframe: str
    data: List[dict]

class PredictionResponse(BaseModel):
    symbol: str
    prediction: str
    confidence: float
    price_target: float
    signals: dict