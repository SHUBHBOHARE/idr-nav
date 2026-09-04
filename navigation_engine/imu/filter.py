import numpy as np
from scipy.signal import butter, filtfilt

class IMUFilter:
    """
    IMU Preprocessing & Noise Reduction Filter.
    Supports low-pass Butterworth filtering, gravity compensation, and bias correction.
    """

    def __init__(self, sample_rate_hz: float = 50.0, cutoff_freq_hz: float = 5.0, order: int = 2):
        self.sample_rate = sample_rate_hz
        self.cutoff_freq = cutoff_freq_hz
        self.order = order
        self.gravity_m_s2 = 9.80665

        # Design Butterworth low-pass filter
        nyquist = 0.5 * sample_rate_hz
        normal_cutoff = cutoff_freq_hz / nyquist
        self.b, self.a = butter(order, normal_cutoff, btype='low', analog=False)

        # Calibration biases
        self.accel_bias = np.zeros(3)
        self.gyro_bias = np.zeros(3)

    def set_bias(self, accel_bias: np.ndarray, gyro_bias: np.ndarray):
        """Set calibrated accelerometer and gyroscope zero-bias offsets."""
        self.accel_bias = np.array(accel_bias, dtype=float)
        self.gyro_bias = np.array(gyro_bias, dtype=float)

    def filter_signal(self, data_series: np.ndarray) -> np.ndarray:
        """
        Apply zero-phase Butterworth low-pass filter to 1D or 2D sensor array.
        """
        if len(data_series) < 15:
            # Fallback for small signal chunks
            return data_series
        return filtfilt(self.b, self.a, data_series, axis=0)

    def process_frame(self, ax: float, ay: float, az: float,
                      gx: float, gy: float, gz: float,
                      pitch_rad: float = 0.0, roll_rad: float = 0.0) -> dict:
        """
        Process single IMU frame: subtract bias and remove gravity projection.
        """
        # 1. Bias subtraction
        ax_c = ax - self.accel_bias[0]
        ay_c = ay - self.accel_bias[1]
        az_c = az - self.accel_bias[2]

        gx_c = gx - self.gyro_bias[0]
        gy_c = gy - self.gyro_bias[1]
        gz_c = gz - self.gyro_bias[2]

        # 2. Gravity removal in body frame
        # g_body = [-g * sin(pitch), g * sin(roll) * cos(pitch), g * cos(roll) * cos(pitch)]
        g_x = -self.gravity_m_s2 * np.sin(pitch_rad)
        g_y = self.gravity_m_s2 * np.sin(roll_rad) * np.cos(pitch_rad)
        g_z = self.gravity_m_s2 * np.cos(roll_rad) * np.cos(pitch_rad)

        ax_net = ax_c - g_x
        ay_net = ay_c - g_y
        az_net = az_c - g_z

        return {
            "accel_filtered": [round(float(ax_net), 4), round(float(ay_net), 4), round(float(az_net), 4)],
            "gyro_filtered": [round(float(gx_c), 4), round(float(gy_c), 4), round(float(gz_c), 4)],
            "noise_level": round(float(np.std([ax_net, ay_net, az_net])), 4)
        }
