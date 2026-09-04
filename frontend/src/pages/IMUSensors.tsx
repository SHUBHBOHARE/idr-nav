import React, { useState } from 'react';
import { IMULatest } from '../types/navigation';
import { SensorChart } from '../charts/SensorChart';
import { Cpu, Filter, Sliders } from 'lucide-react';

interface IMUSensorsProps {
  imu: IMULatest;
  imuHistory: any[];
}

export const IMUSensors: React.FC<IMUSensorsProps> = ({ imu, imuHistory }) => {
  const [isFiltered, setIsFiltered] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-lg font-black text-text tracking-tight">IMU Sensor Telemetry & Processing</h2>
          <p className="text-xs text-muted">High-frequency 50Hz Smartphone Accelerometer, Gyroscope & Magnetometer stream.</p>
        </div>

        <div className="flex items-center space-x-3 bg-surface p-1.5 rounded-lg border border-border">
          <span className="text-xs text-muted px-2 font-semibold">Signal Filter:</span>
          <button
            onClick={() => setIsFiltered(false)}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${!isFiltered ? 'bg-primary text-surface' : 'text-muted hover:text-text'}`}
          >
            RAW
          </button>
          <button
            onClick={() => setIsFiltered(true)}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${isFiltered ? 'bg-primary text-surface' : 'text-muted hover:text-text'}`}
          >
            FILTERED (5Hz Low-Pass)
          </button>
        </div>
      </div>

      {/* Sensor Stream Numerical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Accelerometer Card */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold uppercase text-primary">3-Axis Accelerometer (m/s²)</span>
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Ax</span>
              <span className="text-base font-mono font-bold text-text">{imu.accel[0].toFixed(2)}</span>
            </div>
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Ay</span>
              <span className="text-base font-mono font-bold text-text">{imu.accel[1].toFixed(2)}</span>
            </div>
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Az</span>
              <span className="text-base font-mono font-bold text-text">{imu.accel[2].toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Gyroscope Card */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold uppercase text-secondary">3-Axis Gyroscope (rad/s)</span>
            <Sliders className="w-4 h-4 text-secondary" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Gx</span>
              <span className="text-base font-mono font-bold text-text">{imu.gyro[0].toFixed(3)}</span>
            </div>
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Gy</span>
              <span className="text-base font-mono font-bold text-text">{imu.gyro[1].toFixed(3)}</span>
            </div>
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Gz (Yaw)</span>
              <span className="text-base font-mono font-bold text-secondary">{imu.gyro[2].toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Magnetometer Card */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold uppercase text-success">3-Axis Magnetometer (μT)</span>
            <Filter className="w-4 h-4 text-success" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Mx</span>
              <span className="text-base font-mono font-bold text-text">{imu.mag[0].toFixed(1)}</span>
            </div>
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">My</span>
              <span className="text-base font-mono font-bold text-text">{imu.mag[1].toFixed(1)}</span>
            </div>
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Mz</span>
              <span className="text-base font-mono font-bold text-text">{imu.mag[2].toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorChart
          data={imuHistory}
          title="Accelerometer X / Y / Z Waves"
          lines={[
            { key: 'ax', color: '#00B8FF', name: 'Ax (Forward)' },
            { key: 'ay', color: '#7C3AED', name: 'Ay (Lateral)' },
            { key: 'az', color: '#22C55E', name: 'Az (Vertical)' }
          ]}
        />

        <SensorChart
          data={imuHistory}
          title="Gyroscope Yaw Rate Gz Waves (rad/s)"
          lines={[
            { key: 'gz', color: '#F59E0B', name: 'Gz Yaw Rate' },
            { key: 'gx', color: '#EF4444', name: 'Gx Roll Rate' }
          ]}
        />
      </div>
    </div>
  );
};
