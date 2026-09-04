# IDR NAV — Intelligent Dead Reckoning & GNSS Fusion (SIH Edition)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![Python](https://img.shields.io/badge/python-3.10%2B-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/frontend-React%2018-61DAFB)](https://react.dev)
[![SIH Suite](https://img.shields.io/badge/SIH-Evaluation%20Suite-purple)](results/reports)

A complete, production-grade software prototype and benchmark suite designed for the **Smart India Hackathon (SIH)**. Demonstrates how a smartphone can maintain continuous vehicular navigation when GNSS/GPS becomes unavailable or degraded (e.g. in tunnels, urban canyons, or under RF jamming).

---

## 🌟 Key Features (SIH Enhancements)
- **One-Click "RUN SIH DEMO" (`POST /api/evaluation/run`)**: Automated execution sequence demonstrating GNSS available $\rightarrow$ GNSS outage $\rightarrow$ AI DR $\rightarrow$ EKF $\rightarrow$ NHC $\rightarrow$ Map matching $\rightarrow$ GNSS recovery $\rightarrow$ Fusion correction $\rightarrow$ Final performance report with status banner `"GNSS outage successfully handled"`. Includes a live 10-stage execution progress indicator.
- **OpenStreetMap MapProvider Abstraction**: OpenStreetMap-compatible tile layer (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) requiring zero external API keys (`MAPBOX_TOKEN`, `CARTO_API_KEY`, `GOOGLE_MAPS_API_KEY`). Displays vehicle position marker and 6 color-coded trajectory polylines with interactive legend.
- **Scientific Integrity & Mode Separation**:
  - **Mode A (`[DEMO / SYNTHETIC]`)**: When IO-VNBD dataset is missing from `data/io_vnbd/`, dataset status displays `"Waiting for IO-VNBD dataset"`, data origin tags `[DEMO / SYNTHETIC]`, and metrics are labeled as Demo/Synthetic Results.
  - **Mode B (`REAL IO-VNBD`)**: When real dataset files are placed in `data/io_vnbd/`, loads real hardware logs and labels metrics as `ACTUAL MEASURED RESULT`.
- **Dynamic Target Verification Matrix**: Automatically evaluates SIH benchmarks (< 10% drift, < 5.0m position RMSE, < 5.0ms AI latency, 10Hz update rate) with dynamic `PASSED`/`FAILED` status indicators.
- **Trained AI Speed Estimator**: Trained Scikit-Learn Random Forest Regressor (`models/baseline_speed_rf.joblib`) predicting forward speed from IMU feature vectors.
- **5-Method Benchmark Evaluator**: Evaluates Position RMSE, Mean error, Max error, Drift %, Velocity RMSE, Heading error, Outage duration, and Latency across 5 methods:
  1. GNSS Only
  2. Raw IMU Dead Reckoning
  3. AI Dead Reckoning
  4. AI + EKF Fusion
  5. AI + EKF + Map Matching
- **Publication Plot Generator**: Generates high-resolution publication PNG plots & JSON/CSV reports saved in `results/trajectory/`, `results/error/`, `results/performance/`, `results/reports/`.
- **15 Full-Featured Dashboard Views**: Includes a dedicated **SIH Evaluation** page with interactive 5-method comparative charts and plot gallery.
- **8-State Extended Kalman Filter (EKF)**: Fuses GNSS fixes with 50Hz IMU strapdown predictions and zero-g bias offsets.
- **Non-Holonomic Constraints (NHC)**: Enforces zero lateral ($v_y \approx 0$) and vertical ($v_z \approx 0$) velocity for ground vehicles.

---

## 🚀 Quick Start (Local PC)

### 1. Environment & Backend Setup
```bash
# Navigate to project directory
cd idr-nav

# Activate virtual environment
.\venv\Scripts\activate  # On Linux/macOS: source venv/bin/activate

# Train baseline ML speed estimation model
python -m ai_engine.speed_estimation.trainer

# Run FastAPI Backend
python -m uvicorn backend.app.main:app --reload --port 8000
```
Backend API interactive documentation available at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open browser at `http://localhost:3000`.

---

## 🧪 Running Automated Tests
```bash
# Run backend pytest suite (30 passed, 100% pass rate)
python -m pytest tests/

# Run frontend production build check (0 errors)
cd frontend && npm run build
```

---

## 📂 Project Structure
```
idr-nav/
├── frontend/             # React 18 + TypeScript + Tailwind CSS + Leaflet/Recharts + SIH Evaluation View
├── backend/              # FastAPI Python Backend REST Service & ORM Models
├── ai_engine/            # PyTorch & ONNX Speed Estimator, Feature Extractor, Trainer, SIH Evaluator & Plot Generator
├── navigation_engine/    # EKF/UKF Sensor Fusion, INS, Dead Reckoning, NHC, Map Matcher
├── data/                 # Raw, Processed, Sample, and IO-VNBD dataset loader
├── models/               # Saved ML model binaries (baseline_speed_rf.joblib)
├── results/              # Publication trajectory plots, error curves, bar charts & reports
├── tests/                # Automated pytest & API contract suite (30 tests passing)
├── Dockerfile            # Multi-stage container definition
├── docker-compose.yml    # Multi-container orchestration
├── PRD.md                # Product Requirements Document
├── architecture.md       # Architectural specification & sequence diagrams
├── database.md           # ER diagram & 15 table schemas
├── api.md                # REST API documentation
├── ui-design.md          # Dark Theme design system
├── pages.md              # Detailed page specifications
├── user-flows.md         # User & Navigation state flowcharts
├── roles-permission.md   # RBAC matrix
├── testing.md            # Verification & test strategy
└── deployment.md         # Local, Docker & Edge/Android deployment plan
```
