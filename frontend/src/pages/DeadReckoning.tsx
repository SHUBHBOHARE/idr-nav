import React from 'react';
import { NavigationState } from '../types/navigation';
import { Compass, ArrowRight } from 'lucide-react';
import { VehicleMap } from '../maps/VehicleMap';
import { safeToFixed } from '../utils/formatters';

interface DeadReckoningProps {
  state: NavigationState;
}

export const DeadReckoning: React.FC<DeadReckoningProps> = ({ state }) => {
  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border border-border">
        <h2 className="text-lg font-black text-text tracking-tight">AI Dead Reckoning Engine & Drift Analysis</h2>
        <p className="text-xs text-muted">Strapdown inertial kinematic integration powered by AI speed estimation when GNSS is lost.</p>
      </div>

      {/* Dead Reckoning Equation Banner */}
      <div className="bg-surface border border-primary/30 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/20 p-3 rounded-lg text-primary border border-primary/40">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] text-muted uppercase font-bold tracking-widest block">Kinematic Integration Equation</span>
            <div className="text-sm font-mono font-bold text-primary">
              Position<sub>k+1</sub> = Position<sub>k</sub> + V<sub>AI</sub> · [cos(ψ), sin(ψ)]<sup>T</sup> · Δt
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="bg-card px-3 py-1.5 rounded border border-border">
            <span className="text-muted block text-[10px]">Last Reliable GNSS Fix</span>
            <span className="font-bold text-success">37.774900, -122.419400</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted" />
          <div className="bg-card px-3 py-1.5 rounded border border-border">
            <span className="text-muted block text-[10px]">Current DR Coordinate</span>
            <span className="font-bold text-warning">{safeToFixed(state?.current_lat, 6)}, {safeToFixed(state?.current_lon, 6)}</span>
          </div>
        </div>
      </div>

      {/* Drift Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border">
          <span className="text-xs text-muted uppercase font-bold block mb-1">Cumulative Outage Distance</span>
          <div className="text-3xl font-black text-primary">482.5 m</div>
          <span className="text-[11px] text-muted">Distance travelled without GNSS</span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border">
          <span className="text-xs text-muted uppercase font-bold block mb-1">Positional Drift Error</span>
          <div className="text-3xl font-black text-danger">{safeToFixed(state?.drift_m, 2)} m</div>
          <span className="text-[11px] text-muted">Euclidean error relative to ground truth</span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border">
          <span className="text-xs text-muted uppercase font-bold block mb-1">Drift Rate Percentage</span>
          <div className="text-3xl font-black text-warning">{safeToFixed(state?.drift_percentage, 2)} %</div>
          <span className="text-[11px] text-muted">1.25m drift per 100m travelled</span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border">
          <span className="text-xs text-muted uppercase font-bold block mb-1">Outage Elapsed Duration</span>
          <div className="text-3xl font-black text-secondary">{safeToFixed(state?.outage_duration_s, 1)} s</div>
          <span className="text-[11px] text-muted">Continuous Dead Reckoning window</span>
        </div>
      </div>

      {/* Trajectory Comparison Map */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted mb-3">Trajectory Comparison: Ground Truth vs Raw IMU vs AI Dead Reckoning vs Map Matched</h3>
        <VehicleMap
          currentLat={state?.current_lat ?? 37.7749}
          currentLon={state?.current_lon ?? -122.4194}
          trajectories={state?.trajectories || {}}
        />
      </div>
    </div>
  );
};
