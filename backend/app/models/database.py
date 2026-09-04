from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(20), default="Engineer")
    created_at = Column(DateTime, default=datetime.utcnow)

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    vin = Column(String(50), unique=True)
    model = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), index=True)
    timestamp = Column(Float, index=True)
    ax = Column(Float)
    ay = Column(Float)
    az = Column(Float)
    gx = Column(Float)
    gy = Column(Float)
    gz = Column(Float)
    mx = Column(Float)
    my = Column(Float)
    mz = Column(Float)

class GNSSMeasurement(Base):
    __tablename__ = "gnss_measurements"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), index=True)
    timestamp = Column(Float)
    lat = Column(Float)
    lon = Column(Float)
    satellites = Column(Integer)
    hdop = Column(Float)
    accuracy = Column(Float)
    speed = Column(Float)
    is_valid = Column(Boolean, default=True)

class NavigationSession(Base):
    __tablename__ = "navigation_sessions"
    id = Column(String(50), primary_key=True)
    vehicle_name = Column(String(50), default="IDR Test Vehicle")
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    current_mode = Column(String(30), default="GNSS + INS")
    status = Column(String(20), default="ACTIVE")

class NavigationState(Base):
    __tablename__ = "navigation_states"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), index=True)
    timestamp = Column(Float)
    mode = Column(String(30))
    confidence_m = Column(Float)
    drift_m = Column(Float)

class TrajectoryPoint(Base):
    __tablename__ = "trajectory_points"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), index=True)
    timestamp = Column(Float)
    source = Column(String(30))
    lat = Column(Float)
    lon = Column(Float)
    speed_km_h = Column(Float)
    heading_deg = Column(Float)

class GNSSOutage(Base):
    __tablename__ = "gnss_outages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), index=True)
    start_time_s = Column(Float)
    end_time_s = Column(Float, nullable=True)
    duration_s = Column(Float, default=0.0)
    max_drift_m = Column(Float, default=0.0)
    cause = Column(String(100), default="Simulated Tunnel / Signal Drop")

class AIModelRecord(Base):
    __tablename__ = "ai_models"
    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    version = Column(String(20), nullable=False)
    framework = Column(String(50), default="PyTorch")
    input_features = Column(Text)
    output_type = Column(String(50))
    accuracy_mae = Column(Float)
    latency_ms = Column(Float)
    model_size_mb = Column(Float)
    status = Column(String(20), default="ACTIVE")

class ModelMetric(Base):
    __tablename__ = "model_metrics"
    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(String(50), ForeignKey("ai_models.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    mae = Column(Float)
    rmse = Column(Float)
    r2_score = Column(Float)

class DatasetRecord(Base):
    __tablename__ = "datasets"
    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    filename = Column(String(200))
    records_count = Column(Integer)
    duration_s = Column(Float)
    sampling_hz = Column(Integer, default=10)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class SimulationRun(Base):
    __tablename__ = "simulation_runs"
    id = Column(String(50), primary_key=True)
    dataset_id = Column(String(50), ForeignKey("datasets.id"))
    scenario = Column(String(50), default="Tunnel Outage")
    outage_start_s = Column(Float, default=60.0)
    outage_end_s = Column(Float, default=120.0)
    dr_rmse_m = Column(Float)
    status = Column(String(20), default="COMPLETED")

class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(50), ForeignKey("simulation_runs.id"))
    mode = Column(String(30))
    position_rmse_m = Column(Float)
    max_error_m = Column(Float)
    drift_percent = Column(Float)

class SystemLog(Base):
    __tablename__ = "system_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    severity = Column(String(10), default="INFO")
    module = Column(String(30))
    message = Column(Text)

class CalibrationSession(Base):
    __tablename__ = "calibration_sessions"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    state = Column(String(30), default="CALIBRATED")
    pitch_deg = Column(Float)
    roll_deg = Column(Float)
    yaw_deg = Column(Float)
    confidence = Column(Float, default=0.96)
