from abc import ABC, abstractmethod

class BaseFusionFilter(ABC):
    """
    Abstract Sensor Fusion Filter Base Class.
    Allows UKF (Unscented Kalman Filter) or Particle Filters to replace the Extended Kalman Filter (EKF) seamlessly.
    """

    @abstractmethod
    def predict(self, ax_m_s2: float, ay_m_s2: float, gz_rad_s: float, ai_speed_m_s: float, dt: float):
        pass

    @abstractmethod
    def update_gnss(self, gnss_lat: float, gnss_lon: float, gnss_speed_m_s: float, gnss_heading_rad: float):
        pass

    @abstractmethod
    def get_state(self) -> dict:
        pass
