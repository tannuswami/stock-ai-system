import numpy as np


def calculate_volatility(df):
    returns = df['Close'].pct_change()
    volatility = returns.std() * np.sqrt(252)

    return round(volatility * 100, 2)