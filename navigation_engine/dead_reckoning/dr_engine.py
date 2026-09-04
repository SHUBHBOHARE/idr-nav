import numpy as np

class DeadReckoningEngine:
    """
    AI-assisted Dead Reckoning (DR) Engine.
    Computes position changes using AI-estimated forward speed and IMU heading integration.
    """

    def __init__(self, start_lat: float = 37.7749, start_lon: float = -122.4194):
        self.current_lat = start_lat
        self.current_lon = start_lon
        self.heading_rad = 0.0
        self.cumulative_distance_m = 0.0
        self.cumulative_drift_m = 0.0
        self.R_earth = 6371000.0  # Earth radius in meters

    def reset_position(self, lat: float, lon: float, heading_rad: float = 0.0):
        """Reset DR position to a known GNSS fix or ground truth coordinate."""
        self.current_lat = lat
        self.current_lon = lon
        self.heading_rad = heading_rad
        self.cumulative_drift_m = 0.0

    def step(self, ai_estimated_speed_m_s: float, gz_rad_s: float, dt: float,
             ground_truth_lat: float = None, ground_truth_lon: float = None) -> dict:
        """
        Perform single DR step.
        """
        # 1. Update heading using yaw rate
        self.heading_rad = (self.heading_rad + gz_rad_s * dt) % (2 * np.pi)

        # 2. Compute distance traveled in interval
        step_distance = ai_estimated_speed_m_s * dt
        self.cumulative_distance_m += step_distance

        # 3. Project movement to North/East
        delta_north = step_distance * np.cos(self.heading_rad)
        delta_east = step_distance * np.sin(self.heading_rad)

        # 4. Update lat/lon
        delta_lat = (delta_north / self.R_earth) * (180.0 / np.pi)
        delta_lon = (delta_east / (self.R_earth * np.cos(np.radians(self.current_lat)))) * (180.0 / np.pi)

        self.current_lat += delta_lat
        self.current_lon += delta_lon

        # 5. Compute drift if ground truth provided
        if ground_truth_lat is not None and ground_truth_lon is not None:
            # Haversine distance for drift calculation
            dlat = np.radians(self.current_lat - ground_truth_lat)
            dlon = np.radians(self.current_lon - ground_truth_lon)
            a = np.sin(dlat / 2.0)**2 + np.cos(np.radians(ground_truth_lat)) * np.cos(np.radians(self.current_lat)) * np.sin(dlon / 2.0)**2
            self.cumulative_drift_m = 2 * self.R_earth * np.arcsin(np.sqrt(a))

        drift_percent = (self.cumulative_drift_m / max(1.0, self.cumulative_distance_m)) * 100.0

        return {
            "lat": self.current_lat,
            "lon": self.current_lon,
            "heading_deg": round(np.degrees(self.heading_rad) % 360, 2),
            "speed_m_s": ai_estimated_speed_m_s,
            "cumulative_distance_m": round(self.cumulative_distance_m, 2),
            "cumulative_drift_m": round(self.cumulative_drift_m, 2),
            "drift_percentage": round(drift_percent, 2)
        }
