from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Risk Engine")

class RiskInput(BaseModel):
    ip: str
    device_id: str
    user_agent: str
    geo: Dict[str, Any] = Field(default_factory=dict)
    login_ts: int

class RiskResult(BaseModel):
    score: int
    require_mfa: bool
    tier: str

from risk.rules import score_event
from policy import decision_for_score

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/risk/evaluate", response_model=RiskResult)
def evaluate(payload: RiskInput):
    score = score_event(payload.model_dump())
    require, tier = decision_for_score(score)
    return RiskResult(score=score, require_mfa=require, tier=tier)
