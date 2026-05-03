def generate_signal(df):
    latest = df.iloc[-1]

    rsi = latest['RSI']
    macd = latest['MACD']
    signal = latest['MACD_SIGNAL']

    if rsi < 30 and macd > signal:
        return "STRONG BUY", 92

    elif rsi > 70 and macd < signal:
        return "STRONG SELL", 91

    elif macd > signal:
        return "BUY", 75

    elif macd < signal:
        return "SELL", 74

    return "HOLD", 65