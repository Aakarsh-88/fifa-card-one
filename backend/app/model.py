"""
Model abstraction for FIFA Card Rating Predictor.
Integrates with RatingPredictor for model management.
"""

from typing import Dict, Any, Optional
from app.predictor import predictor, RatingPredictor


class PlayerRatingModel:
    def __init__(self):
        self._predictor = predictor

    @property
    def is_loaded(self) -> bool:
        return self._predictor.is_loaded

    def load(self):
        """Loads trained scikit-learn model pipeline."""
        self._predictor.load()

    def predict(self, player_stats: Dict[str, Any]) -> Dict[str, Any]:
        """Predicts player rating using underlying predictor."""
        return self._predictor.predict(player_stats)

    def get_info(self) -> Dict[str, Any]:
        """Returns model metadata."""
        return self._predictor.get_model_info()
