from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, field_validator


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


SUPPORTED_OUTFIELD_POSITIONS = {
    "ST", "CF", "RW", "LW",
    "CAM", "CM", "CDM", "LM", "RM",
    "CB", "LB", "RB", "LWB", "RWB",
}


class PredictRequest(BaseModel):
    pace: int = Field(..., ge=1, le=99, description="Pace attribute (1-99)")
    shooting: int = Field(..., ge=1, le=99, description="Shooting attribute (1-99)")
    passing: int = Field(..., ge=1, le=99, description="Passing attribute (1-99)")
    dribbling: int = Field(..., ge=1, le=99, description="Dribbling attribute (1-99)")
    defending: int = Field(..., ge=1, le=99, description="Defending attribute (1-99)")
    physical: int = Field(..., ge=1, le=99, description="Physical attribute (1-99)")
    position: str = Field(..., description="Player outfield position")

    @field_validator("position")
    @classmethod
    def validate_position(cls, v: str) -> str:
        clean_pos = v.strip().upper()
        if clean_pos == "GK":
            # Per Milestone 3 spec: GK unsupported by this model; GK /predict returns HTTP 422
            raise ValueError("Goalkeepers are not supported by this model.")
        if clean_pos not in SUPPORTED_OUTFIELD_POSITIONS:
            raise ValueError(
                f"Invalid position '{v}'. Must be one of {sorted(SUPPORTED_OUTFIELD_POSITIONS)}."
            )
        return clean_pos


class PredictResponse(BaseModel):
    overall: int = Field(..., ge=1, le=99, description="Predicted overall rating (1-99)")
    feature_importance: Dict[str, float] = Field(
        ..., description="Feature importance scores for the prediction"
    )
    model: str = Field(..., description="Selected model architecture")


class TestMetrics(BaseModel):
    mae: float
    rmse: float
    r2: float


class ModelInfoResponse(BaseModel):
    model_name: str
    selected_model: str
    seed: int
    raw_rows: int
    cleaned_rows: int
    train_rows: int
    test_rows: int
    cv_mae: Dict[str, float]
    test_metrics: TestMetrics
    features: List[str]
    numeric_features: List[str]
    positions: List[str]
    model_file_size_bytes: int
    model_file_size_mb: float
    global_feature_importance: Dict[str, float]
    position_feature_importance: Dict[str, Dict[str, float]]
    training_timestamp: Optional[str] = None
