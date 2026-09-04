import React from 'react';
import { Satellite, Cpu, Brain, Activity, User, Bell } from 'lucide-react';
import { NavigationState } from '../types/navigation';

interface TopBarProps {
  state: NavigationState;
}

export const TopBar: React.FC<TopBarProps> = ({ state }) => {
  const isGnssOk = state.gnss_status === 'CONNECTED';

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-border h-16 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text">Navigation Command Center</h2>
        <span className="bg-card px-2.5 py-1 rounded-md text-[11px] font-mono text-muted border border-border">
          {state.active_road}
        </span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Status Indicators */}
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 bg-card px-2.5 py-1 rounded-lg border border-border">
            <Satellite className={`w-3.5 h-3.5 ${isGnssOk ? 'text-success' : 'text-danger animate-pulse'}`} />
            <span className="text-muted">GNSS:</span>
            <span className={isGnssOk ? 'text-success' : 'text-danger'}>{state.gnss_status}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-card px-2.5 py-1 rounded-lg border border-border">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted">IMU:</span>
            <span className="text-text">50Hz</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-card px-2.5 py-1 rounded-lg border border-border">
            <Brain className="w-3.5 h-3.5 text-secondary" />
            <span className="text-muted">AI Speed:</span>
            <span className="text-secondary">ONLINE</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-card px-2.5 py-1 rounded-lg border border-border">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted">EKF:</span>
            <span className="text-primary">FUSED</span>
          </div>
        </div>

        {/* Notifications & User Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          <button className="p-2 bg-card rounded-lg border border-border text-muted hover:text-text relative">
            <Bell className="w-4 h-4" />
            {state.gnss_status === 'LOST' && (
              <span className="w-2 h-2 rounded-full bg-danger absolute top-1 right-1 animate-ping" />
            )}
          </button>

          <div className="flex items-center space-x-2.5 bg-card px-3 py-1.5 rounded-lg border border-border">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 text-primary font-bold text-xs">
              NA
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block text-text">Nav Architect</span>
              <span className="text-[10px] text-muted block">Lead Engineer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
