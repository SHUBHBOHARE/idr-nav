from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_api_status():
    response = client.get("/api/status")
    assert response.status_code == 200
    assert "navigation_mode" in response.json()

def test_navigation_state_and_position():
    state_res = client.get("/api/navigation/state")
    assert state_res.status_code == 200
    assert "current_lat" in state_res.json()

    pos_res = client.get("/api/navigation/position")
    assert pos_res.status_code == 200
    assert "lat" in pos_res.json()

def test_gnss_outage_simulation_flow():
    # 1. Trigger outage
    outage_res = client.post("/api/gnss/simulate-outage")
    assert outage_res.status_code == 200
    assert outage_res.json()["mode"] == "AI DEAD RECKONING"

    # Verify status reflects outage
    status_res = client.get("/api/gnss/status")
    assert status_res.json()["is_available"] is False

    # 2. Restore GNSS
    restore_res = client.post("/api/gnss/restore")
    assert restore_res.status_code == 200
    assert restore_res.json()["mode"] == "GNSS + INS"

def test_models_and_datasets_endpoints():
    models_res = client.get("/api/models")
    assert models_res.status_code == 200
    assert len(models_res.json()["models"]) >= 4

    datasets_res = client.get("/api/datasets")
    assert datasets_res.status_code == 200
    assert len(datasets_res.json()["datasets"]) >= 1

def test_system_logs_endpoint():
    logs_res = client.get("/api/logs")
    assert logs_res.status_code == 200
    assert "logs" in logs_res.json()
