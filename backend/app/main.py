from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    HealthResponse,
    PredictRequest,
    PredictResponse,
    ModelInfoResponse,
)
from app.predictor import predictor


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Attempt to load model on startup if present
    try:
        predictor.load()
        print(f"Loaded ML model: {predictor.metadata.get('model_name')}")
    except Exception as e:
        print(f"Model not loaded at startup (run train.py first if uninitialized): {e}")
    yield


app = FastAPI(
    title="FIFA Card Generator API",
    description="Backend service for FIFA Card Generator and Rating Predictor",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def get_health():
    """
    Health check endpoint returning service operational status.
    """
    return HealthResponse(
        status="ok",
        service="fifa-card-generator-api",
        version="1.0.0",
    )


@app.get("/model-info", response_model=ModelInfoResponse, tags=["Machine Learning"])
def get_model_info():
    """
    Returns metadata, training statistics, cross-validation metrics, and feature importance.
    """
    try:
        return predictor.get_model_info()
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )


@app.post("/predict", response_model=PredictResponse, tags=["Machine Learning"])
def predict_rating(request: PredictRequest):
    """
    Predicts FIFA player overall rating (clamped 1-99) and returns feature importance.
    """
    pos = request.position.strip().upper()
    if pos == "GK":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Goalkeepers are not supported by this model.",
        )

    try:
        result = predictor.predict(request.model_dump())
        return PredictResponse(**result)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction model is not initialized. Run train.py first.",
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to FIFA Card Generator API",
        "docs": "/docs",
        "health": "/health",
        "model_info": "/model-info",
        "predict": "/predict",
    }
