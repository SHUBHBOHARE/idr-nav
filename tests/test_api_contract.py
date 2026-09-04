import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "timestamp" in data

def test_api_status():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert "overall_health" in data
    assert "gnss_status" in data
    assert "navigation_mode" in data

def test_post_evaluation_run_contract():
    response = client.post("/api/evaluation/run")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert "message" in data
    assert "data_origin" in data
    assert data["data_origin"] in ["DEMO / SYNTHETIC", "REAL IO-VNBD"]
    
    # Check scenario
    assert "scenario" in data
    assert "outage_duration_sec" in data["scenario"]
    assert "distance_m" in data["scenario"]
    
    # Check metrics
    assert "metrics" in data
    assert "position_rmse_m" in data["metrics"]
    assert "drift_percent" in data["metrics"]
    assert "update_rate_hz" in data["metrics"]
    
    # Check trajectory
    assert "trajectory" in data
    traj = data["trajectory"]
    for key in ["ground_truth", "gnss", "raw_imu_dr", "ai_dr", "ai_ekf", "map_matched"]:
        assert key in traj
        assert isinstance(traj[key], list)
        assert len(traj[key]) > 0

def test_get_performance():
    response = client.get("/api/performance")
    assert response.status_code == 200
    data = response.json()
    assert "dead_reckoning" in data
    assert "gnss_ins_fusion" in data
    assert "comparisons" in data

def test_get_datasets():
    response = client.get("/api/datasets")
    assert response.status_code == 200
    data = response.json()
    assert "datasets" in data
    assert len(data["datasets"]) > 0

def test_get_gnss_status():
    response = client.get("/api/gnss/status")
    assert response.status_code == 200
    data = response.json()
    assert "is_available" in data
    assert "satellites" in data

def test_get_imu_latest():
    response = client.get("/api/imu/latest")
    assert response.status_code == 200
    data = response.json()
    assert "accel" in data
    assert "gyro" in data
    assert len(data["accel"]) == 3

def test_navigation_control_flow():
    # 1. Start navigation
    res_start = client.post("/api/navigation/start")
    assert res_start.status_code == 200
    data_start = res_start.json()
    assert data_start["status"] == "started"
    assert "mode" in data_start

    # 2. Get state & position
    res_state = client.get("/api/navigation/state")
    assert res_state.status_code == 200
    assert "current_lat" in res_state.json()

    res_pos = client.get("/api/navigation/position")
    assert res_pos.status_code == 200
    assert "lat" in res_pos.json()

    # 3. Simulate outage
    res_outage = client.post("/api/gnss/simulate-outage")
    assert res_outage.status_code == 200
    assert res_outage.json()["gnss_status"] == "LOST"

    # 4. Restore GNSS
    res_restore = client.post("/api/gnss/restore")
    assert res_restore.status_code == 200
    assert res_restore.json()["gnss_status"] == "CONNECTED"

    # 5. Pause navigation
    res_pause = client.post("/api/navigation/pause")
    assert res_pause.status_code == 200
    assert res_pause.json()["status"] == "paused"

    # 6. Reset navigation
    res_reset = client.post("/api/navigation/reset")
    assert res_reset.status_code == 200
    assert res_reset.json()["status"] == "reset"

