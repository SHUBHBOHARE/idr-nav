import numpy as np

class VibrationClassifier:
    """
    Classifies road surface conditions (Smooth, Rough, Pothole, Speedbump)
    based on Z-axis accelerometer variance and peak acceleration spikes.
    """

    def __init__(self):
        self.pothole_threshold_g = 1.8  # > 1.8g spike indicates pothole/bump

    def classify_window(self, az_window: list) -> dict:
        if not az_window:
            return {"condition": "SMOOTH", "vibration_level": 0.0, "pothole_detected": False}

        az_arr = np.array(az_window)
        std_dev = float(np.std(az_arr))
        max_spike = float(np.max(np.abs(az_arr - 9.80665)) / 9.80665)

        pothole_detected = max_spike > self.pothole_threshold_g

        if pothole_detected:
            condition = "POTHOLE_ALERT"
        elif std_dev > 1.2:
            condition = "ROUGH_COBBLESTONE"
        elif std_dev > 0.5:
            condition = "MODERATE_VIBRATION"
        else:
            condition = "SMOOTH_ASPHALT"

        return {
            "condition": condition,
            "vibration_level": round(std_dev, 3),
            "peak_spike_g": round(max_spike, 2),
            "pothole_detected": pothole_detected
        }
