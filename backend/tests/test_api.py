"""
Integration tests for FIFA Card Generator API and ML rating predictor.
Tests endpoints: /health, /model-info, /predict, and validation rules.
"""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app
from app.predictor import predictor

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def ensure_model_loaded():
    """Ensure ML predictor has loaded trained pipeline before tests run."""
    predictor.ensure_loaded()


def test_health_endpoint():
    """Verify GET /health returns 200 OK and expected structure."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "fifa-card-generator-api"
    assert data["version"] == "1.0.0"


def test_model_info_endpoint():
    """Verify GET /model-info returns 200 OK and valid metadata."""
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()

    assert "model_name" in data
    assert "selected_model" in data
    assert data["raw_rows"] == 19239
    assert data["cleaned_rows"] == 17107
    assert data["train_rows"] == 13685
    assert data["test_rows"] == 3422

    # Check cross-validation metrics
    assert "Linear Regression" in data["cv_mae"]
    assert "Random Forest Regressor" in data["cv_mae"]
    assert "Gradient Boosting Regressor" in data["cv_mae"]

    # Check test split metrics
    assert "mae" in data["test_metrics"]
    assert "rmse" in data["test_metrics"]
    assert "r2" in data["test_metrics"]

    # Check feature importance
    assert "global_feature_importance" in data
    assert "position_feature_importance" in data
    assert "CAM" in data["position_feature_importance"]
    assert "CB" in data["position_feature_importance"]


def test_predict_cam_example():
    """Verify POST /predict with exact CAM test case from requirements."""
    cam_payload = {
        "pace": 90,
        "shooting": 85,
        "passing": 88,
        "dribbling": 91,
        "defending": 40,
        "physical": 75,
        "position": "CAM",
    }
    response = client.post("/predict", json=cam_payload)
    assert response.status_code == 200
    data = response.json()

    assert "overall" in data
    assert isinstance(data["overall"], int)
    assert 1 <= data["overall"] <= 99
    assert data["overall"] == 87  # Expected rounded prediction for this specimen

    assert "feature_importance" in data
    assert isinstance(data["feature_importance"], dict)
    for stat in ["pace", "shooting", "passing", "dribbling", "defending", "physical"]:
        assert stat in data["feature_importance"]

    # CAM importance should reflect playmaking / attacking profile
    assert data["feature_importance"]["dribbling"] > data["feature_importance"]["defending"]
    assert "model" in data


def test_position_influence_and_importance():
    """
    Verify position affects prediction and feature importance
    when evaluated with identical stats across CB, CM, CAM, ST.
    """
    base_stats = {
        "pace": 80,
        "shooting": 75,
        "passing": 78,
        "dribbling": 80,
        "defending": 70,
        "physical": 75,
    }

    positions = ["CB", "CM", "CAM", "ST"]
    predictions = {}
    importances = {}

    for pos in positions:
        payload = {**base_stats, "position": pos}
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        result = response.json()
        predictions[pos] = result["overall"]
        importances[pos] = result["feature_importance"]

    # Verify all predictions are valid integer ratings
    for pos, ovr in predictions.items():
        assert 1 <= ovr <= 99

    # CB importance should emphasize defending; CAM should emphasize dribbling/shooting/passing
    assert importances["CB"]["defending"] > importances["CAM"]["defending"]
    assert importances["CAM"]["dribbling"] > importances["CB"]["dribbling"]


def test_wingback_position_mapping():
    """Verify LWB maps to LB and RWB maps to RB successfully."""
    lwb_payload = {
        "pace": 85,
        "shooting": 65,
        "passing": 75,
        "dribbling": 80,
        "defending": 75,
        "physical": 74,
        "position": "LWB",
    }
    res_lwb = client.post("/predict", json=lwb_payload)
    assert res_lwb.status_code == 200
    assert 1 <= res_lwb.json()["overall"] <= 99

    rwb_payload = {**lwb_payload, "position": "RWB"}
    res_rwb = client.post("/predict", json=rwb_payload)
    assert res_rwb.status_code == 200
    assert 1 <= res_rwb.json()["overall"] <= 99


def test_goalkeeper_returns_422():
    """Verify GK position is rejected with HTTP 422 Unprocessable Entity."""
    gk_payload = {
        "pace": 50,
        "shooting": 30,
        "passing": 55,
        "dribbling": 45,
        "defending": 20,
        "physical": 70,
        "position": "GK",
    }
    response = client.post("/predict", json=gk_payload)
    assert response.status_code == 422


def test_invalid_stats_validation():
    """Verify stats outside 1-99 range return HTTP 422."""
    # Stat > 99
    res_high = client.post(
        "/predict",
        json={
            "pace": 105,
            "shooting": 80,
            "passing": 80,
            "dribbling": 80,
            "defending": 80,
            "physical": 80,
            "position": "ST",
        },
    )
    assert res_high.status_code == 422

    # Stat < 1
    res_low = client.post(
        "/predict",
        json={
            "pace": 0,
            "shooting": 80,
            "passing": 80,
            "dribbling": 80,
            "defending": 80,
            "physical": 80,
            "position": "ST",
        },
    )
    assert res_low.status_code == 422


def test_invalid_position_validation():
    """Verify unsupported position string returns HTTP 422."""
    res = client.post(
        "/predict",
        json={
            "pace": 80,
            "shooting": 80,
            "passing": 80,
            "dribbling": 80,
            "defending": 80,
            "physical": 80,
            "position": "QUARTERBACK",
        },
    )
    assert res.status_code == 422


def test_prediction_clamping():
    """Verify predictions are strictly clamped within 1 to 99."""
    # Maximum stats
    max_payload = {
        "pace": 99,
        "shooting": 99,
        "passing": 99,
        "dribbling": 99,
        "defending": 99,
        "physical": 99,
        "position": "ST",
    }
    res_max = client.post("/predict", json=max_payload)
    assert res_max.status_code == 200
    assert res_max.json()["overall"] <= 99

    # Minimum stats
    min_payload = {
        "pace": 1,
        "shooting": 1,
        "passing": 1,
        "dribbling": 1,
        "defending": 1,
        "physical": 1,
        "position": "CB",
    }
    res_min = client.post("/predict", json=min_payload)
    assert res_min.status_code == 200
    assert res_min.json()["overall"] >= 1
