import React, { useState } from 'react';
import { SystemLog } from '../types/navigation';
import { Terminal, Filter, RefreshCw } from 'lucide-react';

interface SystemLogsProps {
  logs: SystemLog[];
  onRefresh: () => void;
}

export const SystemLogs: React.FC<SystemLogsProps> = ({ logs, onRefresh }) => {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredLogs = logs.filter(l => filterSeverity === 'ALL' || l.severity === filterSeverity);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-lg font-black text-text tracking-tight">System & Engine Event Stream Logs</h2>
          <p className="text-xs text-muted">Real-time audit log of GNSS outages, AI speed estimation switches, and EKF corrections.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-surface px-2.5 py-1.5 rounded-lg border border-border text-xs">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-text font-bold outline-none cursor-pointer"
            >
              <option value="ALL">ALL SEVERITIES</option>
              <option value="INFO">INFO ONLY</option>
              <option value="WARNING">WARNING ONLY</option>
              <option value="ERROR">ERROR ONLY</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 bg-card rounded-lg border border-border text-muted hover:text-text"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Console Terminal View */}
      <div className="bg-[#050810] border border-border rounded-xl p-4 font-mono text-xs space-y-2 h-[500px] overflow-y-auto shadow-inner">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start space-x-3 hover:bg-card/40 p-1.5 rounded transition-all">
            <span className="text-muted text-[10px] select-none">[{log.timestamp}]</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              log.severity === 'WARNING' ? 'bg-warning/20 text-warning border border-warning/40' :
              log.severity === 'ERROR' ? 'bg-danger/20 text-danger border border-danger/40' :
              'bg-primary/20 text-primary border border-primary/40'
            }`}>
              {log.severity}
            </span>
            <span className="text-secondary font-bold font-mono">[{log.module}]</span>
            <span className="text-text">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
