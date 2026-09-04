export interface TrajectoryPoint {
  lat: number;
  lon: number;
  speed?: number;
}

export interface NavigationState {
  mode: string;
  gnss_status: 'CONNECTED' | 'LOST' | 'DEGRADED';
  imu_status: string;
  ai_status: string;
  map_status: string;
  fusion_status: string;
  current_lat: number;
  current_lon: number;
  speed_km_h: number;
  heading_deg: number;
  position_confidence_m: number;
  drift_m: number;
  drift_percentage: number;
  outage_duration_s: number;
  active_road: string;
  trajectories: {
    ground_truth: TrajectoryPoint[];
    gnss: TrajectoryPoint[];
    dead_reckoning: TrajectoryPoint[];
    ai_dead_reckoning?: TrajectoryPoint[];
    fused: TrajectoryPoint[];
    map_matched: TrajectoryPoint[];
  };
}

export interface GNSSStatus {
  is_available: boolean;
  status: string;
  satellites: number;
  hdop: number;
  accuracy_m: number;
  lat: number;
  lon: number;
  speed_km_h: number;
  signal_quality: string;
}

export interface IMULatest {
  timestamp: number;
  accel: number[];
  gyro: number[];
  mag: number[];
  accel_filtered: number[];
  gyro_filtered: number[];
  noise_level: number;
  bias_ax: number;
  bias_ay: number;
  bias_gz: number;
  filter_status: string;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  framework: string;
  input_features: string[];
  output: string;
  accuracy_mae: number;
  inference_latency_ms: number;
  model_size_mb: number;
  status: string;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  module: string;
  message: string;
}

export interface PerformanceMetrics {
  dead_reckoning: {
    position_rmse_m: number;
    max_error_m: number;
    drift_percentage: number;
    distance_travelled_m: number;
    gnss_outage_duration_s: number;
  };
  gnss_ins_fusion: {
    position_rmse_m: number;
    velocity_rmse_m_s: number;
    update_rate_hz: number;
    recovery_time_s: number;
    processing_latency_ms: number;
  };
  ai_model: {
    mae_m_s: number;
    rmse_m_s: number;
    r2_score: number;
    inference_latency_ms: number;
  };
  comparisons: Array<{
    method: string;
    position_rmse_m: number;
    drift_percent: number;
    status: string;
  }>;
}

export interface SIHBenchmarkResult {
  status?: string;
  message?: string;
  status_banner?: string;
  data_origin?: string;
  dataset_status?: string;
  data_tag?: string;
  is_real_dataset?: boolean;
  total_imu_samples?: number;
  duration_s?: number;
  outage_interval_s?: string;
  distance_travelled_m?: number;
  navigation_update_hz?: string;
  scenario?: {
    outage_duration_sec?: number;
    distance_m?: number;
    vehicle_speed_kmh?: number;
  };
  methods?: Record<string, any>;
  eval_metrics?: Record<string, {
    method: string;
    position_rmse_m: number;
    mean_position_error_m: number;
    max_position_error_m: number;
    drift_percentage: number;
    velocity_rmse_m_s: number;
    heading_error_deg: number;
    gnss_outage_duration_s: number;
    inference_latency_ms: number;
  }>;
  metrics?: any;
  trajectory?: {
    ground_truth?: TrajectoryPoint[];
    gnss?: TrajectoryPoint[];
    raw_imu_dr?: TrajectoryPoint[];
    ai_dr?: TrajectoryPoint[];
    ai_ekf?: TrajectoryPoint[];
    map_matched?: TrajectoryPoint[];
    dead_reckoning?: TrajectoryPoint[];
    fused?: TrajectoryPoint[];
  };
}
