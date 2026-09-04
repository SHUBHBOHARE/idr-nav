import React from 'react';
import { Radio, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface ModeBadgeProps {
  mode: string;
  gnssStatus: 'CONNECTED' | 'LOST' | 'DEGRADED';
}

export const ModeBadge: React.FC<ModeBadgeProps> = ({ mode, gnssStatus }) => {
  const isLost = gnssStatus === 'LOST' || mode.includes('DEAD RECKONING');

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition-all duration-300 ${
      isLost 
        ? 'bg-danger/10 border-danger/40 text-danger animate-pulse' 
        : 'bg-primary/10 border-primary/40 text-primary'
    }`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${isLost ? 'bg-danger/20' : 'bg-primary/20'}`}>
          {isLost ? <AlertTriangle className="w-8 h-8 text-danger" /> : <ShieldCheck className="w-8 h-8 text-primary" />}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted font-semibold">Current Navigation Mode</div>
          <div className="text-2xl font-black tracking-tight">{mode}</div>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-right">
        <div>
          <div className="text-xs text-muted uppercase font-medium">GNSS Signal</div>
          <div className={`text-sm font-bold flex items-center justify-end space-x-1.5 ${isLost ? 'text-danger' : 'text-success'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isLost ? 'bg-danger animate-ping' : 'bg-success'}`} />
            <span>{isLost ? 'SIGNAL LOST' : 'CONNECTED'}</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-muted uppercase font-medium">Fusion Status</div>
          <div className="text-sm font-bold text-primary flex items-center space-x-1">
            <Activity className="w-4 h-4 text-primary" />
            <span>EKF 8-STATE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
