def decision_for_score(score: int):
    if score >= 45:
        return True, "HIGH"
    if 25 <= score <= 44:
        return False, "MEDIUM"
    return False, "LOW"
