import os
import joblib
import numpy as np

class SpeedPredictor:
    """
    Speed Predictor Module.
    Loads trained RandomForestRegressor model (models/baseline_speed_rf.joblib)
    to predict vehicle forward speed from 6 IMU features.
    """

    def __init__(self, model_path: str = "models/baseline_speed_rf.joblib"):
        self.model_path = model_path
        self.model = None
        self.is_trained = False

        if os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                self.is_trained = True
            except Exception:
                self.is_trained = False

    def predict(self, feature_vector: list) -> float:
        """
        Input: feature vector [horiz_energy, vert_vibration, pitch, roll, yaw_rate, mag]
        Output: predicted speed (m/s)
        """
        if self.is_trained and self.model is not None:
            try:
                pred = self.model.predict([feature_vector])
                return max(0.0, float(pred[0]))
            except Exception:
                pass

        # Statistical baseline fallback
        horiz_energy = feature_vector[0]
        yaw_rate = feature_vector[4]
        est = np.sqrt(max(0.0, horiz_energy)) * 3.8 + (yaw_rate * 0.2)
        return max(0.0, float(est))
