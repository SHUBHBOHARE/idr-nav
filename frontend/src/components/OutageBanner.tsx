import React from 'react';
import { AlertCircle } from 'lucide-react';
import { safeToFixed } from '../utils/formatters';

interface OutageBannerProps {
  outageActive: boolean;
  outageDuration: number;
  driftM: number;
}

export const OutageBanner: React.FC<OutageBannerProps> = ({ outageActive, outageDuration, driftM }) => {
  if (!outageActive) return null;

  return (
    <div className="bg-gradient-to-r from-danger/20 via-warning/20 to-danger/20 border border-danger/50 p-4 rounded-xl flex items-center justify-between shadow-xl mb-6">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-7 h-7 text-danger animate-bounce" />
        <div>
          <h4 className="text-base font-bold text-danger">GNSS OUTAGE IN PROGRESS — TUNNEL / URBAN CANYON</h4>
          <p className="text-xs text-muted">AI Dead Reckoning actively integrating IMU telemetry & NHC constraints to maintain vehicle trajectory.</p>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-sm">
        <div className="bg-card/80 px-3 py-1.5 rounded-lg border border-border">
          <span className="text-muted text-xs block">Outage Duration</span>
          <span className="font-bold text-warning">{safeToFixed(outageDuration, 1)}s</span>
        </div>
        <div className="bg-card/80 px-3 py-1.5 rounded-lg border border-border">
          <span className="text-muted text-xs block">Est. Cumulative Drift</span>
          <span className="font-bold text-danger">{safeToFixed(driftM, 2)} m</span>
        </div>
      </div>
    </div>
  );
};
