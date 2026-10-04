"""
Predictor service for FIFA Player Rating (OVR) estimation.
Handles model loading, inference, position mapping, clamping, and feature importance resolution.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional
import pandas as pd
import joblib


POSITION_MAPPING = {
    "LWB": "LB",
    "RWB": "RB",
}


class RatingPredictor:
    def __init__(self, model_path: Optional[Path] = None, meta_path: Optional[Path] = None):
        base_dir = Path(__file__).resolve().parent.parent
        self.model_path = model_path or (base_dir / "models" / "ovr_model.joblib")
        self.meta_path = meta_path or (base_dir / "models" / "model_meta.json")
        self.pipeline = None
        self.metadata: Dict[str, Any] = {}
        self.is_loaded = False

    def load(self):
        """Loads trained scikit-learn pipeline and metadata JSON."""
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Trained model not found at {self.model_path}. Please run train.py first."
            )
        if not self.meta_path.exists():
            raise FileNotFoundError(
                f"Model metadata not found at {self.meta_path}. Please run train.py first."
            )

        self.pipeline = joblib.load(self.model_path)
        with open(self.meta_path, "r") as f:
            self.metadata = json.load(f)

        self.is_loaded = True

    def ensure_loaded(self):
        """Ensures model and metadata are loaded into memory."""
        if not self.is_loaded:
            self.load()

    def get_feature_importance_for_position(self, position: str) -> Dict[str, float]:
        """
        Returns position-specific permutation importance if available and sufficiently sampled;
        otherwise falls back to global feature importance.
        """
        self.ensure_loaded()
        mapped_pos = POSITION_MAPPING.get(position.upper(), position.upper())
        pos_importance_map = self.metadata.get("position_feature_importance", {})

        if mapped_pos in pos_importance_map and pos_importance_map[mapped_pos]:
            return pos_importance_map[mapped_pos]

        return self.metadata.get("global_feature_importance", {})

    def predict(self, player_stats: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates overall player rating prediction.
        
        Args:
            player_stats: Dict containing pace, shooting, passing, dribbling, defending,
                          physical (1-99) and position string.

        Returns:
            Dict containing overall (int clamped to 1-99), feature_importance, and model name.
        """
        self.ensure_loaded()

        raw_pos = str(player_stats["position"]).strip().upper()
        if raw_pos == "GK":
            raise ValueError("Goalkeepers are not supported by this model.")

        mapped_pos = POSITION_MAPPING.get(raw_pos, raw_pos)

        # Prepare DataFrame input for scikit-learn pipeline
        input_data = pd.DataFrame(
            [
                {
                    "pace": float(player_stats["pace"]),
                    "shooting": float(player_stats["shooting"]),
                    "passing": float(player_stats["passing"]),
                    "dribbling": float(player_stats["dribbling"]),
                    "defending": float(player_stats["defending"]),
                    "physical": float(player_stats["physical"]),
                    "position": mapped_pos,
                }
            ]
        )

        # Execute pipeline prediction
        raw_pred = self.pipeline.predict(input_data)[0]

        # Clamp predicted OVR to 1-99 and return as integer
        clamped_ovr = int(max(1, min(99, round(raw_pred))))

        # Retrieve feature importance
        feature_importance = self.get_feature_importance_for_position(raw_pos)

        model_name = self.metadata.get("model_name", "Random Forest Regressor")

        return {
            "overall": clamped_ovr,
            "feature_importance": feature_importance,
            "model": model_name,
        }

    def get_model_info(self) -> Dict[str, Any]:
        """Returns loaded model metadata."""
        self.ensure_loaded()
        return self.metadata


# Global singleton instance
predictor = RatingPredictor()


def predict_player_rating(player_data: Dict[str, Any]) -> Dict[str, Any]:
    """Helper function for rating prediction."""
    return predictor.predict(player_data)
