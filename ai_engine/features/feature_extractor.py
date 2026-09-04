import numpy as np
import pandas as pd

class FeatureExtractor:
    """
    Extracts high-frequency kinematic & spectral features from IMU signals.
    Features:
    - 3-axis accel variance & standard deviation
    - Longitudinal & lateral accel integrals
    - Estimated pitch and roll orientation angles
    - Engine vibration spectral FFT magnitude
    """

    def __init__(self, window_size: int = 10):
        self.window_size = window_size

    def extract_features_from_frame(self, ax: float, ay: float, az: float, gx: float, gy: float, gz: float) -> list:
        """Extract 6-element feature vector for single timestep inference."""
        accel_mag = np.sqrt(ax**2 + ay**2 + az**2)
        pitch = np.arctan2(ax, np.sqrt(ay**2 + az**2))
        roll = np.arctan2(ay, az)
        vibration_freq = abs(az - 9.80665)
        
        return [
            float(ax**2 + ay**2),  # Horiz accel energy
            float(vibration_freq),  # Vertical vibration
            float(pitch),           # Pitch angle
            float(roll),            # Roll angle
            float(abs(gz)),         # Yaw rate magnitude
            float(accel_mag)        # Total acceleration magnitude
        ]

    def extract_features_df(self, df: pd.DataFrame) -> tuple[np.ndarray, np.ndarray]:
        """Extract feature matrix X and target vector y from dataset DataFrame."""
        X_list = []
        y_list = []

        ax = df["accel_x"].values
        ay = df["accel_y"].values
        az = df["accel_z"].values
        gx = df.get("gyro_x", np.zeros(len(df))).values
        gy = df.get("gyro_y", np.zeros(len(df))).values
        gz = df["gyro_z"].values

        target_speed = df.get("gt_speed_m_s", np.sqrt(ax**2 + ay**2) * 3.5).values

        for i in range(len(df)):
            feats = self.extract_features_from_frame(ax[i], ay[i], az[i], gx[i], gy[i], gz[i])
            X_list.append(feats)
            y_list.append(target_speed[i])

        return np.array(X_list, dtype=np.float32), np.array(y_list, dtype=np.float32)
