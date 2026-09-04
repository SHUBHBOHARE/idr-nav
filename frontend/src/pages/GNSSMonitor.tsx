import React from 'react';
import { GNSSStatus } from '../types/navigation';
import { ShieldAlert, Radio } from 'lucide-react';
import { SensorChart } from '../charts/SensorChart';
import { safeToFixed } from '../utils/formatters';

interface GNSSMonitorProps {
  gnss: GNSSStatus;
  onSimulateOutage: () => void;
  onRestore: () => void;
}

export const GNSSMonitor: React.FC<GNSSMonitorProps> = ({ gnss, onSimulateOutage, onRestore }) => {
  const isOk = Boolean(gnss?.is_available);

  // Accuracy chart history
  const accuracyHistory = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 2}s`,
    accuracy: isOk ? safeToFixed(2.0 + Math.sin(i) * 0.4, 2) : '99.00',
    hdop: isOk ? safeToFixed(1.1 + Math.cos(i) * 0.1, 2) : '9.90'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-lg font-black text-text tracking-tight">GNSS Constellation & Signal Monitor</h2>
          <p className="text-xs text-muted">Inspect satellite geometry, HDOP dilution of precision, and RF signal strength.</p>
        </div>

        {isOk ? (
          <button
            onClick={onSimulateOutage}
            className="bg-danger text-text px-4 py-2 rounded-lg text-xs font-bold hover:bg-danger/90 transition-all flex items-center space-x-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>TRIGGER GNSS OUTAGE</span>
          </button>
        ) : (
          <button
            onClick={onRestore}
            className="bg-success text-surface px-4 py-2 rounded-lg text-xs font-bold hover:bg-success/90 transition-all flex items-center space-x-2"
          >
            <Radio className="w-4 h-4" />
            <span>RESTORE GNSS SIGNAL</span>
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border">
          <span className="text-xs text-muted font-semibold uppercase block mb-1">Satellite Lock Count</span>
          <div className="text-3xl font-black text-primary">{gnss?.satellites ?? 0}</div>
          <span className="text-[11px] text-muted">{isOk ? 'GPS + GLONASS + Galileo' : 'No satellites visible'}</span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border">
          <span className="text-xs text-muted font-semibold uppercase block mb-1">HDOP (Horizontal Dilution)</span>
          <div className={`text-3xl font-black ${isOk ? 'text-success' : 'text-danger'}`}>{gnss?.hdop ?? 9.9}</div>
          <span className="text-[11px] text-muted">{isOk ? 'Ideal Geometry (< 2.0)' : 'Extreme Dilution (> 5.0)'}</span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border">
          <span className="text-xs text-muted font-semibold uppercase block mb-1">Estimated Positional Accuracy</span>
          <div className="text-3xl font-black text-secondary">± {safeToFixed(gnss?.accuracy_m, 1)} m</div>
          <span className="text-[11px] text-muted">95% Confidence Radius</span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border">
          <span className="text-xs text-muted font-semibold uppercase block mb-1">Signal Quality Index</span>
          <div className={`text-3xl font-black ${isOk ? 'text-success' : 'text-danger'}`}>{gnss?.signal_quality || 'NO_SIGNAL'}</div>
          <span className="text-[11px] text-muted">{isOk ? 'SNR: 42 dB-Hz' : 'Signal Lost'}</span>
        </div>
      </div>

      {/* Accuracy Chart */}
      <SensorChart
        data={accuracyHistory}
        title="GNSS Accuracy & HDOP Over Time"
        lines={[
          { key: 'accuracy', color: '#00B8FF', name: 'Accuracy (m)' },
          { key: 'hdop', color: '#F59E0B', name: 'HDOP Index' }
        ]}
      />
    </div>
  );
};
