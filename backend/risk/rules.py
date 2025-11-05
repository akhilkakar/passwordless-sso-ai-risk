SUSPICIOUS_IPS = {"203.0.113.10", "198.51.100.2"}

def score_event(event: dict) -> int:
    score = 0
    # New device
    if event.get("device_id") == "new":
        score += 30
    # Geo anomaly (simple demo: non-AU adds risk)
    geo = event.get("geo", {})
    if geo.get("country") and geo.get("country") != "AU":
        score += 25
    # Suspicious IP
    if event.get("ip") in SUSPICIOUS_IPS:
        score += 20
    # Odd hour (demo: hour outside 06:00-22:00)
    # We assume login_ts is epoch seconds; keep it simple (no tz)
    import datetime
    hour = datetime.datetime.utcfromtimestamp(event.get("login_ts", 0)).hour
    if hour < 6 or hour > 22:
        score += 10
    return score
