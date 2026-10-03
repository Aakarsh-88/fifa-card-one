from pydantic import BaseModel, Field
from typing import Optional, Literal

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "fifa-card-generator-api"
    version: str = "1.0.0"

class PlayerStatsSchema(BaseModel):
    pace: int = Field(..., ge=1, le=99)
    shooting: int = Field(..., ge=1, le=99)
    passing: int = Field(..., ge=1, le=99)
    dribbling: int = Field(..., ge=1, le=99)
    defending: int = Field(..., ge=1, le=99)
    physical: int = Field(..., ge=1, le=99)

class PlayerInputSchema(BaseModel):
    name: str
    position: str
    nation: Optional[str] = None
    club: Optional[str] = None
    stats: PlayerStatsSchema
