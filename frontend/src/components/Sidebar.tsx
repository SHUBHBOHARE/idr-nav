import React from 'react';
import { 
  LayoutDashboard, 
  Navigation, 
  Satellite, 
  Cpu, 
  Compass, 
  GitMerge, 
  MapPin, 
  BrainCircuit, 
  Database, 
  Play,
  Award,
  BarChart3, 
  Terminal, 
  Settings,
  Sliders
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'live-nav', label: '2. Live Navigation', icon: Navigation },
    { id: 'gnss', label: '3. GNSS Monitor', icon: Satellite },
    { id: 'imu', label: '4. IMU Sensors', icon: Cpu },
    { id: 'calibration', label: '5. Calibration', icon: Sliders, highlight: true },
    { id: 'dead-reckoning', label: '6. Dead Reckoning', icon: Compass },
    { id: 'sensor-fusion', label: '7. Sensor Fusion', icon: GitMerge },
    { id: 'map-matching', label: '8. Map Matching', icon: MapPin },
    { id: 'ai-models', label: '9. AI Models', icon: BrainCircuit },
    { id: 'dataset', label: '10. Dataset', icon: Database },
    { id: 'simulation', label: '11. Simulation', icon: Play },
    { id: 'sih-eval', label: '12. SIH Evaluation', icon: Award, sih: true },
    { id: 'performance', label: '13. Performance', icon: BarChart3 },
    { id: 'system-logs', label: '14. System Logs', icon: Terminal },
    { id: 'settings', label: '15. Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen flex flex-col justify-between p-4 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-4 border-b border-border/60">
          <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/40 text-primary">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-text">IDR NAV</h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary">SIH Architecture</p>
          </div>
        </div>

        {/* Navigation Menu (15 Items) */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30 shadow-md font-semibold'
                    : item.sih
                    ? 'bg-secondary/15 text-secondary border border-secondary/40 font-bold hover:bg-secondary/25'
                    : 'text-muted hover:text-text hover:bg-card/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : item.sih ? 'text-secondary' : 'text-muted'}`} />
                <span>{item.label}</span>
                {item.sih && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping ml-auto" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Mode info */}
      <div className="bg-card/80 p-3 rounded-xl border border-border/80 text-[11px] text-muted">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-text">Engine Build</span>
          <span className="text-primary font-mono text-[10px]">SIH-PROD-v2.5</span>
        </div>
        <div className="flex items-center space-x-1.5 text-success font-medium">
          <span className="w-2 h-2 rounded-full bg-success animate-ping"></span>
          <span>10Hz EKF Active</span>
        </div>
      </div>
    </aside>
  );
};
