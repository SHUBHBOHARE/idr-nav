import React from 'react';
import { NavigationState } from '../types/navigation';
import { MapPin, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface MapMatchingProps {
  state: NavigationState;
}

export const MapMatching: React.FC<MapMatchingProps> = ({ state }) => {
  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border border-border">
        <h2 className="text-lg font-black text-text tracking-tight">HMM Map Matching & Non-Holonomic Constraints (NHC)</h2>
        <p className="text-xs text-muted">Snaps estimated trajectories onto OpenStreetMap road network and enforces zero lateral velocity constraints.</p>
      </div>

      {/* Non-Holonomic Constraint Math Banner */}
      <div className="bg-surface border border-secondary/40 p-5 rounded-xl space-y-3">
        <div className="flex items-center space-x-3 text-secondary font-bold text-sm">
          <Zap className="w-5 h-5" />
          <span>Non-Holonomic Constraints (NHC) Principle</span>
        </div>
        <p className="text-xs text-muted">
          A standard ground vehicle cannot move sideways or jump vertically. Therefore, lateral velocity <code className="text-primary font-mono">v_y ≈ 0</code> and vertical velocity <code className="text-primary font-mono">v_z ≈ 0</code> in body frame.
          This constrains lateral drift integration during GNSS outages.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
          <div className="bg-card p-3 rounded border border-border">
            <span className="text-muted text-[10px] block">Lateral Velocity Constraint Equation</span>
            <span className="text-primary font-bold">v_lateral = -v_N · sin(ψ) + v_E · cos(ψ) → 0.0 m/s</span>
          </div>

          <div className="bg-card p-3 rounded border border-border">
            <span className="text-muted text-[10px] block">Vertical Velocity Constraint Equation</span>
            <span className="text-primary font-bold">v_vertical = v_Up → 0.0 m/s</span>
          </div>
        </div>
      </div>

      {/* Candidate Roads Scoring Table */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted">Candidate Road Projection & Scoring</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface text-muted uppercase text-[10px] border-b border-border">
              <tr>
                <th className="p-3">Road ID</th>
                <th className="p-3">Segment Name</th>
                <th className="p-3">Road Heading</th>
                <th className="p-3">Distance to Road</th>
                <th className="p-3">Match Score</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="bg-primary/10 font-semibold text-text">
                <td className="p-3 font-mono text-primary">R1</td>
                <td className="p-3 font-bold text-primary">Market Street</td>
                <td className="p-3">52.0°</td>
                <td className="p-3">2.4 m</td>
                <td className="p-3 font-mono text-success">98.2 (Best)</td>
                <td className="p-3"><span className="bg-success/20 text-success border border-success/40 px-2 py-0.5 rounded text-[10px] uppercase font-bold">SNAPPED</span></td>
              </tr>
              <tr className="text-muted">
                <td className="p-3 font-mono">R3</td>
                <td className="p-3">Mission Street</td>
                <td className="p-3">53.0°</td>
                <td className="p-3">45.8 m</td>
                <td className="p-3 font-mono">54.1</td>
                <td className="p-3"><span className="bg-card text-muted border border-border px-2 py-0.5 rounded text-[10px] uppercase">Candidate</span></td>
              </tr>
              <tr className="text-muted">
                <td className="p-3 font-mono">R4</td>
                <td className="p-3">5th Street</td>
                <td className="p-3">48.0°</td>
                <td className="p-3">120.2 m</td>
                <td className="p-3 font-mono">18.4</td>
                <td className="p-3"><span className="bg-card text-muted border border-border px-2 py-0.5 rounded text-[10px] uppercase">Rejected</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
