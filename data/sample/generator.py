import numpy as np
import pandas as pd
import os

def generate_sample_dataset(filepath: str = "data/sample/io_vnbd_sample.csv", duration_seconds: int = 180, hz: int = 10):
    """
    Generates a realistic IO-VNBD compatible vehicle sensor dataset.
    Includes:
    - 0 to 60s: GNSS ON (Normal Driving)
    - 60 to 120s: GNSS OUTAGE (Tunnel / Urban Canyon simulation)
    - 120 to 180s: GNSS RECOVERED (Fusion & Drift correction)
    """
    total_samples = duration_seconds * hz
    t = np.linspace(0, duration_seconds, total_samples)

    start_lat = 37.7749
    start_lon = -122.4194

    # Simulated vehicle speed profile (0 to 15 m/s (~54 km/h))
    base_speed = 10.0 + 4.0 * np.sin(0.05 * t) + np.random.normal(0, 0.2, total_samples)
    base_speed = np.clip(base_speed, 0.0, 20.0)

    # Simulated heading angle (gradually turning NE)
    heading_rad = 0.8 + 0.1 * np.sin(0.02 * t)
    yaw_rate = np.gradient(heading_rad, 1.0 / hz)

    # Accelerometer signals (body frame)
    ax = np.gradient(base_speed, 1.0 / hz) + np.random.normal(0, 0.15, total_samples)
    ay = base_speed * yaw_rate + np.random.normal(0, 0.1, total_samples)
    az = 9.80665 + np.random.normal(0, 0.3, total_samples) # Gravity + road vibration

    # Add pothole at t = 75s
    pothole_idx = int(75 * hz)
    az[pothole_idx:pothole_idx+5] += 2.5

    # Integrate ground truth lat/lon
    gt_lats = [start_lat]
    gt_lons = [start_lon]
    dt = 1.0 / hz
    R = 6371000.0

    curr_lat, curr_lon = start_lat, start_lon
    for i in range(1, total_samples):
        d_north = base_speed[i] * np.cos(heading_rad[i]) * dt
        d_east = base_speed[i] * np.sin(heading_rad[i]) * dt
        curr_lat += (d_north / R) * (180.0 / np.pi)
        curr_lon += (d_east / (R * np.cos(np.radians(curr_lat)))) * (180.0 / np.pi)
        gt_lats.append(curr_lat)
        gt_lons.append(curr_lon)

    # GNSS availability flag: Outage between 60s and 120s
    gnss_available = (t < 60) | (t > 120)

    # GNSS Position with noise when available, NaN when unavailable
    gnss_lats = [lat + (np.random.normal(0, 0.00003) if g else np.nan) for lat, g in zip(gt_lats, gnss_available)]
    gnss_lons = [lon + (np.random.normal(0, 0.00003) if g else np.nan) for lon, g in zip(gt_lons, gnss_available)]
    satellites = [int(np.random.randint(8, 12)) if g else 0 for g in gnss_available]
    hdop = [round(float(np.random.uniform(0.8, 1.4)), 2) if g else 9.9 for g in gnss_available]

    df = pd.DataFrame({
        "timestamp_s": np.round(t, 2),
        "accel_x": np.round(ax, 4),
        "accel_y": np.round(ay, 4),
        "accel_z": np.round(az, 4),
        "gyro_x": np.round(np.random.normal(0, 0.02, total_samples), 4),
        "gyro_y": np.round(np.random.normal(0, 0.02, total_samples), 4),
        "gyro_z": np.round(yaw_rate, 4),
        "mag_x": np.round(25.0 * np.cos(heading_rad), 2),
        "mag_y": np.round(25.0 * np.sin(heading_rad), 2),
        "mag_z": np.round(40.0 + np.random.normal(0, 0.5, total_samples), 2),
        "gnss_available": gnss_available,
        "gnss_lat": np.round(gnss_lats, 7),
        "gnss_lon": np.round(gnss_lons, 7),
        "satellites": satellites,
        "hdop": hdop,
        "gt_lat": np.round(gt_lats, 7),
        "gt_lon": np.round(gt_lons, 7),
        "gt_speed_m_s": np.round(base_speed, 2),
        "gt_heading_rad": np.round(heading_rad, 4)
    })

    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    df.to_csv(filepath, index=False)
    print(f"Sample dataset successfully generated at {filepath} ({len(df)} rows)")

if __name__ == "__main__":
    generate_sample_dataset()
