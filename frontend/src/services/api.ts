import axios from 'axios';
import { NavigationState, GNSSStatus, IMULatest, AIModel, SystemLog, PerformanceMetrics, SIHBenchmarkResult } from '../types/navigation';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    return '/api';
  }
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

export const api = {
  getNavigationState: async (): Promise<NavigationState> => {
    const res = await axios.get(`${API_BASE_URL}/navigation/state`);
    return res.data;
  },

  getGNSSStatus: async (): Promise<GNSSStatus> => {
    const res = await axios.get(`${API_BASE_URL}/gnss/status`);
    return res.data;
  },

  getIMULatest: async (): Promise<IMULatest> => {
    const res = await axios.get(`${API_BASE_URL}/imu/latest`);
    return res.data;
  },

  getIMUHistory: async () => {
    const res = await axios.get(`${API_BASE_URL}/imu/history`);
    return res.data;
  },

  simulateGNSSOutage: async () => {
    const res = await axios.post(`${API_BASE_URL}/gnss/simulate-outage`);
    return res.data;
  },

  restoreGNSS: async () => {
    const res = await axios.post(`${API_BASE_URL}/gnss/restore`);
    return res.data;
  },

  startNavigation: async () => {
    const res = await axios.post(`${API_BASE_URL}/navigation/start`);
    return res.data;
  },

  pauseNavigation: async () => {
    const res = await axios.post(`${API_BASE_URL}/navigation/pause`);
    return res.data;
  },

  stopNavigation: async () => {
    const res = await axios.post(`${API_BASE_URL}/navigation/pause`);
    return res.data;
  },

  resetNavigation: async () => {
    const res = await axios.post(`${API_BASE_URL}/navigation/reset`);
    return res.data;
  },

  startSimulation: async () => {
    const res = await axios.post(`${API_BASE_URL}/simulation/start`);
    return res.data;
  },

  stopSimulation: async () => {
    const res = await axios.post(`${API_BASE_URL}/simulation/stop`);
    return res.data;
  },

  getAIModels: async (): Promise<{ models: AIModel[] }> => {
    const res = await axios.get(`${API_BASE_URL}/models`);
    return res.data;
  },

  getPerformanceMetrics: async (): Promise<PerformanceMetrics> => {
    const res = await axios.get(`${API_BASE_URL}/performance`);
    return res.data;
  },

  getSystemLogs: async (): Promise<{ logs: SystemLog[] }> => {
    const res = await axios.get(`${API_BASE_URL}/logs`);
    return res.data;
  },

  getDatasets: async () => {
    const res = await axios.get(`${API_BASE_URL}/datasets`);
    return res.data;
  },

  runSIHDemo: async (): Promise<SIHBenchmarkResult> => {
    try {
      const res = await axios.post(`${API_BASE_URL}/evaluation/run`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const fallbackRes = await axios.post(`${API_BASE_URL}/sih/run-demo`);
        return fallbackRes.data;
      }
      throw err;
    }
  },

  getSIHResults: async (): Promise<SIHBenchmarkResult> => {
    const res = await axios.get(`${API_BASE_URL}/sih/results`);
    return res.data;
  }
};
