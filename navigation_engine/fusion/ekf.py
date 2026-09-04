import numpy as np
from navigation_engine.fusion.base_filter import BaseFusionFilter

class ExtendedKalmanFilter(BaseFusionFilter):
    """
    8-State Extended Kalman Filter (EKF) for GNSS/INS & AI Dead Reckoning Fusion.
    State Vector x = [pN, pE, vN, vE, psi, b_ax, b_ay, b_gz]^T
    """

    def __init__(self, init_lat: float = 37.7749, init_lon: float = -122.4194):
        self.R_earth = 6371000.0  # Earth radius meters
        self.ref_lat = init_lat
        self.ref_lon = init_lon

        # State vector [pN, pE, vN, vE, psi, b_ax, b_ay, b_gz]
        self.x = np.zeros(8)
        self.x[0] = 0.0  # pN (m relative to ref)
        self.x[1] = 0.0  # pE (m relative to ref)

        # Covariance matrix P (8x8)
        self.P = np.eye(8) * 0.1
        self.P[0, 0] = 5.0  # initial position uncertainty
        self.P[1, 1] = 5.0
        self.P[4, 4] = 0.05 # heading uncertainty rad

        # Process Noise Q (8x8)
        self.Q = np.diag([0.05, 0.05, 0.1, 0.1, 0.005, 0.001, 0.001, 0.001])

        # Measurement Noise R for GNSS [pN, pE, vN, vE]
        self.R_gnss = np.diag([2.5, 2.5, 0.5, 0.5])

    def predict(self, ax_m_s2: float, ay_m_s2: float, gz_rad_s: float, ai_speed_m_s: float, dt: float):
        """
        EKF Prediction Step based on IMU inputs and AI speed.
        """
        pN, pE, vN, vE, psi, b_ax, b_ay, b_gz = self.x

        gz_corr = gz_rad_s - b_gz
        new_psi = (psi + gz_corr * dt) % (2 * np.pi)

        speed = ai_speed_m_s if ai_speed_m_s > 0 else float(np.hypot(vN, vE))
        new_vN = speed * np.cos(new_psi)
        new_vE = speed * np.sin(new_psi)

        new_pN = pN + new_vN * dt
        new_pE = pE + new_vE * dt

        # State transition Jacobian Matrix F (8x8)
        F = np.eye(8)
        F[0, 2] = dt
        F[1, 3] = dt
        F[2, 4] = -speed * np.sin(new_psi) * dt
        F[3, 4] = speed * np.cos(new_psi) * dt
        F[4, 7] = -dt

        self.x[0] = new_pN
        self.x[1] = new_pE
        self.x[2] = new_vN
        self.x[3] = new_vE
        self.x[4] = new_psi

        self.P = F @ self.P @ F.T + self.Q

    def update_gnss(self, gnss_lat: float, gnss_lon: float, gnss_speed_m_s: float, gnss_heading_rad: float):
        """
        EKF Correction Step when GNSS measurements are available.
        """
        dlat = np.radians(gnss_lat - self.ref_lat)
        dlon = np.radians(gnss_lon - self.ref_lon)

        z_pN = dlat * self.R_earth
        z_pE = dlon * self.R_earth * np.cos(np.radians(self.ref_lat))
        z_vN = gnss_speed_m_s * np.cos(gnss_heading_rad)
        z_vE = gnss_speed_m_s * np.sin(gnss_heading_rad)

        z = np.array([z_pN, z_pE, z_vN, z_vE])

        # Measurement Matrix H (4x8)
        H = np.zeros((4, 8))
        H[0, 0] = 1.0
        H[1, 1] = 1.0
        H[2, 2] = 1.0
        H[3, 3] = 1.0

        y = z - (H @ self.x)
        S = H @ self.P @ H.T + self.R_gnss
        K = self.P @ H.T @ np.linalg.inv(S)

        self.x = self.x + K @ y
        I = np.eye(8)
        self.P = (I - K @ H) @ self.P

    def get_state(self) -> dict:
        pN, pE, vN, vE, psi, b_ax, b_ay, b_gz = self.x

        lat = self.ref_lat + (pN / self.R_earth) * (180.0 / np.pi)
        lon = self.ref_lon + (pE / (self.R_earth * np.cos(np.radians(self.ref_lat)))) * (180.0 / np.pi)

        speed_m_s = float(np.hypot(vN, vE))
        position_variance = float(np.trace(self.P[0:2, 0:2]))

        return {
            "lat": lat,
            "lon": lon,
            "speed_m_s": speed_m_s,
            "speed_km_h": round(speed_m_s * 3.6, 2),
            "heading_deg": round(np.degrees(psi) % 360, 2),
            "position_confidence_m": round(np.sqrt(max(0.1, position_variance)), 2),
            "bias_ax": round(float(b_ax), 4),
            "bias_ay": round(float(b_ay), 4),
            "bias_gz": round(float(b_gz), 4),
            "covariance_trace": round(float(np.trace(self.P)), 4)
        }
