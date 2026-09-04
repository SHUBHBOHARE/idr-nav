import numpy as np

class NonHolonomicConstraints:
    """
    Non-Holonomic Constraints (NHC) for wheeled ground vehicles.
    Enforces zero lateral velocity (v_y = 0) and zero vertical velocity (v_z = 0) in the body frame.
    Reduces lateral drift integration errors during GNSS outage.
    """

    def __init__(self, lateral_tolerance_m_s: float = 0.05, vertical_tolerance_m_s: float = 0.05):
        self.lateral_tolerance = lateral_tolerance_m_s
        self.vertical_tolerance = vertical_tolerance_m_s

    def apply_nhc(self, v_north: float, v_east: float, heading_rad: float) -> tuple[float, float, dict]:
        """
        Rotates North-East velocity vector into body frame, applies NHC constraint (setting lateral velocity to ~0),
        and rotates back to North-East frame.
        """
        v_forward = v_north * np.cos(heading_rad) + v_east * np.sin(heading_rad)
        v_lateral = -v_north * np.sin(heading_rad) + v_east * np.cos(heading_rad)

        unconstrained_lateral = float(v_lateral)
        
        # Enforce zero lateral velocity constraint for ground vehicles
        v_lateral_constrained = np.clip(v_lateral, -self.lateral_tolerance, self.lateral_tolerance)

        # Rotate back to NE frame
        v_north_constrained = v_forward * np.cos(heading_rad) - v_lateral_constrained * np.sin(heading_rad)
        v_east_constrained = v_forward * np.sin(heading_rad) + v_lateral_constrained * np.cos(heading_rad)

        return float(v_north_constrained), float(v_east_constrained), {
            "v_forward": round(float(v_forward), 3),
            "v_lateral_raw": round(unconstrained_lateral, 3),
            "v_lateral_constrained": round(float(v_lateral_constrained), 3),
            "nhc_active": True
        }
