# Detailed Page Specifications — IDR NAV (SIH Edition)

Documentation for all 13 navigation sections in the IDR NAV sidebar.

---

### 1. Dashboard ("Navigation Command Center")
- **Purpose**: Operational overview of vehicle navigation state, sensor health, live map, and telemetry graphs.

### 2. SIH Evaluation (Featured SIH View)
- **Purpose**: Official SIH Hackathon benchmark & demonstration page.
- **Components**: One-Click **"RUN SIH DEMO"** button, Dataset status badge (`"Waiting for IO-VNBD dataset"` or `IO-VNBD Dataset Loaded` with `[DEMO / SYNTHETIC]` tag), 6 metric cards, 5-Method Performance Comparison Bar Chart, 5-Method Evaluation Matrix, Publication Plot Gallery.
- **API Calls**: `POST /api/sih/run-demo`, `GET /api/sih/results`, `GET /api/sih/plots/{plot_name}`.
- **User Actions**: Click "RUN SIH DEMO" to execute full 180s sequence, inspect 5-method trajectory plots, and review final `"GNSS outage successfully handled"` banner.

### 3. Live Navigation
- **Purpose**: Dedicated real-time vehicle navigation tracking and GNSS outage experiment console.

### 4. GNSS Monitor
- **Purpose**: Satellite constellation monitoring and signal quality diagnostics.

### 5. IMU Sensors
- **Purpose**: High-frequency 50Hz smartphone IMU stream visualizer.

### 6. Dead Reckoning
- **Purpose**: Kinematic integration math explanation and cumulative drift analysis.

### 7. Sensor Fusion
- **Purpose**: 8-State Extended Kalman Filter (EKF) state diagram and covariance matrix breakdown.

### 8. Map Matching
- **Purpose**: Hidden Markov Model road candidate snapping and Non-Holonomic Constraints (NHC) math.

### 9. AI Models
- **Purpose**: Management dashboard for PyTorch & ONNX speed estimation & vibration classifier models.

### 10. Dataset & Simulation
- **Purpose**: Ingest IO-VNBD datasets and configure synthetic outage intervals.

### 11. Performance
- **Purpose**: Quantitative RMSE benchmark analytics and method comparative table.

### 12. System Logs
- **Purpose**: Real-time filterable system audit event stream.

### 13. Settings
- **Purpose**: System preference configuration.
