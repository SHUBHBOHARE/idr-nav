import React, { useState } from 'react';
import { Database, Play, CheckCircle, FileText } from 'lucide-react';
import { api } from '../services/api';

export const DatasetSimulation: React.FC = () => {
  const [scenario, setScenario] = useState('Urban Tunnel Outage');
  const [outageStart, setOutageStart] = useState(60);
  const [outageEnd, setOutageEnd] = useState(120);
  const [simulating, setSimulating] = useState(false);

  const handleRunSimulation = async () => {
    setSimulating(true);
    await api.startSimulation();
    setTimeout(() => {
      setSimulating(false);
      alert(`Simulation completed for scenario '${scenario}'! Outage window: ${outageStart}s - ${outageEnd}s.`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border border-border">
        <h2 className="text-lg font-black text-text tracking-tight">Dataset Management & Route Simulation</h2>
        <p className="text-xs text-muted">Ingest IO-VNBD benchmark sensor datasets and simulate customized GNSS outage intervals.</p>
      </div>

      {/* Dataset List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-text">IO-VNBD Benchmark Dataset</h3>
            </div>
            <span className="bg-success/20 text-success border border-success/40 px-2 py-0.5 rounded text-[10px] uppercase font-bold">LOADED</span>
          </div>
          <p className="text-xs text-muted">Official Indian Vehicle Navigation & Dead-Reckoning Dataset with 50Hz Accel/Gyro/Mag and synchronized RTK ground truth.</p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Records</span>
              <span className="font-bold text-text">1,800</span>
            </div>
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Duration</span>
              <span className="font-bold text-text">180 s</span>
            </div>
            <div className="bg-surface p-2 rounded border border-border">
              <span className="text-[10px] text-muted block">Frequency</span>
              <span className="font-bold text-primary">10 Hz</span>
            </div>
          </div>
        </div>

        {/* Simulation Configurator */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-muted flex items-center space-x-2">
            <Play className="w-4 h-4 text-primary" />
            <span>Configure GNSS Outage Interval</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted block mb-1">Route Scenario</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg p-2 text-text outline-none focus:border-primary"
              >
                <option value="Urban Tunnel Outage">1. Urban Tunnel Outage (60s - 120s)</option>
                <option value="Underground Parking">2. Underground Parking Deck</option>
                <option value="Downtown Urban Canyon">3. High-Rise Urban Canyon</option>
                <option value="Dense Mountain Forest">4. Dense Mountain Forest Canopy</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted block mb-1">GNSS Outage Start (s)</label>
                <input
                  type="number"
                  value={outageStart}
                  onChange={(e) => setOutageStart(Number(e.target.value))}
                  className="w-full bg-surface border border-border rounded-lg p-2 text-text outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-muted block mb-1">GNSS Outage End (s)</label>
                <input
                  type="number"
                  value={outageEnd}
                  onChange={(e) => setOutageEnd(Number(e.target.value))}
                  className="w-full bg-surface border border-border rounded-lg p-2 text-text outline-none font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={simulating}
              className="w-full bg-primary text-surface font-bold p-2.5 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{simulating ? 'RUNNING SIMULATION...' : 'RUN SIMULATION EXPERIMENT'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
