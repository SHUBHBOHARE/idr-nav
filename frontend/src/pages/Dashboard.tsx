import React from 'react';
import { NavigationState } from '../types/navigation';
import { ModeBadge } from '../components/ModeBadge';
import { OutageBanner } from '../components/OutageBanner';
import { TelemetryCard } from '../components/TelemetryCard';
import { VehicleMap } from '../maps/VehicleMap';
import { SensorChart } from '../charts/SensorChart';
import { Gauge, Navigation, Compass, AlertOctagon, Activity, Radio, Cpu, CheckCircle } from 'lucide-react';

interface DashboardProps {
  state: NavigationState;
  imuHistory: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ state, imuHistory }) => {
  const isOutage = state.gnss_status === 'LOST';

  return (
    <div className="space-y-6">
      {/* Top Banner if Outage */}
      <OutageBanner
        outageActive={isOutage}
        outageDuration={state.outage_duration_s}
        driftM={state.drift_m}
      />

      {/* A. & B. Current Navigation Mode & System Status */}
      <ModeBadge mode={state.mode} gnssStatus={state.gnss_status} />

      {/* System Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-card p-3 rounded-xl border border-border flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-success" />
          <div>
            <span className="text-[10px] text-muted uppercase font-bold block">Overall Health</span>
            <span className="text-xs font-bold text-success">OPTIMAL</span>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border flex items-center space-x-3">
          <Radio className={`w-5 h-5 ${isOutage ? 'text-danger' : 'text-success'}`} />
          <div>
            <span className="text-[10px] text-muted uppercase font-bold block">GNSS Fix</span>
            <span className={`text-xs font-bold ${isOutage ? 'text-danger' : 'text-success'}`}>
              {isOutage ? 'LOST' : '3D FIX'}
            </span>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-primary" />
          <div>
            <span className="text-[10px] text-muted uppercase font-bold block">IMU Stream</span>
            <span className="text-xs font-bold text-text">ACTIVE (50Hz)</span>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border flex items-center space-x-3">
          <Activity className="w-5 h-5 text-secondary" />
          <div>
            <span className="text-[10px] text-muted uppercase font-bold block">AI Speed Engine</span>
            <span className="text-xs font-bold text-secondary">ONLINE</span>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border flex items-center space-x-3">
          <Navigation className="w-5 h-5 text-primary" />
          <div>
            <span className="text-[10px] text-muted uppercase font-bold block">Map Engine</span>
            <span className="text-xs font-bold text-text">SNAPPED</span>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border flex items-center space-x-3">
          <Activity className="w-5 h-5 text-success" />
          <div>
            <span className="text-[10px] text-muted uppercase font-bold block">EKF Fusion</span>
            <span className="text-xs font-bold text-success">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* D. Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TelemetryCard
          title="Vehicle Speed"
          value={state.speed_km_h.toFixed(1)}
          unit="km/h"
          icon={Gauge}
          subtext="AI Estimated Velocity"
          color="primary"
        />
        <TelemetryCard
          title="Heading Angle"
          value={state.heading_deg.toFixed(1)}
          unit="deg"
          icon={Compass}
          subtext="Integrated Yaw Rate"
          color="secondary"
        />
        <TelemetryCard
          title="Cumulative Drift"
          value={state.drift_m.toFixed(2)}
          unit="m"
          icon={AlertOctagon}
          subtext={`Drift Rate: ${state.drift_percentage.toFixed(2)}%`}
          color={isOutage ? 'danger' : 'success'}
        />
        <TelemetryCard
          title="Position Accuracy"
          value={`±${state.position_confidence_m.toFixed(1)}`}
          unit="m"
          icon={Navigation}
          subtext="EKF Covariance Bound"
          color="warning"
        />
      </div>

      {/* C. Live Vehicle Map & G. Drift Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehicleMap
            currentLat={state.current_lat}
            currentLon={state.current_lon}
            trajectories={state.trajectories}
          />
        </div>

        {/* AI & Outage Timeline Monitor Card */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-muted mb-4">H. GNSS Outage Timeline State</h3>
            <div className="space-y-3 relative pl-4 border-l-2 border-border">
              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-success absolute -left-[21px] top-1"></span>
                <span className="text-xs font-bold text-text">GNSS AVAILABLE</span>
                <p className="text-[11px] text-muted">Normal 3D position satellite lock</p>
              </div>

              <div className="relative">
                <span className={`w-2.5 h-2.5 rounded-full ${isOutage ? 'bg-danger animate-ping' : 'bg-border'} absolute -left-[21px] top-1`}></span>
                <span className={`text-xs font-bold ${isOutage ? 'text-danger' : 'text-muted'}`}>GNSS LOST / OUTAGE</span>
                <p className="text-[11px] text-muted">Tunnel entry or urban canyon blockage</p>
              </div>

              <div className="relative">
                <span className={`w-2.5 h-2.5 rounded-full ${isOutage ? 'bg-warning animate-bounce' : 'bg-border'} absolute -left-[21px] top-1`}></span>
                <span className={`text-xs font-bold ${isOutage ? 'text-warning' : 'text-muted'}`}>AI DEAD RECKONING</span>
                <p className="text-[11px] text-muted">IMU + NHC + AI Speed Estimation active</p>
              </div>

              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-primary absolute -left-[21px] top-1"></span>
                <span className="text-xs font-bold text-primary">GNSS RECOVERED & EKF FUSED</span>
                <p className="text-[11px] text-muted">Smooth drift correction & covariance update</p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-3 rounded-lg border border-border/80">
            <span className="text-[11px] text-muted block uppercase font-bold mb-1">F. AI Model Inference Status</span>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Speed Estimator Latency:</span>
              <span className="font-mono text-primary font-bold">1.4 ms</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted">Inference Model:</span>
              <span className="font-mono text-secondary font-bold">ONNX Runtime</span>
            </div>
          </div>
        </div>
      </div>

      {/* E. Real-Time Sensor Graph */}
      <SensorChart
        data={imuHistory}
        title="Real-Time Accelerometer Telemetry (m/s²)"
        lines={[
          { key: 'ax', color: '#00B8FF', name: 'Ax (Forward)' },
          { key: 'ay', color: '#7C3AED', name: 'Ay (Lateral)' },
          { key: 'az', color: '#22C55E', name: 'Az (Vertical)' }
        ]}
      />
    </div>
  );
};
