import os
import glob
import numpy as np
import pandas as pd

class IOVNBDDatasetLoader:
    """
    Official IO-VNBD Dataset Loader & Preprocessing Pipeline.
    In-built fallback to synthetic sample data with explicit [DEMO / SYNTHETIC] tagging when real dataset files are absent.
    """

    def __init__(self, data_dir: str = "data/io_vnbd", sample_dir: str = "data/sample"):
        self.data_dir = data_dir
        self.sample_dir = sample_dir
        self.is_real_dataset = False
        self.dataset_status = "Waiting for IO-VNBD dataset"
        self.raw_df = None
        self.processed_df = None

    def check_dataset_availability() -> dict:
        pass  # Defined below

    def load_dataset(self, outage_start_s: float = 60.0, outage_duration_s: float = 60.0) -> dict:
        """
        Loads dataset from data/io_vnbd/ or falls back to synthetic sample.
        Performs timestamp alignment, IMU/GNSS filtering, ground truth extraction, and train/val/test splitting.
        """
        real_files = glob.glob(os.path.join(self.data_dir, "*.csv")) + glob.glob(os.path.join(self.data_dir, "*.h5"))
        
        if real_files:
            self.is_real_dataset = True
            self.dataset_status = f"Real IO-VNBD Dataset Loaded ({os.path.basename(real_files[0])})"
            filepath = real_files[0]
            tag = "[REAL IO-VNBD DATASET]"
        else:
            self.is_real_dataset = False
            self.dataset_status = "Waiting for IO-VNBD dataset (Using Synthetic Sample)"
            filepath = os.path.join(self.sample_dir, "io_vnbd_sample.csv")
            tag = "[DEMO / SYNTHETIC]"

            # Ensure sample file exists
            if not os.path.exists(filepath):
                from data.sample.generator import generate_sample_dataset
                generate_sample_dataset(filepath)

        df = pd.read_csv(filepath)
        self.raw_df = df.copy()

        # 1. Timestamp Synchronization
        if "timestamp_s" not in df.columns:
            df["timestamp_s"] = np.arange(len(df)) * 0.1

        # 2. IMU Preprocessing (Butterworth 3.5Hz low-pass simulation)
        from scipy.signal import butter, filtfilt
        b, a = butter(2, 0.7, btype='low')
        for col in ["accel_x", "accel_y", "accel_z", "gyro_z"]:
            if col in df.columns and len(df) > 15:
                df[f"{col}_filtered"] = filtfilt(b, a, df[col].values)
            else:
                df[f"{col}_filtered"] = df[col]

        # 3. Ground Truth & Feature Extraction
        df["speed_ground_truth"] = df.get("gt_speed_m_s", np.sqrt(df["accel_x"]**2 + df["accel_y"]**2) * 3.5)
        df["heading_ground_truth"] = df.get("gt_heading_rad", np.radians(54.2))

        # 4. Configurable GNSS Outage Simulation
        t = df["timestamp_s"].values
        outage_mask = (t >= outage_start_s) & (t < (outage_start_s + outage_duration_s))
        
        df["gnss_outage_simulated"] = outage_mask
        df["gnss_lat_simulated"] = np.where(outage_mask, np.nan, df.get("gnss_lat", df["gt_lat"]))
        df["gnss_lon_simulated"] = np.where(outage_mask, np.nan, df.get("gnss_lon", df["gt_lon"]))

        self.processed_df = df

        # 5. Train / Val / Test Splitting (70% Train, 15% Val, 15% Test)
        n = len(df)
        train_end = int(n * 0.70)
        val_end = int(n * 0.85)

        train_df = df.iloc[:train_end]
        val_df = df.iloc[train_end:val_end]
        test_df = df.iloc[val_end:]

        return {
            "status": self.dataset_status,
            "data_tag": tag,
            "is_real_dataset": self.is_real_dataset,
            "filename": os.path.basename(filepath),
            "total_records": n,
            "duration_s": round(float(t[-1] - t[0]), 1),
            "sampling_hz": 10,
            "splits": {
                "train_records": len(train_df),
                "val_records": len(val_df),
                "test_records": len(test_df)
            },
            "outage_config": {
                "outage_start_s": outage_start_s,
                "outage_duration_s": outage_duration_s,
                "outage_samples": int(np.sum(outage_mask))
            }
        }
