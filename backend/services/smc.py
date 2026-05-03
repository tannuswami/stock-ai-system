
def detect_break_of_structure(df):

    if len(df) < 10:
        return "Neutral"

    recent_high = df['High'].tail(5).max()
    previous_high = df['High'].tail(10).head(5).max()

    recent_low = df['Low'].tail(5).min()
    previous_low = df['Low'].tail(10).head(5).min()

    if recent_high > previous_high:
        return "Bullish Structure"

    elif recent_low < previous_low:
        return "Bearish Structure"

    return "Sideways"