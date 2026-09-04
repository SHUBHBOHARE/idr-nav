import numpy as np

def evaluate_model_performance(y_true: list, y_pred: list) -> dict:
    """
    Computes regression metrics: MAE, RMSE, R² score, and Maximum Position Error.
    """
    if not y_true or not y_pred or len(y_true) != len(y_pred):
        return {"mae": 0.0, "rmse": 0.0, "r2_score": 0.0, "max_error": 0.0}

    y_t = np.array(y_true, dtype=float)
    y_p = np.array(y_pred, dtype=float)

    errors = y_t - y_p
    mae = float(np.mean(np.abs(errors)))
    rmse = float(np.sqrt(np.mean(errors**2)))
    max_error = float(np.max(np.abs(errors)))

    ss_res = np.sum(errors**2)
    ss_tot = np.sum((y_t - np.mean(y_t))**2)
    r2 = float(1.0 - (ss_res / (ss_tot + 1e-8)))

    return {
        "mae": round(mae, 3),
        "rmse": round(rmse, 3),
        "r2_score": round(max(0.0, r2), 4),
        "max_error": round(max_error, 3)
    }
