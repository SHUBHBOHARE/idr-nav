# Verification & Testing Strategy — IDR NAV (SIH Edition)

## 1. Automated Test Suite Overview
The project contains 21 unit and integration tests written in `pytest` for the backend, navigation engine, AI trainer, and IO-VNBD dataset loader.

### Test Breakdown (21 Tests — 100% Pass Rate):
1. `tests/test_navigation_engine.py` (7 tests):
   - `test_imu_filter()`: Verifies 2nd order low-pass Butterworth filtering.
   - `test_gnss_outage_detector()`: Tests HDOP thresholding (>3.5) and outage state evaluation.
   - `test_strapdown_ins()`: Verifies velocity and position integration.
   - `test_dead_reckoning_engine()`: Tests cumulative distance and drift calculation.
   - `test_non_holonomic_constraints()`: Verifies zero lateral velocity constraint ($v_y \approx 0$).
   - `test_extended_kalman_filter()`: Tests EKF prediction step and GNSS update step.
   - `test_map_matcher()`: Tests HMM candidate road snapping.

2. `tests/test_ai_engine.py` (4 tests):
   - `test_speed_estimator()`: Verifies speed prediction from IMU signals.
   - `test_vibration_classifier()`: Tests pothole spike detection ($> 1.8g$).
   - `test_bias_estimator()`: Tests ZUPT zero-velocity update.
   - `test_evaluation_metrics()`: Verifies MAE, RMSE, and R² score calculation.

3. `tests/test_io_vnbd_loader.py` (4 tests):
   - `test_io_vnbd_loader()`: Tests dataset loader, timestamp alignment, and splits.
   - `test_feature_extractor()`: Tests 6-element feature vector extraction.
   - `test_model_trainer()`: Verifies baseline Random Forest speed model training (`models/baseline_speed_rf.joblib`).
   - `test_benchmark_evaluator_and_plots()`: Tests 5-method evaluator and matplotlib publication plot generation.

4. `tests/test_api.py` (6 tests):
   - Tests FastAPI `/api/health`, `/api/status`, `/api/navigation/state`, `/api/gnss/simulate-outage`, `/api/sih/run-demo`, `/api/models`, `/api/datasets`, `/api/logs`.

---

## 2. Command Execution
To run full test suite:
```bash
python -m pytest tests/
```
To run frontend production build verification:
```bash
cd frontend && npm run build
```
