import numpy as np

class MapMatcher:
    """
    Map Matching Engine.
    Projects raw Dead Reckoning or EKF estimated coordinates onto road network geometry.
    Uses candidate road scoring based on geometric distance and heading proximity.
    """

    def __init__(self, candidate_roads: list = None):
        # Default sample road network (coordinates list of line segments)
        # Represents urban street grid in San Francisco / Demonstration route
        self.candidate_roads = candidate_roads or [
            # Segment 1: Market St (South-West to North-East)
            {"id": "R1", "name": "Market Street", "coords": [(37.7749, -122.4194), (37.7760, -122.4170)], "heading_deg": 52.0},
            {"id": "R2", "name": "Market Street Ext", "coords": [(37.7760, -122.4170), (37.7775, -122.4140)], "heading_deg": 58.0},
            # Segment 2: Mission St (Parallel)
            {"id": "R3", "name": "Mission Street", "coords": [(37.7740, -122.4190), (37.7755, -122.4160)], "heading_deg": 53.0},
            # Segment 3: 5th St (Cross street)
            {"id": "R4", "name": "5th Street", "coords": [(37.7810, -122.4080), (37.7830, -122.4050)], "heading_deg": 48.0}
        ]

    def match(self, raw_lat: float, raw_lon: float, heading_deg: float) -> dict:
        """
        Match raw lat/lon/heading to candidate road network.
        Returns map matched position and road info.
        """
        best_match = None
        min_score = float('inf')
        matched_lat, matched_lon = raw_lat, raw_lon
        selected_road = "Off-road / Open area"

        for road in self.candidate_roads:
            (p1_lat, p1_lon), (p2_lat, p2_lon) = road["coords"]
            
            # Simple projection onto segment p1-p2
            u = np.array([p2_lat - p1_lat, p2_lon - p1_lon])
            v = np.array([raw_lat - p1_lat, raw_lon - p1_lon])
            
            len_u_sq = np.sum(u**2)
            if len_u_sq < 1e-12:
                continue

            t = max(0.0, min(1.0, np.dot(v, u) / len_u_sq))
            proj_lat = p1_lat + t * u[0]
            proj_lon = p1_lon + t * u[1]

            # Distance error (approx meters: 1 deg ~ 111,000 m)
            dist_m = np.hypot((raw_lat - proj_lat) * 111000.0, (raw_lon - proj_lon) * 111000.0 * np.cos(np.radians(raw_lat)))
            
            # Heading error penalty
            head_diff = abs((heading_deg - road["heading_deg"] + 180) % 360 - 180)
            
            # Total score (distance weight + heading weight)
            score = dist_m + (head_diff * 0.2)

            if score < min_score:
                min_score = score
                matched_lat = proj_lat
                matched_lon = proj_lon
                selected_road = road["name"]
                best_match = road

        # If closest road is within 25m, snapped; otherwise keep raw
        dist_to_road = float(min_score)
        is_snapped = bool(dist_to_road < 25.0)

        return {
            "raw_lat": raw_lat,
            "raw_lon": raw_lon,
            "matched_lat": matched_lat if is_snapped else raw_lat,
            "matched_lon": matched_lon if is_snapped else raw_lon,
            "road_name": selected_road if is_snapped else "Off-Road Path",
            "is_snapped": is_snapped,
            "matching_confidence_percent": round(max(0.0, min(100.0, 100.0 - dist_to_road * 2.0)), 1),
            "distance_to_road_m": round(dist_to_road, 2)
        }
