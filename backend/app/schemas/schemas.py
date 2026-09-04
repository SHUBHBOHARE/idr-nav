from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class NavigationStateResponse(BaseModel):
    mode: str
    gnss_status: str
    imu_status: str
    ai_status: str
    map_status: str
    fusion_status: str
    current_lat: float
    current_lon: float
    speed_km_h: float
    heading_deg: float
    position_confidence_m: float
    drift_m: float
    drift_percentage: float
    outage_duration_s: float
    active_road: str

class IMULatestResponse(BaseModel):
    timestamp: float
    accel: List[float]
    gyro: List[float]
    mag: List[float]
    accel_filtered: List[float]
    gyro_filtered: List[float]
    noise_level: float
    bias_ax: float
    bias_ay: float
    bias_gz: float
    filter_status: str

class GNSSStatusResponse(BaseModel):
    is_available: bool
    status: str
    satellites: int
    hdop: float
    accuracy_m: float
    lat: float
    lon: float
    speed_km_h: float
    signal_quality: str

class ModelSchema(BaseModel):
    id: str
    name: str
    version: str
    framework: str
    input_features: List[str]
    output_type: str
    accuracy_mae: float
    latency_ms: float
    model_size_mb: float
    status: str

class SimulationStatusResponse(BaseModel):
    is_running: bool
    current_step: int
    total_steps: int
    scenario: str
    outage_active: bool
    current_mode: str
    dr_drift_m: float
    elapsed_time_s: float

class SystemLogSchema(BaseModel):
    id: int
    timestamp: str
    severity: str
    module: str
    message: str
