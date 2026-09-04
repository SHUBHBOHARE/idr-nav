import pytest
import numpy as np

from navigation_engine.imu.filter import IMUFilter
from navigation_engine.gnss.outage_detector import GNSSOutageDetector
from navigation_engine.ins.strapdown import StrapdownINS
from navigation_engine.dead_reckoning.dr_engine import DeadReckoningEngine
from navigation_engine.fusion.ekf import ExtendedKalmanFilter
from navigation_engine.constraints.nhc import NonHolonomicConstraints
from navigation_engine.map_matching.matcher import MapMatcher

def test_imu_filter():
    filt = IMUFilter(sample_rate_hz=50.0, cutoff_freq_hz=5.0)
    res = filt.process_frame(0.2, 0.1, 9.81, 0.01, -0.01, 0.02)
    assert "accel_filtered" in res
    assert "gyro_filtered" in res
    assert len(res["accel_filtered"]) == 3

def test_gnss_outage_detector():
    detector = GNSSOutageDetector(hdop_threshold=3.5, min_satellites=4)
    # Healthy signal
    healthy_res = detector.evaluate({"is_available": True, "satellites": 9, "hdop": 1.1, "accuracy": 2.0})
    assert healthy_res["status"] == "HEALTHY"

    # Outage signal
    outage_res = detector.evaluate({"is_available": False, "satellites": 0, "hdop": 9.9, "accuracy": 99.0})
    assert outage_res["status"] == "LOST"

def test_strapdown_ins():
    ins = StrapdownINS(init_lat=37.7749, init_lon=-122.4194)
    res = ins.update(ax=1.0, ay=0.0, gz=0.01, dt=0.1)
    assert res["speed_m_s"] > 0.0
    assert res["lat"] != 37.7749 or res["lon"] != -122.4194

def test_dead_reckoning_engine():
    dr = DeadReckoningEngine(start_lat=37.7749, start_lon=-122.4194)
    res = dr.step(ai_estimated_speed_m_s=10.0, gz_rad_s=0.0, dt=1.0)
    assert res["cumulative_distance_m"] == 10.0
    assert res["speed_m_s"] == 10.0

def test_non_holonomic_constraints():
    nhc = NonHolonomicConstraints()
    # Vehicle moving forward 10m/s with 2m/s lateral drift at heading 0 rad
    vN, vE, info = nhc.apply_nhc(v_north=10.0, v_east=2.0, heading_rad=0.0)
    assert info["nhc_active"] is True
    assert info["v_lateral_constrained"] < 0.1

def test_extended_kalman_filter():
    ekf = ExtendedKalmanFilter(init_lat=37.7749, init_lon=-122.4194)
    ekf.predict(ax_m_s2=0.5, ay_m_s2=0.0, gz_rad_s=0.01, ai_speed_m_s=12.0, dt=0.1)
    state = ekf.get_state()
    assert "lat" in state
    assert "speed_km_h" in state

def test_map_matcher():
    matcher = MapMatcher()
    res = matcher.match(37.7750, -122.4190, heading_deg=50.0)
    assert "matched_lat" in res
    assert "road_name" in res
    assert res["is_snapped"] is True
