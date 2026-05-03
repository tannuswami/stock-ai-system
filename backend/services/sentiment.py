from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()


def analyze_news(text):
    score = analyzer.polarity_scores(text)

    if score['compound'] > 0:
        return "Positive"

    elif score['compound'] < 0:
        return "Negative"

    return "Neutral"