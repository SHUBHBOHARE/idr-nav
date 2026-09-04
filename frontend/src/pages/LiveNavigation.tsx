import React from 'react';
import { NavigationState } from '../types/navigation';
import { ModeBadge } from '../components/ModeBadge';
import { OutageBanner } from '../components/OutageBanner';
import { VehicleMap } from '../maps/VehicleMap';
import { Play, Pause, Square, RotateCcw, AlertTriangle, ShieldCheck, Gauge, Compass } from 'lucide-react';
import { api } from '../services/api';
import { safeToFixed } from '../utils/formatters';

interface LiveNavigationProps {
  state: NavigationState;
  onRefresh: () => void;
}

export const LiveNavigation: React.FC<LiveNavigationProps> = ({ state, onRefresh }) => {
  const isOutage = state.gnss_status === 'LOST';
  const [isRunning, setIsRunning] = React.useState(state.mode !== 'NOT_STARTED');
  const [notification, setNotification] = React.useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStart = async () => {
    try {
      await api.startNavigation();
      setIsRunning(true);
      showNotification('Simulation started. Telemetry actively streaming.');
      onRefresh();
    } catch (e: any) {
      showNotification('API Error starting simulation: ' + (e.message || e));
    }
  };

  const handlePause = async () => {
    try {
      await api.pauseNavigation();
      showNotification('Simulation paused. State preserved.');
      onRefresh();
    } catch (e: any) {
      showNotification('API Error pausing simulation: ' + (e.message || e));
    }
  };

  const handleReset = async () => {
    try {
      await api.resetNavigation();
      setIsRunning(false);
      showNotification('System reset to initial coordinates.');
      onRefresh();
    } catch (e: any) {
      showNotification('API Error resetting simulation: ' + (e.message || e));
    }
  };

  const handleSimulateOutage = async () => {
    try {
      await api.simulateGNSSOutage();
      showNotification('GNSS Outage triggered! Switched automatically to AI Dead Reckoning.');
      onRefresh();
    } catch (e: any) {
      showNotification('API Error simulating outage: ' + (e.message || e));
    }
  };

  const handleRestoreGNSS = async () => {
    try {
      await api.restoreGNSS();
      showNotification('GNSS Signal restored! EKF sensor fusion drift correction applied.');
      onRefresh();
    } catch (e: any) {
      showNotification('API Error restoring GNSS: ' + (e.message || e));
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-primary/20 border border-primary/50 text-primary px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-primary hover:text-text font-black">✕</button>
        </div>
      )}

      <OutageBanner
        outageActive={isOutage}
        outageDuration={state.outage_duration_s}
        driftM={state.drift_m}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-lg font-black tracking-tight text-text">Live Vehicle Navigation Console</h2>
          <p className="text-xs text-muted">Real-time smartphone telemetry streaming and GNSS outage injection controller.</p>
        </div>

        {/* Interactive Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleStart}
            className="flex items-center space-x-1.5 bg-success/20 hover:bg-success/30 text-success border border-success/40 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START</span>
          </button>

          <button
            onClick={handlePause}
            className="flex items-center space-x-1.5 bg-warning/20 hover:bg-warning/30 text-warning border border-warning/40 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>PAUSE</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 bg-card hover:bg-surface text-muted hover:text-text border border-border px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>

          <div className="h-6 w-px bg-border mx-1"></div>

          {/* GNSS Simulation Controls */}
          {isOutage ? (
            <button
              onClick={handleRestoreGNSS}
              disabled={!isRunning}
              className="flex items-center space-x-2 bg-success text-surface hover:bg-success/90 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-xs font-black tracking-wider transition-all shadow-lg shadow-success/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>RESTORE GNSS SIGNAL</span>
            </button>
          ) : (
            <button
              onClick={handleSimulateOutage}
              disabled={!isRunning}
              className="flex items-center space-x-2 bg-danger text-text hover:bg-danger/90 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-xs font-black tracking-wider transition-all shadow-lg shadow-danger/20"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SIMULATE GNSS OUTAGE</span>
            </button>
          )}
        </div>
      </div>

      <ModeBadge mode={state.mode} gnssStatus={state.gnss_status} />

      {/* Map & Live Telemetry Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <VehicleMap
            currentLat={state.current_lat}
            currentLon={state.current_lon}
            trajectories={state.trajectories}
          />
        </div>

        {/* Live Telemetry Side Panel */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-muted border-b border-border pb-2">Vehicle Telemetry</h3>
          
          <div>
            <span className="text-xs text-muted block">Speed</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-black text-primary">{safeToFixed(state?.speed_km_h, 1)}</span>
              <span className="text-xs text-muted uppercase">km/h</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-muted block">Heading Angle</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-secondary">{safeToFixed(state?.heading_deg, 1)}</span>
              <span className="text-xs text-muted">deg (NE)</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-muted block">Active Road Segment</span>
            <span className="text-sm font-bold text-text bg-surface px-2.5 py-1 rounded border border-border block mt-1">
              {state?.active_road || 'Market Street'}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted block">Position Confidence</span>
            <span className="text-sm font-bold text-success">± {safeToFixed(state?.position_confidence_m, 1)} m</span>
          </div>

          <div className="pt-2 border-t border-border">
            <span className="text-[11px] text-muted block">Cumulative Dead Reckoning Drift</span>
            <span className={`text-lg font-black ${isOutage ? 'text-danger' : 'text-text'}`}>
              {safeToFixed(state?.drift_m, 2)} m ({safeToFixed(state?.drift_percentage, 2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
