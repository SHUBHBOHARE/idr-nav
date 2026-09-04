from abc import ABC, abstractmethod
import time
import math
import numpy as np

class SensorProvider(ABC):
    """
    Abstract Sensor Provider Interface.
    Decouples sensor data sources (Datasets, Mock PC Simulator, External 200Hz FOG IMU, Android SensorManager)
    from the core navigation fusion engine.
    """

    @abstractmethod
    def get_next_sample(self) -> dict:
        pass

    @abstractmethod
    def get_sampling_rate_hz(self) -> float:
        pass


class MockSensorProvider(SensorProvider):
    """
    PC Simulator Sensor Provider generating 10Hz synthetic motion.
    """

    def __init__(self, start_lat: float = 37.7749, start_lon: float = -122.4194):
        self.start_lat = start_lat
        self.start_lon = start_lon
        self.step_count = 0

    def get_sampling_rate_hz(self) -> float:
        return 10.0

    def get_next_sample(self) -> dict:
        self.step_count += 1
        dt = 0.1
        t_sec = self.step_count * dt

        speed_gt = float(12.0 + 3.0 * math.sin(0.08 * t_sec))
        heading_gt_rad = float(0.8 + 0.05 * math.sin(0.03 * t_sec))
        yaw_rate = float(0.05 * 0.03 * math.cos(0.03 * t_sec))

        ax_raw = float(np.gradient([speed_gt, speed_gt + 0.1], dt)[0] + np.random.normal(0, 0.15))
        ay_raw = float(speed_gt * yaw_rate + np.random.normal(0, 0.1))
        az_raw = float(9.80665 + np.random.normal(0, 0.25))
        gz_raw = float(yaw_rate + np.random.normal(0, 0.01))

        return {
            "timestamp": time.time(),
            "t_sec": t_sec,
            "accel": [ax_raw, ay_raw, az_raw],
            "gyro": [0.0, 0.0, gz_raw],
            "mag": [24.5, -12.1, 41.8],
            "ground_truth_speed": speed_gt,
            "ground_truth_heading": heading_gt_rad
        }


class DatasetSensorProvider(SensorProvider):
    """
    Ingests sensor data from pandas DataFrame or IO-VNBD dataset rows.
    """

    def __init__(self, df: object):
        self.df = df
        self.current_idx = 0

    def get_sampling_rate_hz(self) -> float:
        return 10.0

    def get_next_sample(self) -> dict:
        if self.current_idx >= len(self.df):
            self.current_idx = 0

        row = self.df.iloc[self.current_idx]
        self.current_idx += 1

        return {
            "timestamp": row.get("timestamp_s", time.time()),
            "accel": [row.get("accel_x", 0.0), row.get("accel_y", 0.0), row.get("accel_z", 9.81)],
            "gyro": [row.get("gyro_x", 0.0), row.get("gyro_y", 0.0), row.get("gyro_z", 0.0)],
            "mag": [row.get("mag_x", 25.0), row.get("mag_y", 0.0), row.get("mag_z", 40.0)],
            "gnss_available": row.get("gnss_available", True),
            "gnss_lat": row.get("gnss_lat", None),
            "gnss_lon": row.get("gnss_lon", None)
        }


class ExternalIMUSensorProvider(SensorProvider):
    """
    High-Frequency ~200Hz FOG-based External IMU Provider.
    Prepares high-throughput buffer ingestion for industrial/defense FOG IMUs.
    """

    def __init__(self, target_hz: float = 200.0):
        self.target_hz = target_hz

    def get_sampling_rate_hz(self) -> float:
        return self.target_hz

    def get_next_sample(self) -> dict:
        now = time.time()
        return {
            "timestamp": now,
            "accel": [0.01, 0.0, 9.80665],
            "gyro": [0.0, 0.0, 0.0],
            "mag": [25.0, 0.0, 40.0],
            "source": "External FOG IMU 200Hz"
        }


class AndroidSensorProvider(SensorProvider):
    """
    Blueprint Interface for Android SensorManager & GNSS APIs.
    """

    def __init__(self):
        self.sampling_hz = 50.0

    def get_sampling_rate_hz(self) -> float:
        return self.sampling_hz

    def get_next_sample(self) -> dict:
        return {
            "timestamp": time.time(),
            "accel": [0.0, 0.0, 9.81],
            "gyro": [0.0, 0.0, 0.0],
            "mag": [20.0, -10.0, 42.0],
            "source": "Android SensorManager API"
        }
