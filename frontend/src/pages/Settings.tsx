import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Moon, Radio, Cpu, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  const [units, setUnits] = useState('metric');
  const [sampleHz, setSampleHz] = useState('50');
  const [mapStyle, setMapStyle] = useState('carto-dark');

  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-xl border border-border">
        <h2 className="text-lg font-black text-text tracking-tight">System & Engine Configuration Settings</h2>
        <p className="text-xs text-muted">Configure sensor sampling frequency, units, map tile sources, and EKF tuning parameters.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 max-w-3xl">
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted flex items-center space-x-2 border-b border-border pb-3">
          <SettingsIcon className="w-4 h-4 text-primary" />
          <span>General System Preferences</span>
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center bg-surface p-3 rounded-lg border border-border">
            <div>
              <span className="font-bold text-text block">UI Theme</span>
              <span className="text-muted text-[11px]">Premium Dark Theme (#070B14)</span>
            </div>
            <span className="bg-primary/20 text-primary border border-primary/40 px-3 py-1 rounded font-bold text-[10px] uppercase">DARK THEME (LOCKED)</span>
          </div>

          <div className="flex justify-between items-center bg-surface p-3 rounded-lg border border-border">
            <div>
              <span className="font-bold text-text block">Measurement Units</span>
              <span className="text-muted text-[11px]">Metric (km/h, m, m/s²) vs Imperial (mph, ft)</span>
            </div>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="bg-card border border-border text-text font-bold p-1.5 rounded outline-none"
            >
              <option value="metric">Metric (km/h, meters)</option>
              <option value="imperial">Imperial (mph, feet)</option>
            </select>
          </div>

          <div className="flex justify-between items-center bg-surface p-3 rounded-lg border border-border">
            <div>
              <span className="font-bold text-text block">IMU Sampling Rate</span>
              <span className="text-muted text-[11px]">Smartphone sensor hardware acquisition frequency</span>
            </div>
            <select
              value={sampleHz}
              onChange={(e) => setSampleHz(e.target.value)}
              className="bg-card border border-border text-text font-bold p-1.5 rounded outline-none font-mono"
            >
              <option value="50">50 Hz (Standard)</option>
              <option value="100">100 Hz (High Precision)</option>
              <option value="20">20 Hz (Power Saving)</option>
            </select>
          </div>

          <div className="flex justify-between items-center bg-surface p-3 rounded-lg border border-border">
            <div>
              <span className="font-bold text-text block">Map Provider & Tiles</span>
              <span className="text-muted text-[11px]">Offline OpenStreetMap / CartoDB Dark Matter</span>
            </div>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="bg-card border border-border text-text font-bold p-1.5 rounded outline-none"
            >
              <option value="carto-dark">CartoDB Dark Matter (Offline Cached)</option>
              <option value="osm-standard">OpenStreetMap Standard</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button
            onClick={() => alert('System settings saved successfully!')}
            className="bg-primary text-surface font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
