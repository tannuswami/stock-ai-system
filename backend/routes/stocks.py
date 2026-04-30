from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import yfinance as yf
from ..database import get_db
from ..services.stocks import StockService
from ..ai.ai_predictor import predictor
from ..models import StockData, ChartData, PredictionResponse

router = APIRouter()

@router.get("/search", response_model=List[StockData])
async def search_stocks(query: str, db: Session = Depends(get_db)):
    """Search stocks globally"""
    symbols = [query.upper()]  # In production, search against symbol database
    
    results = []
    for symbol in symbols[:10]:  # Limit results
        try:
            data = StockService.get_stock_data(symbol, period="5d")
            results.append(StockData(**data))
        except:
            continue
    
    return results

@router.get("/{symbol}", response_model=dict)
async def get_stock_detail(symbol: str, timeframe: str = "1mo", db: Session = Depends(get_db)):
    """Get complete stock analysis"""
    try:
        # Stock data
        stock_data = StockService.get_stock_data(symbol, period=timeframe)
        
        # Indicators
        df = yf.download(symbol, period=timeframe)
        indicators = StockService.calculate_indicators(df)
        
        # AI Prediction
        prediction = predictor.predict_signal(symbol, df)
        
        return {
            "basic": stock_data,
            "indicators": indicators,
            "prediction": prediction,
            "timestamp": pd.Timestamp.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")

@router.get("/{symbol}/chart")
async def get_chart_data(symbol: str, timeframe: str = "1mo", interval: str = "1d"):
    """Get chart data for plotting"""
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period=timeframe, interval=interval)
    
    chart_data = hist.reset_index()[['Datetime', 'Open', 'High', 'Low', 'Close', 'Volume']].to_dict('records')
    
    return {
        "symbol": symbol,
        "timeframe": timeframe,
        "data": chart_data
    }