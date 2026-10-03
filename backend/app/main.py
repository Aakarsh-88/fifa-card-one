from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import HealthResponse

app = FastAPI(
    title="FIFA Card Generator API",
    description="Backend service for FIFA Card Generator and Rating Predictor",
    version="1.0.0",
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
        version="1.0.0"
    )

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to FIFA Card Generator API",
        "docs": "/docs",
        "health": "/health"
    }
