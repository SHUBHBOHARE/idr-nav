import numpy as np

class StrapdownINS:
    """
    Strapdown Inertial Navigation System (INS).
    Integrates acceleration and angular velocity to update velocity, position, and attitude (heading, pitch, roll).
    """

    def __init__(self, init_lat: float = 37.7749, init_lon: float = -122.4194, init_speed_m_s: float = 0.0, init_heading_rad: float = 0.0):
        self.lat = init_lat
        self.lon = init_lon
        self.speed = init_speed_m_s
        self.heading = init_heading_rad  # rad, North = 0, East = pi/2
        self.pitch = 0.0
        self.roll = 0.0

        # WGS-84 Earth radius constants
        self.R_earth = 6371000.0  # meters

    def update(self, ax: float, ay: float, gz: float, dt: float) -> dict:
        """
        Update INS state over time step dt.
        ax: forward acceleration in body frame (m/s^2)
        ay: lateral acceleration in body frame (m/s^2)
        gz: yaw rate in rad/s
        """
        # 1. Integrate yaw/heading
        self.heading = (self.heading + gz * dt) % (2 * np.pi)

        # 2. Integrate forward speed
        self.speed = max(0.0, self.speed + ax * dt)

        # 3. Calculate velocity vector in North-East frame
        v_north = self.speed * np.cos(self.heading)
        v_east = self.speed * np.sin(self.heading)

        # 4. Integrate position (lat, lon)
        d_north = v_north * dt
        d_east = v_east * dt

        delta_lat = (d_north / self.R_earth) * (180.0 / np.pi)
        delta_lon = (d_east / (self.R_earth * np.cos(np.radians(self.lat)))) * (180.0 / np.pi)

        self.lat += delta_lat
        self.lon += delta_lon

        return {
            "lat": self.lat,
            "lon": self.lon,
            "speed_m_s": self.speed,
            "speed_km_h": round(self.speed * 3.6, 2),
            "heading_deg": round(np.degrees(self.heading) % 360, 2),
            "v_north": v_north,
            "v_east": v_east
        }
