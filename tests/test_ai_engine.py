import pytest

from ai_engine.speed_estimation.estimator import SpeedEstimator
from ai_engine.vibration_detection.classifier import VibrationClassifier
from ai_engine.bias_correction.bias_estimator import BiasEstimator
from ai_engine.evaluation.metrics import evaluate_model_performance

def test_speed_estimator():
    estimator = SpeedEstimator()
    res = estimator.predict_speed(accel_xyz=[1.2, 0.3, 9.8], gyro_xyz=[0.01, 0.0, 0.02])
    assert res["speed_m_s"] >= 0.0
    assert "inference_latency_ms" in res

def test_vibration_classifier():
    classifier = VibrationClassifier()
    # Smooth signal
    res = classifier.classify_window([9.81, 9.80, 9.82, 9.81, 9.79])
    assert res["condition"] in ["SMOOTH_ASPHALT", "MODERATE_VIBRATION"]

    # Pothole signal spike
    bump_res = classifier.classify_window([9.81, 28.5, 9.80])
    assert bump_res["pothole_detected"] is True

def test_bias_estimator():
    bias_est = BiasEstimator()
    # Stationary window (10 samples of constant gravity)
    accel_window = [[0.0, 0.0, 9.80665] for _ in range(15)]
    gyro_window = [[0.0, 0.0, 0.0] for _ in range(15)]

    res = bias_est.update_bias_if_stationary(accel_window, gyro_window)
    assert res["is_stationary"] is True
    assert res["bias_updated"] is True

def test_evaluation_metrics():
    y_true = [10.0, 12.0, 15.0, 14.0]
    y_pred = [10.2, 11.8, 14.9, 14.2]
    metrics = evaluate_model_performance(y_true, y_pred)
    assert metrics["mae"] < 0.3
    assert metrics["r2_score"] > 0.9
