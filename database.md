# Database Schema & Migration Strategy — IDR NAV

## 1. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    VEHICLES ||--o{ NAVIGATION_SESSIONS : owns
    NAVIGATION_SESSIONS ||--o{ SENSOR_READINGS : logs
    NAVIGATION_SESSIONS ||--o{ GNSS_MEASUREMENTS : records
    NAVIGATION_SESSIONS ||--o{ TRAJECTORY_POINTS : generates
    NAVIGATION_SESSIONS ||--o{ GNSS_OUTAGES : captures
    AI_MODELS ||--o{ MODEL_METRICS : evaluates
    DATASETS ||--o{ SIMULATION_RUNS : inputs
    SIMULATION_RUNS ||--o{ PERFORMANCE_METRICS : produces
```

---

## 2. Table Specifications (14 Tables)

1. `users` (id PK, username, email, role, created_at)
2. `vehicles` (id PK, name, vin, model, created_at)
3. `sensor_readings` (id PK, session_id FK, timestamp, ax, ay, az, gx, gy, gz, mx, my, mz)
4. `gnss_measurements` (id PK, session_id FK, timestamp, lat, lon, satellites, hdop, accuracy, speed)
5. `navigation_sessions` (id PK, vehicle_id FK, start_time, end_time, current_mode, status)
6. `navigation_states` (id PK, session_id FK, timestamp, mode, confidence_m, drift_m)
7. `trajectory_points` (id PK, session_id FK, timestamp, source, lat, lon, speed_km_h, heading_deg)
8. `gnss_outages` (id PK, session_id FK, start_time_s, end_time_s, duration_s, max_drift_m, cause)
9. `ai_models` (id PK, name, version, framework, input_features, accuracy_mae, latency_ms, status)
10. `model_metrics` (id PK, model_id FK, timestamp, mae, rmse, r2_score)
11. `datasets` (id PK, name, filename, records_count, duration_s, sampling_hz, uploaded_at)
12. `simulation_runs` (id PK, dataset_id FK, scenario, outage_start_s, outage_end_s, dr_rmse_m, status)
13. `performance_metrics` (id PK, run_id FK, mode, position_rmse_m, max_error_m, drift_percent)
14. `system_logs` (id PK, timestamp, severity, module, message)

---

## 3. SQLite to PostgreSQL Migration Strategy
1. **Dialect Abstraction**: Handled seamlessly via SQLAlchemy ORM.
2. **Datatypes**: `Float` maps to `DOUBLE PRECISION`, `DateTime` maps to `TIMESTAMP WITH TIME ZONE`.
3. **Migration Execution**:
   - For SQLite (Development): `sqlite:///./idr_nav.db`
   - For PostgreSQL (Production): `postgresql+psycopg2://user:password@localhost:5432/idr_nav`
