import time

class GNSSOutageDetector:
    """
    Detects GNSS signal loss, degradation, or sudden positional anomalies.
    """

    def __init__(self, hdop_threshold: float = 3.5, min_satellites: int = 4, max_accuracy_m: float = 15.0):
        self.hdop_threshold = hdop_threshold
        self.min_satellites = min_satellites
        self.max_accuracy = max_accuracy_m
        self.last_valid_timestamp = time.time()
        self.consecutive_failures = 0

    def evaluate(self, gnss_data: dict) -> dict:
        """
        Evaluates GNSS health parameters.
        Returns state: "HEALTHY", "DEGRADED", "LOST"
        """
        is_available = gnss_data.get("is_available", True)
        satellites = gnss_data.get("satellites", 8)
        hdop = gnss_data.get("hdop", 1.2)
        accuracy = gnss_data.get("accuracy", 3.0)

        if not is_available:
            self.consecutive_failures += 1
            return {
                "status": "LOST",
                "reason": "Signal hardware disconnected / manual outage",
                "outage_duration_s": round(time.time() - self.last_valid_timestamp, 1)
            }

        if satellites < self.min_satellites or hdop > self.hdop_threshold or accuracy > self.max_accuracy:
            self.consecutive_failures += 1
            status = "LOST" if self.consecutive_failures > 3 else "DEGRADED"
            return {
                "status": status,
                "reason": f"High HDOP ({hdop}) or low satellite count ({satellites})",
                "outage_duration_s": round(time.time() - self.last_valid_timestamp, 1) if status == "LOST" else 0.0
            }

        # Healthy GNSS fix
        self.consecutive_failures = 0
        self.last_valid_timestamp = time.time()
        return {
            "status": "HEALTHY",
            "reason": "Clear GNSS fix",
            "outage_duration_s": 0.0
        }
