
def detect_institutional_activity(volume, avg_volume):
    if volume > avg_volume * 2:
        return "Institutional Buying"

    return "Normal Activity"