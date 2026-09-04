"""
IDR NAV - Standalone Navigation Engine CLI Runner.
Executes core sensor ingestion, IMU filtering, EKF state prediction, NHC constraints,
and Map Matching directly in terminal without requiring FastAPI or React frontend.
"""

import time
import math
import numpy as np

from navigation_engine.sensors.provider import MockSensorProvider
from navigation_engine.imu.filter import IMUFilter
from navigation_engine.gnss.outage_detector import GNSSOutageDetector
from navigation_engine.ins.strapdown import StrapdownINS
from navigation_engine.dead_reckoning.dr_engine import DeadReckoningEngine
from navigation_engine.fusion.ekf import ExtendedKalmanFilter
from navigation_engine.constraints.nhc import NonHolonomicConstraints
from navigation_engine.map_matching.matcher import MapMatcher
from navigation_engine.calibration.alignment import AlignmentEngine
from ai_engine.speed_estimation.estimator import SpeedEstimator

def run_standalone_engine(num_steps: int = 50):
    print("=" * 70)
    print("IDR NAV — Standalone Core Navigation Engine CLI Runner")
    print("=" * 70)

    sensor_provider = MockSensorProvider()
    imu_filter = IMUFilter()
    outage_detector = GNSSOutageDetector()
    calibration = AlignmentEngine()
    calibration.start_calibration()
    
    ins = StrapdownINS()
    dr = DeadReckoningEngine()
    ekf = ExtendedKalmanFilter()
    nhc = NonHolonomicConstraints()
    map_matcher = MapMatcher()
    ai_speed = SpeedEstimator()

    outage_active = False

    for i in range(1, num_steps + 1):
        sample = sensor_provider.get_next_sample()
        ax, ay, az = sample["accel"]
        gx, gy, gz = sample["gyro"]

        # 1. Calibration Update
        if i <= 20:
            calibration.add_calibration_sample([ax, ay, az], [gx, gy, gz])

        # 2. Filter IMU
        filt = imu_filter.process_frame(ax, ay, az, gx, gy, gz)
        
        # 3. Outage Simulation at step 20-35
        outage_active = (20 <= i <= 35)
        gnss_eval = outage_detector.evaluate({"is_available": not outage_active})

        # 4. AI Speed & DR
        speed_res = ai_speed.predict_speed([ax, ay, az], [gx, gy, gz])
        est_speed = speed_res["speed_m_s"]
        dr_res = dr.step(est_speed, gz, 0.1)

        # 5. EKF & NHC
        ekf.predict(ax, ay, gz, est_speed, 0.1)
        if not outage_active:
            ekf.update_gnss(37.7749 + i*0.0001, -122.4194 + i*0.0001, est_speed, 0.8)

        state = ekf.get_state()
        map_res = map_matcher.match(state["lat"], state["lon"], state["heading_deg"])

        mode_str = "AI DEAD RECKONING" if outage_active else "GNSS + INS"
        print(f"Step {i:02d} | Mode: {mode_str:18s} | Speed: {state['speed_km_h']:5.1f} km/h | Drift: {dr_res['cumulative_drift_m']:5.2f}m | Road: {map_res['road_name']}")
        time.sleep(0.02)

    print("=" * 70)
    print("Standalone Engine Execution Completed Cleanly!")
    print("=" * 70)

if __name__ == "__main__":
    run_standalone_engine()
