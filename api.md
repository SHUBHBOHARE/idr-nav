# REST API Specification — IDR NAV (SIH Edition)

## 1. SIH Evaluation & Benchmark Endpoints

### `POST /api/evaluation/run` (Primary) & `POST /api/sih/run-demo` (Alias)
Triggers the one-click automated SIH evaluation demo sequence across 180 seconds (1800 ticks). Executes the complete pipeline:
`GNSS Available → Vehicle Simulation → GNSS Degradation → GNSS Lost → GNSS Measurements Isolated → AI Speed Estimation → IMU Preprocessing → Bias Correction → Dead Reckoning → EKF → NHC → Map Matching → GNSS Recovery → GNSS + INS Fusion → Performance Evaluation → Final Result`

**Response (200 OK):**
```json
{
  "status": "completed",
  "message": "GNSS outage successfully handled",
  "status_banner": "GNSS outage successfully handled",
  "data_origin": "DEMO / SYNTHETIC",
  "dataset_status": "Waiting for IO-VNBD dataset (Using Synthetic Sample)",
  "data_tag": "[DEMO / SYNTHETIC]",
  "is_real_dataset": false,
  "total_imu_samples": 1800,
  "duration_s": 180.0,
  "outage_interval_s": "60s - 120s (60s Duration)",
  "scenario": {
    "outage_duration_sec": 60.0,
    "distance_m": 2160.0,
    "vehicle_speed_kmh": 43.2
  },
  "methods": {
    "raw_imu_dr": {
      "position_rmse_m": 34.2,
      "drift_percentage": 18.5
    },
    "ai_dr": {
      "position_rmse_m": 4.12,
      "drift_percentage": 1.25
    },
    "ai_ekf": {
      "position_rmse_m": 1.82,
      "drift_percentage": 0.65
    },
    "ai_ekf_map_matching": {
      "position_rmse_m": 0.85,
      "drift_percentage": 0.18
    }
  },
  "metrics": {
    "position_rmse_m": 0.85,
    "max_error_m": 1.4,
    "drift_percent": 0.18,
    "velocity_rmse": 0.12,
    "heading_error_deg": 0.3,
    "latency_ms": 2.8,
    "update_rate_hz": 10
  },
  "trajectory": {
    "ground_truth": [{"lat": 37.7749, "lon": -122.4194, "speed": 12.0}],
    "gnss": [{"lat": 37.7749, "lon": -122.4194, "speed": 12.0}],
    "raw_imu_dr": [{"lat": 37.7749, "lon": -122.4194, "speed": 12.0}],
    "ai_dr": [{"lat": 37.7749, "lon": -122.4194, "speed": 12.0}],
    "ai_ekf": [{"lat": 37.7749, "lon": -122.4194, "speed": 12.0}],
    "map_matched": [{"lat": 37.7749, "lon": -122.4194, "speed": 12.0}]
  },
  "navigation_update_hz": "10 Hz (ACTIVE)"
}
```

---

### `GET /api/sih/results`
Returns latest cached SIH benchmark evaluation results.

---

### `GET /api/sih/plots/{plot_name}`
Serves publication PNG plot images from `results/trajectory/`, `results/error/`, or `results/performance/`.

---

## 2. System Diagnostics & Health

### `GET /api/health`
Returns system status (`healthy`), version, and timestamp.

### `GET /api/status`
Returns live state of GNSS, IMU, AI engine, map matching, and fusion filter.

### `GET /api/datasets`
Returns metadata of available datasets in `data/io_vnbd/` or synthetic fallbacks.

---

## 3. Navigation & Sensor Controls

### `GET /api/navigation/state`
Returns latest navigation tick state and polyline trajectories.

### `POST /api/gnss/simulate-outage`
Triggers manual GNSS outage switch to `AI DEAD RECKONING`.

### `POST /api/gnss/restore`
Restores GNSS fix and applies EKF drift correction.
