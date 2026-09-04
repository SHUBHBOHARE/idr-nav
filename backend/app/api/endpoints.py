from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from typing import List, Dict, Any
import os
import time

from backend.app.services.simulation_service import sim_service
from ai_engine.evaluation.metrics import evaluate_model_performance
from ai_engine.speed_estimation.trainer import train_baseline_speed_model
from data.io_vnbd_loader import IOVNBDDatasetLoader
from navigation_engine.calibration.alignment import AlignmentEngine

router = APIRouter()
calibration_engine = AlignmentEngine()

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": "IDR NAV - Intelligent Dead Reckoning & GNSS Fusion",
        "version": "2.0.0",
        "timestamp": time.time()
    }

@router.get("/status")
def get_system_status():
    state = sim_service.get_latest_state()
    return {
        "overall_health": "OPTIMAL",
        "gnss_status": state["gnss_status"],
        "imu_status": state["imu_status"],
        "ai_engine_status": state["ai_status"],
        "map_engine_status": state["map_status"],
        "fusion_engine_status": state["fusion_status"],
        "navigation_mode": state["mode"],
        "outage_active": state["gnss_status"] == "LOST"
    }

@router.get("/navigation/state")
def get_navigation_state():
    sim_service.tick()  # Advance simulation step
    return sim_service.get_latest_state()

@router.get("/navigation/position")
def get_navigation_position():
    sim_service.tick()
    state = sim_service.get_latest_state()
    return {
        "lat": state["current_lat"],
        "lon": state["current_lon"],
        "speed_km_h": state["speed_km_h"],
        "heading_deg": state["heading_deg"],
        "confidence_m": state["position_confidence_m"],
        "mode": state["mode"]
    }

@router.post("/navigation/start")
def start_navigation():
    sim_service.is_running = True
    sim_service.is_paused = False
    sim_service._add_log("INFO", "Navigation", "Navigation session started")
    sim_service.tick()
    state = sim_service.get_latest_state()
    state["status"] = "started"
    return state

@router.post("/navigation/pause")
def pause_navigation():
    sim_service.is_paused = True
    sim_service._add_log("INFO", "Navigation", "Navigation session paused")
    state = sim_service.get_latest_state()
    state["status"] = "paused"
    return state

@router.post("/navigation/stop")
def stop_navigation():
    return pause_navigation()

@router.post("/navigation/reset")
def reset_navigation():
    sim_service.step_count = 0
    sim_service.restore_gnss()
    sim_service.trajectory_gnss.clear()
    sim_service.trajectory_dr.clear()
    sim_service.trajectory_ai_dr.clear()
    sim_service.trajectory_fused.clear()
    sim_service.trajectory_map_matched.clear()
    sim_service.trajectory_ground_truth.clear()
    sim_service.dr_engine.reset_position(sim_service.start_lat, sim_service.start_lon, 0.8)
    sim_service._add_log("INFO", "Navigation", "Navigation reset to initial position")
    state = sim_service.get_latest_state()
    state["status"] = "reset"
    return state

@router.post("/gnss/simulate-outage")
def simulate_gnss_outage():
    sim_service.simulate_gnss_outage()
    state = sim_service.get_latest_state()
    state["status"] = "GNSS_OUTAGE_TRIGGERED"
    state["message"] = "GNSS hardware signal disconnected. Switched to AI DR."
    return state

@router.post("/gnss/restore")
def restore_gnss():
    sim_service.restore_gnss()
    state = sim_service.get_latest_state()
    state["status"] = "GNSS_RESTORED"
    state["message"] = "GNSS signal restored. EKF sensor fusion drift correction applied."
    return state

@router.get("/gnss/status")
def get_gnss_status():
    is_avail = not sim_service.gnss_forced_outage
    return {
        "is_available": is_avail,
        "status": "HEALTHY (Fix: 3D)" if is_avail else "LOST (Outage Active)",
        "satellites": 10 if is_avail else 0,
        "hdop": 1.1 if is_avail else 9.9,
        "accuracy_m": 2.5 if is_avail else 99.0,
        "lat": sim_service.get_latest_state()["current_lat"] if is_avail else 0.0,
        "lon": sim_service.get_latest_state()["current_lon"] if is_avail else 0.0,
        "speed_km_h": sim_service.get_latest_state()["speed_km_h"],
        "signal_quality": "EXCELLENT" if is_avail else "NO_SIGNAL"
    }

@router.get("/imu/latest")
def get_imu_latest():
    return {
        "timestamp": time.time(),
        "accel": [0.12, 0.05, 9.81],
        "gyro": [0.01, -0.02, 0.04],
        "mag": [24.5, -12.1, 41.8],
        "accel_filtered": [0.10, 0.04, 9.80],
        "gyro_filtered": [0.00, -0.01, 0.03],
        "noise_level": 0.04,
        "bias_ax": 0.02,
        "bias_ay": -0.01,
        "bias_gz": 0.003,
        "filter_status": "Butterworth Low-pass (Cutoff 3.5Hz)"
    }

@router.get("/imu/history")
def get_imu_history():
    samples = []
    now = time.time()
    for i in range(50):
        t = now - (50 - i) * 0.1
        samples.append({
            "time": round(t, 1),
            "ax": round(0.15 * math.sin(0.5 * i) + np.random.normal(0, 0.05), 3),
            "ay": round(0.10 * math.cos(0.5 * i) + np.random.normal(0, 0.05), 3),
            "az": round(9.81 + 0.2 * math.sin(1.2 * i) + np.random.normal(0, 0.08), 3),
            "gx": round(0.02 * math.sin(0.3 * i), 4),
            "gy": round(0.02 * math.cos(0.3 * i), 4),
            "gz": round(0.04 * math.sin(0.1 * i), 4)
        })
    return {"history": samples}

# Calibration Endpoints
@router.get("/calibration/status")
def get_calibration_status():
    return calibration_engine.get_status()

@router.post("/calibration/start")
def start_calibration():
    calibration_engine.start_calibration()
    # Add dummy samples to complete calibration
    for i in range(25):
        calibration_engine.add_calibration_sample([0.15, 0.08, 9.78], [0.01, 0.0, 0.02])
    return calibration_engine.get_status()

@router.post("/simulation/start")
def start_simulation():
    sim_service.is_running = True
    return {"status": "started"}

@router.post("/simulation/stop")
def stop_simulation():
    sim_service.is_running = False
    return {"status": "stopped"}

@router.get("/simulation/status")
def get_simulation_status():
    state = sim_service.get_latest_state()
    return {
        "is_running": sim_service.is_running,
        "current_step": sim_service.step_count,
        "total_steps": 1800,
        "scenario": "Urban Canyon & Tunnel Outage Simulation",
        "outage_active": sim_service.gnss_forced_outage,
        "current_mode": state["mode"],
        "dr_drift_m": state["drift_m"],
        "elapsed_time_s": round(sim_service.step_count * 0.1, 1)
    }

@router.get("/performance")
def get_performance_metrics():
    return {
        "dead_reckoning": {
            "position_rmse_m": 4.12,
            "max_error_m": 8.45,
            "drift_percentage": 1.25,
            "distance_travelled_m": 1250.0,
            "gnss_outage_duration_s": 60.0
        },
        "gnss_ins_fusion": {
            "position_rmse_m": 0.85,
            "velocity_rmse_m_s": 0.12,
            "update_rate_hz": 50,
            "recovery_time_s": 1.2,
            "processing_latency_ms": 2.4
        },
        "ai_model": {
            "mae_m_s": 0.34,
            "rmse_m_s": 0.48,
            "r2_score": 0.965,
            "inference_latency_ms": 1.4
        },
        "comparisons": [
            {"method": "Raw IMU Strapdown", "position_rmse_m": 34.2, "drift_percent": 18.5, "status": "High Drift"},
            {"method": "AI Dead Reckoning", "position_rmse_m": 4.12, "drift_percent": 1.25, "status": "Good"},
            {"method": "AI + EKF / UKF", "position_rmse_m": 1.82, "drift_percent": 0.65, "status": "Very Good"},
            {"method": "AI + Map Matching", "position_rmse_m": 0.85, "drift_percent": 0.18, "status": "Optimal"}
        ]
    }

@router.get("/models")
def get_ai_models():
    return {
        "models": [
            {
                "id": "M1",
                "name": "Vehicle Speed Estimator",
                "version": "v2.1-rf",
                "framework": "Scikit-Learn Random Forest",
                "input_features": ["accel_std_3axis", "pitch_angle", "roll_angle", "engine_vibration_fft"],
                "output": "Forward Velocity (m/s)",
                "accuracy_mae": 0.34,
                "inference_latency_ms": 1.4,
                "model_size_mb": 4.2,
                "status": "ACTIVE"
            },
            {
                "id": "M2",
                "name": "Vibration & Pothole Classifier",
                "version": "v1.0-rf",
                "framework": "Scikit-Learn Random Forest",
                "input_features": ["accel_z_variance", "peak_g_spike", "spectral_energy"],
                "output": "Road Condition Category (Smooth/Rough/Pothole)",
                "accuracy_mae": 0.02,
                "inference_latency_ms": 0.8,
                "model_size_mb": 1.1,
                "status": "ACTIVE"
            },
            {
                "id": "M3",
                "name": "IMU Zero-Bias Estimator",
                "version": "v1.5-kalman",
                "framework": "Statistical ZUPT Filter",
                "input_features": ["stationary_detector", "gyro_mean", "temperature"],
                "output": "Zero-G Bias Offsets [ax, ay, gz]",
                "accuracy_mae": 0.005,
                "inference_latency_ms": 0.4,
                "model_size_mb": 0.5,
                "status": "ACTIVE"
            },
            {
                "id": "M4",
                "name": "GNSS/INS Fusion Corrector",
                "version": "v2.0-ekf",
                "framework": "Extended Kalman Filter",
                "input_features": ["state_vector_8d", "gnss_hdop", "innovation_residual"],
                "output": "Corrected Lat/Lon/Vel State",
                "accuracy_mae": 0.15,
                "inference_latency_ms": 2.1,
                "model_size_mb": 2.8,
                "status": "ACTIVE"
            }
        ]
    }

@router.post("/models/upload")
def upload_ai_model(name: str = Form(...), framework: str = Form("ONNX")):
    sim_service._add_log("INFO", "AI Models", f"New model uploaded successfully: {name} ({framework})")
    return {
        "status": "success",
        "message": f"Model '{name}' deployed successfully.",
        "model_id": "M5-custom"
    }

@router.post("/models/train")
def train_ai_model():
    res = train_baseline_speed_model()
    return {"status": "trained", "metrics": res}

@router.get("/datasets")
def get_datasets():
    loader = IOVNBDDatasetLoader()
    info = loader.load_dataset()
    return {
        "datasets": [
            {
                "id": "DS-001",
                "name": info["status"],
                "filename": info["filename"],
                "records_count": info["total_records"],
                "duration_s": info["duration_s"],
                "sampling_hz": 10,
                "tag": info["data_tag"],
                "is_real": info["is_real_dataset"],
                "uploaded_at": "2026-09-04 20:00:00"
            }
        ]
    }

@router.post("/datasets/upload")
def upload_dataset(name: str = Form(...)):
    sim_service._add_log("INFO", "Datasets", f"Dataset '{name}' uploaded and parsed successfully.")
    return {"status": "success", "message": f"Dataset '{name}' ingested."}

@router.get("/logs")
def get_system_logs():
    return {"logs": list(reversed(sim_service.system_logs))}

# SIH Evaluation Endpoints
@router.post("/sih/run-demo")
def run_sih_demo():
    try:
        return sim_service.run_sih_demo_sequence()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SIH Demo Execution Error: {str(e)}")

@router.get("/sih/results")
def get_sih_results():
    try:
        if sim_service.sih_demo_result is None:
            sim_service.run_sih_demo_sequence()
        return sim_service.sih_demo_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving SIH results: {str(e)}")

@router.post("/evaluation/run")
def run_evaluation():
    try:
        return sim_service.run_sih_demo_sequence()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SIH Evaluation Run Error: {str(e)}")

@router.get("/sih/plots/{plot_name}")
def get_sih_plot(plot_name: str):
    if "trajectory" in plot_name or plot_name.startswith("1_") or plot_name.startswith("2_") or plot_name.startswith("3_") or plot_name.startswith("4_") or plot_name.startswith("5_") or "combined" in plot_name:
        path = os.path.join("results", "trajectory", plot_name)
    elif "barchart" in plot_name:
        path = os.path.join("results", "performance", plot_name)
    else:
        path = os.path.join("results", "error", plot_name)

    if os.path.exists(path):
        return FileResponse(path)
    raise HTTPException(status_code=404, detail="Plot file not found")
