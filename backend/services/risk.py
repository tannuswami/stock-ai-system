
def calculate_risk(rsi, volatility):

    risk = 50

    if rsi > 70:
        risk += 20

    if volatility > 5:
        risk += 20

    return min(risk, 100)