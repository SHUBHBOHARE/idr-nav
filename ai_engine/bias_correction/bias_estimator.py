import numpy as np

class BiasEstimator:
    """
    Zero Velocity Update (ZUPT) & Online IMU Bias Estimator.
    Detects stationary vehicle states to continuously refine zero-g accelerometer and gyro drift biases.
    """

    def __init__(self, stationary_variance_thresh: float = 0.02):
        self.variance_thresh = stationary_variance_thresh
        self.accel_bias = np.zeros(3)
        self.gyro_bias = np.zeros(3)

    def update_bias_if_stationary(self, accel_window: list, gyro_window: list) -> dict:
        """
        If variance across window is low, vehicle is stationary -> estimate zero bias offset.
        """
        if len(accel_window) < 10:
            return {"is_stationary": False, "bias_updated": False}

        accel_arr = np.array(accel_window)
        gyro_arr = np.array(gyro_window)

        var_accel = float(np.mean(np.var(accel_arr, axis=0)))
        var_gyro = float(np.mean(np.var(gyro_arr, axis=0)))

        is_stationary = (var_accel < self.variance_thresh) and (var_gyro < 0.005)

        if is_stationary:
            # Gravity vector magnitude is 9.80665 m/s2
            mean_accel = np.mean(accel_arr, axis=0)
            mean_gyro = np.mean(gyro_arr, axis=0)

            # Estimate gyro bias directly from stationary mean
            self.gyro_bias = 0.9 * self.gyro_bias + 0.1 * mean_gyro
            # Accel bias (subtracting Z gravity)
            self.accel_bias[0] = 0.9 * self.accel_bias[0] + 0.1 * mean_accel[0]
            self.accel_bias[1] = 0.9 * self.accel_bias[1] + 0.1 * mean_accel[1]
            self.accel_bias[2] = 0.9 * self.accel_bias[2] + 0.1 * (mean_accel[2] - 9.80665)

            return {
                "is_stationary": True,
                "bias_updated": True,
                "accel_bias": [round(float(b), 4) for b in self.accel_bias],
                "gyro_bias": [round(float(b), 4) for b in self.gyro_bias]
            }

        return {"is_stationary": False, "bias_updated": False}
