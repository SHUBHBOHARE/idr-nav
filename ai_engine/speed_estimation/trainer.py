import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from data.io_vnbd_loader import IOVNBDDatasetLoader
from ai_engine.features.feature_extractor import FeatureExtractor

def train_baseline_speed_model(model_save_path: str = "models/baseline_speed_rf.joblib") -> dict:
    """
    Trains Scikit-Learn Random Forest speed regressor on dataset features.
    Saves trained model artifact to models/ directory.
    """
    loader = IOVNBDDatasetLoader()
    dataset_info = loader.load_dataset()
    df = loader.processed_df

    extractor = FeatureExtractor()
    X, y = extractor.extract_features_df(df)

    # 70% Train, 30% Test split
    split_idx = int(len(X) * 0.70)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = float(mean_absolute_error(y_test, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2 = float(r2_score(y_test, y_pred))

    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    joblib.dump(model, model_save_path)

    print(f"[Trainer] Model successfully trained and saved to {model_save_path}")
    print(f"[Trainer] Metrics: MAE={mae:.4f}, RMSE={rmse:.4f}, R2={r2:.4f}")

    return {
        "model_path": model_save_path,
        "dataset_status": dataset_info["status"],
        "data_tag": dataset_info["data_tag"],
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2_score": round(max(0.0, r2), 4)
    }

if __name__ == "__main__":
    train_baseline_speed_model()
