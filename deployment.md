# Deployment Guide — Local, Docker & Edge/Android — IDR NAV (SIH Edition)

## 1. Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### Backend & AI Pipeline Setup
```bash
# Navigate to project root
cd idr-nav

# Activate virtual environment
.\venv\Scripts\activate  # On Linux/macOS: source venv/bin/activate

# Train baseline ML speed estimation model
python -m ai_engine.speed_estimation.trainer

# Run FastAPI Backend
python -m uvicorn backend.app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open browser at `http://localhost:3000`.

---

## 2. Docker & Docker Compose Deployment
```bash
docker-compose up --build -d
```
Access points:
- React Dark Theme Dashboard & SIH Suite: `http://localhost:3000`
- FastAPI REST Backend & OpenAPI Docs: `http://localhost:8000/docs`

---

## 3. SIH Evaluation Outputs & Publication Artifacts
When executing the SIH Evaluation demo sequence, publication artifacts are generated in:
- `results/trajectory/`: Trajectory overlay PNG plots for all 5 methods.
- `results/error/`: Positional error over time PNG plots.
- `results/performance/`: 5-method Position RMSE bar chart PNG.
- `results/reports/`: `sih_evaluation_summary.json` & `sih_evaluation_summary.csv`.
