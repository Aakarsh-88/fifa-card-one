# FIFA Card Generator & Rating Laboratory ⚡⚽

A full-stack, AI-powered FIFA Ultimate Team card generator and player rating estimation platform.

## Architecture Overview

```
Browser / Next.js Frontend
       ↓
FastAPI Backend (GET /health)
       ↓
Python / scikit-learn ML Model (Slated for Milestone 3)
```

## Project Structure

```
fifa-card-generator/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts & meta
│   │   ├── page.tsx           # Futuristic landing page & Builder
│   │   └── globals.css        # Futuristic theme & animations
│   ├── components/
│   │   ├── StatusPill.tsx     # Live API health monitor
│   │   ├── PlayerBuilder.tsx  # Interactive builder controls
│   │   ├── FifaCardPreview.tsx# Live rendering FUT card preview
│   │   ├── StatSlider.tsx     # Dual range/input stat slider
│   │   └── ArchetypeSelector.tsx # Presets & quick load
│   ├── lib/
│   │   └── api.ts             # Backend health & API client
│   ├── types/
│   │   └── player.ts          # Core positions & player models
│   └── .env.local             # NEXT_PUBLIC_API_URL config
│
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entrypoint (GET /health)
│   │   ├── model.py           # Model loader (Milestone 3+)
│   │   ├── schemas.py         # Request/response schemas
│   │   └── predictor.py       # Inference pipeline (Milestone 3+)
│   ├── models/                # Trained ML weights
│   ├── data/                  # Datasets
│   └── requirements.txt       # Backend dependencies
│
└── README.md
```

## Milestone Status

- [x] **Milestone 1**: Project Architecture & Landing Page Setup
  - Dark futuristic scouting theme with lime neon accents
  - "Player Rating Laboratory" headline
  - BUILD → ANALYSE → REVEAL workflow presentation
  - Live backend `StatusPill` component
  - FastAPI skeleton with `GET /health` and CORS
- [x] **Milestone 2**: Player Builder UI
  - Interactive profile form: Name, Nation, Club, Position, Age, Height, Weight, Weak Foot, Skill Moves, Work Rates
  - Dual slider + numeric input for all 6 FIFA core stats (1–99) with FIFA rating color thresholds
  - Dynamic Goalkeeper mode adaptation (DIV, HAN, KIC, REF, SPE, POS)
  - Real-time FUT card preview with instant visual feedback
  - Quick archetypes & randomizer for rapid testing
  - Full client-side validation
- [ ] **Milestone 3**: ML Model Training & Rating Prediction API (Upcoming)
- [ ] **Milestone 4**: Final Card Generation & High-Res Export (Upcoming)

## Getting Started

### 1. Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Health check will be live at `http://localhost:8000/health`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the application.
