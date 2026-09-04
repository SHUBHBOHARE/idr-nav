import React, { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { NavigationState, GNSSStatus, IMULatest, AIModel, SystemLog, PerformanceMetrics } from './types/navigation';
import { api } from './services/api';

import { Dashboard } from './pages/Dashboard';
import { SIHEvaluation } from './pages/SIHEvaluation';
import { LiveNavigation } from './pages/LiveNavigation';
import { GNSSMonitor } from './pages/GNSSMonitor';
import { IMUSensors } from './pages/IMUSensors';
import { Calibration } from './pages/Calibration';
import { DeadReckoning } from './pages/DeadReckoning';
import { SensorFusion } from './pages/SensorFusion';
import { MapMatching } from './pages/MapMatching';
import { AIModels } from './pages/AIModels';
import { DatasetSimulation } from './pages/DatasetSimulation';
import { Performance } from './pages/Performance';
import { SystemLogs } from './pages/SystemLogs';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [state, setState] = useState<NavigationState>({
    mode: 'GNSS + INS',
    gnss_status: 'CONNECTED',
    imu_status: 'ACTIVE (50Hz)',
    ai_status: 'ONLINE (PyTorch ONNX / Random Forest)',
    map_status: 'SNAPPED',
    fusion_status: 'ACTIVE (EKF 8-State)',
    current_lat: 37.7749,
    current_lon: -122.4194,
    speed_km_h: 48.5,
    heading_deg: 54.2,
    position_confidence_m: 1.8,
    drift_m: 0.0,
    drift_percentage: 0.0,
    outage_duration_s: 0.0,
    active_road: 'Market Street',
    trajectories: {
      ground_truth: [{ lat: 37.7749, lon: -122.4194 }],
      gnss: [{ lat: 37.7749, lon: -122.4194 }],
      dead_reckoning: [{ lat: 37.7749, lon: -122.4194 }],
      fused: [{ lat: 37.7749, lon: -122.4194 }],
      map_matched: [{ lat: 37.7749, lon: -122.4194 }]
    }
  });

  const [gnss, setGnss] = useState<GNSSStatus>({
    is_available: true,
    status: 'HEALTHY (Fix: 3D)',
    satellites: 10,
    hdop: 1.1,
    accuracy_m: 2.5,
    lat: 37.7749,
    lon: -122.4194,
    speed_km_h: 48.5,
    signal_quality: 'EXCELLENT'
  });

  const [imu, setImu] = useState<IMULatest>({
    timestamp: Date.now() / 1000,
    accel: [0.12, 0.05, 9.81],
    gyro: [0.01, -0.02, 0.04],
    mag: [24.5, -12.1, 41.8],
    accel_filtered: [0.10, 0.04, 9.80],
    gyro_filtered: [0.00, -0.01, 0.03],
    noise_level: 0.04,
    bias_ax: 0.02,
    bias_ay: -0.01,
    bias_gz: 0.003,
    filter_status: 'Butterworth Low-pass'
  });

  const [imuHistory, setImuHistory] = useState<any[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  const fetchNavigationData = async () => {
    try {
      const navState = await api.getNavigationState();
      setState(navState);
      const gnssState = await api.getGNSSStatus();
      setGnss(gnssState);
    } catch (e) {
      console.warn("Backend poll warning:", e);
    }
  };

  const fetchAuxiliaryData = async () => {
    try {
      const imuLatest = await api.getIMULatest();
      setImu(imuLatest);
      const imuHist = await api.getIMUHistory();
      setImuHistory(imuHist.history || []);
      const modelRes = await api.getAIModels();
      setModels(modelRes.models || []);
      const perfRes = await api.getPerformanceMetrics();
      setMetrics(perfRes);
      const logRes = await api.getSystemLogs();
      setLogs(logRes.logs || []);
    } catch (e) {
      console.warn("Auxiliary data fetch warning:", e);
    }
  };

  useEffect(() => {
    fetchNavigationData();
    fetchAuxiliaryData();
    const interval = setInterval(() => {
      fetchNavigationData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} imuHistory={imuHistory} />;
      case 'live-nav':
        return <LiveNavigation state={state} onRefresh={fetchNavigationData} />;
      case 'gnss':
        return <GNSSMonitor gnss={gnss} onSimulateOutage={() => api.simulateGNSSOutage().then(fetchNavigationData)} onRestore={() => api.restoreGNSS().then(fetchNavigationData)} />;
      case 'imu':
        return <IMUSensors imu={imu} imuHistory={imuHistory} />;
      case 'calibration':
        return <Calibration />;
      case 'dead-reckoning':
        return <DeadReckoning state={state} />;
      case 'sensor-fusion':
        return <SensorFusion state={state} />;
      case 'map-matching':
        return <MapMatching state={state} />;
      case 'ai-models':
        return <AIModels models={models} onRefresh={fetchAuxiliaryData} />;
      case 'dataset':
      case 'simulation':
        return <DatasetSimulation />;
      case 'sih-eval':
        return <SIHEvaluation />;
      case 'performance':
        return <Performance metrics={metrics} />;
      case 'system-logs':
        return <SystemLogs logs={logs} onRefresh={fetchAuxiliaryData} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard state={state} imuHistory={imuHistory} />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab} state={state}>
      {renderContent()}
    </MainLayout>
  );
};

export default App;
