# Product Requirements Document (PRD) — IDR NAV (SIH Edition)

## 1. Executive Overview & Problem Statement
Modern vehicular navigation relies heavily on Global Navigation Satellite Systems (GNSS/GPS). However, GNSS signals are vulnerable to outages, urban canyon multi-path reflections, underground parking loss, tunnel blockages, and RF spoofing/jamming.

**IDR NAV (Intelligent Dead Reckoning & GNSS Fusion)** solves this problem by using standard smartphone sensors (3-axis Accelerometer, Gyroscope, Magnetometer) combined with AI/ML vehicle speed estimation, Strapdown Inertial Navigation Systems (INS), Extended Kalman Filter (EKF) sensor fusion, Non-Holonomic Constraints (NHC), and Map Matching to provide continuous, uninterrupted vehicle navigation during total GNSS outages.

---

## 2. Target Users & Stakeholders
- **Smart India Hackathon (SIH) Evaluation Jury**: Benchmarking autonomous navigation fallback architectures.
- **Automotive OEM Engineers**: Designing fallback navigation algorithms for connected & autonomous vehicles.
- **Defence & Aerospace Developers**: GPS-denied navigation solutions.
- **Research & Academic Teams**: Benchmark platform for sensor fusion, EKF/UKF, and smartphone IMU dead reckoning research.

---

## 3. Core Functional Requirements (SIH Specifications)
1. **Real-Time Sensor Ingestion**: High-frequency IMU acquisition (50Hz - 100Hz) with zero-phase 2nd order Butterworth noise filtering.
2. **IO-VNBD Dataset Pipeline**: Real dataset loader accepting official IO-VNBD files placed in `data/io_vnbd/` with timestamp sync, IMU/GNSS filtering, ground truth extraction, and train/val/test splits. Displays `"Waiting for IO-VNBD dataset"` when real files are missing and tags synthetic data as `[DEMO / SYNTHETIC]`.
3. **AI Speed Estimator & Trainer**: Trained Scikit-Learn Random Forest Regressor (`models/baseline_speed_rf.joblib`) predicting forward speed from accelerometer variance, pitch/roll, and vibration signals.
4. **Strapdown INS & Dead Reckoning**: Kinematic integration of forward speed and yaw rate:
   $$x_{k+1} = x_k + v_{AI} \cos(\psi) \Delta t, \quad y_{k+1} = y_k + v_{AI} \sin(\psi) \Delta t$$
5. **Non-Holonomic Constraints (NHC)**: Enforces zero lateral ($v_y \approx 0$) and vertical ($v_z \approx 0$) velocity constraints for ground vehicles.
6. **EKF Sensor Fusion**: 8-State Extended Kalman Filter estimating position $[p_N, p_E]$, velocity $[v_N, v_E]$, heading $\psi$, and IMU zero-g biases $[b_{ax}, b_{ay}, b_{gz}]$.
7. **5-Method Benchmark Evaluation Pipeline**:
   1. GNSS
   2. Raw IMU Dead Reckoning
   3. AI Dead Reckoning
   4. AI + EKF
   5. AI + EKF + Map Matching
8. **One-Click "RUN SIH DEMO"**: One-click execution progressing from GNSS available $\rightarrow$ GNSS outage $\rightarrow$ automatic AI DR $\rightarrow$ EKF $\rightarrow$ NHC $\rightarrow$ Map matching $\rightarrow$ GNSS recovery $\rightarrow$ Fusion correction $\rightarrow$ Final performance report with status banner `"GNSS outage successfully handled"`.
9. **Publication Plot Generator**: Generates high-resolution publication PNG plots & JSON/CSV reports saved in `results/trajectory/`, `results/error/`, `results/performance/`, `results/reports/`.
10. **Interactive SIH Dashboard**: Dark theme dashboard featuring a dedicated **SIH Evaluation** page with 5-method comparison charts and plot gallery.

---

## 4. Technical Non-Functional Requirements
- **Latencies**: AI model inference latency $< 1.5$ ms; EKF update latency $< 2.1$ ms.
- **Accuracy**: Fused position RMSE $< 0.85$ meters; Drift percentage $< 0.18\%$ during 60s total outage.
- **Offline Capability**: 100% standalone execution without internet connectivity.
- **Portability**: Modular Python packages ready for ONNX export and Kotlin Android edge deployment.

---

## 5. Success Metrics
- **Positional RMSE**: $< 1.0$ meter fused accuracy with GNSS available; $< 4.5$ meters after 60s total outage.
- **Zero Crash Guarantee**: Graceful fallback when sensor signals are noisy or dropped.
- **100% Test Coverage**: Full 21-test Pytest suite pass rate.
