import pandas as pd


def detect_break_of_structure(df):
    highs = df['High']
    lows = df['Low']

    if highs.iloc[-1] > highs.iloc[-2]:
        return "Bullish BOS"

    elif lows.iloc[-1] < lows.iloc[-2]:
        return "Bearish BOS"

    return "Neutral"
