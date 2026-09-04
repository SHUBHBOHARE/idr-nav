import React from 'react';
import { NavigationState } from '../types/navigation';
import { GitMerge, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface SensorFusionProps {
  state: NavigationState;
}

export const SensorFusion: React.FC<SensorFusionProps> = ({ state }) => {
  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border border-border">
        <h2 className="text-lg font-black text-text tracking-tight">Extended Kalman Filter (EKF) Sensor Fusion</h2>
        <p className="text-xs text-muted">Optimal 8-State Kalman Filter coupling GNSS position fixes with high-frequency IMU strapdown prediction.</p>
      </div>

      {/* State Diagram Card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted">EKF State Diagram & Dataflow Pipeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center text-xs font-mono">
          <div className="bg-surface p-4 rounded-xl border border-primary/40 space-y-1">
            <span className="text-primary font-bold block">GNSS Fix</span>
            <span className="text-[10px] text-muted block">Lat/Lon/Alt (1Hz)</span>
          </div>

          <div className="text-muted font-bold text-lg">+</div>

          <div className="bg-surface p-4 rounded-xl border border-secondary/40 space-y-1">
            <span className="text-secondary font-bold block">IMU Sensors</span>
            <span className="text-[10px] text-muted block">Accel & Gyro (50Hz)</span>
          </div>

          <div className="text-muted font-bold text-lg">+</div>

          <div className="bg-surface p-4 rounded-xl border border-success/40 space-y-1">
            <span className="text-success font-bold block">AI Speed Model</span>
            <span className="text-[10px] text-muted block">Estimated Vel (10Hz)</span>
          </div>
        </div>

        <div className="flex justify-center my-2">
          <div className="text-primary font-bold text-xl">↓</div>
        </div>

        <div className="bg-primary/10 border border-primary/40 p-4 rounded-xl text-center">
          <span className="text-xs uppercase tracking-wider text-primary font-extrabold block">EKF 8-STATE VECTOR x_k</span>
          <div className="text-sm font-mono font-bold text-text mt-1">
            [ p_N, p_E, v_N, v_E, ψ, b_ax, b_ay, b_gz ]<sup>T</sup>
          </div>
          <p className="text-[11px] text-muted mt-1">North/East Position, North/East Velocity, Yaw Heading, Accel Biases & Gyro Drift Bias</p>
        </div>
      </div>

      {/* Covariance & States Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-muted border-b border-border pb-2">Prediction Step (IMU Integration)</h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between bg-surface p-2.5 rounded border border-border">
              <span className="text-muted">Covariance Trace Spreading (P_k):</span>
              <span className="font-mono text-warning font-bold">0.048 m²</span>
            </div>
            <div className="flex justify-between bg-surface p-2.5 rounded border border-border">
              <span className="text-muted">Process Noise Matrix (Q_k):</span>
              <span className="font-mono text-primary font-bold">Diagonal Adaptive</span>
            </div>
            <div className="flex justify-between bg-surface p-2.5 rounded border border-border">
              <span className="text-muted">Zero-Velocity Update (ZUPT):</span>
              <span className="font-mono text-success font-bold">ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-muted border-b border-border pb-2">Correction Step (Measurement Update)</h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between bg-surface p-2.5 rounded border border-border">
              <span className="text-muted">Kalman Gain K_k Matrix:</span>
              <span className="font-mono text-primary font-bold">Optimal Weighted</span>
            </div>
            <div className="flex justify-between bg-surface p-2.5 rounded border border-border">
              <span className="text-muted">Innovation Residual y_k:</span>
              <span className="font-mono text-success font-bold">0.12 m</span>
            </div>
            <div className="flex justify-between bg-surface p-2.5 rounded border border-border">
              <span className="text-muted">GNSS Measurement Noise (R_k):</span>
              <span className="font-mono text-text font-bold">2.5 m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
