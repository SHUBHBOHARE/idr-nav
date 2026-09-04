import pytest
import os
import numpy as np

from data.io_vnbd_loader import IOVNBDDatasetLoader
from ai_engine.features.feature_extractor import FeatureExtractor
from ai_engine.speed_estimation.trainer import train_baseline_speed_model
from ai_engine.evaluation.evaluator import BenchmarkEvaluator
from ai_engine.evaluation.plot_generator import SIHPlotGenerator

def test_io_vnbd_loader():
    loader = IOVNBDDatasetLoader()
    res = loader.load_dataset(outage_start_s=60.0, outage_duration_s=60.0)
    assert "status" in res
    assert "data_tag" in res
    assert res["total_records"] >= 100
    assert loader.processed_df is not None

def test_feature_extractor():
    extractor = FeatureExtractor()
    feats = extractor.extract_features_from_frame(0.2, 0.1, 9.81, 0.01, -0.01, 0.02)
    assert len(feats) == 6

def test_model_trainer():
    res = train_baseline_speed_model("models/test_speed_rf.joblib")
    assert os.path.exists("models/test_speed_rf.joblib")
    assert res["mae"] >= 0.0
    assert res["r2_score"] >= 0.0

def test_benchmark_evaluator_and_plots():
    evaluator = BenchmarkEvaluator()
    plot_gen = SIHPlotGenerator(output_dir="results")

    # Generate synthetic 10-point test trajectories
    gt = [{"lat": 37.7749 + i*0.0001, "lon": -122.4194 + i*0.0001, "speed": 12.0} for i in range(10)]
    methods = {
        "GNSS": [{"lat": 37.7749 + i*0.0001 + 0.00002, "lon": -122.4194 + i*0.0001, "speed": 12.0} for i in range(10)],
        "Raw IMU Dead Reckoning": [{"lat": 37.7749 + i*0.0001 + 0.0001, "lon": -122.4194 + i*0.0001, "speed": 14.0} for i in range(10)],
        "AI Dead Reckoning": [{"lat": 37.7749 + i*0.0001 + 0.00003, "lon": -122.4194 + i*0.0001, "speed": 12.1} for i in range(10)],
        "AI + EKF": [{"lat": 37.7749 + i*0.0001 + 0.00001, "lon": -122.4194 + i*0.0001, "speed": 12.0} for i in range(10)],
        "AI + EKF + Map Matching": [{"lat": 37.7749 + i*0.0001, "lon": -122.4194 + i*0.0001, "speed": 12.0} for i in range(10)]
    }

    metrics = evaluator.evaluate_trajectories(gt, methods)
    assert len(metrics) == 5
    assert "position_rmse_m" in metrics["AI + EKF + Map Matching"]

    plot_gen.generate_all_plots(gt, methods, metrics)
    assert os.path.exists("results/trajectory/combined_trajectories.png")
    assert os.path.exists("results/reports/sih_evaluation_summary.json")
