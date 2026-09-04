import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TelemetryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  subtext,
  color = 'primary'
}) => {
  const colorStyles = {
    primary: 'border-primary/20 text-primary bg-primary/10',
    secondary: 'border-secondary/20 text-secondary bg-secondary/10',
    success: 'border-success/20 text-success bg-success/10',
    warning: 'border-warning/20 text-warning bg-warning/10',
    danger: 'border-danger/20 text-danger bg-danger/10',
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-md hover:border-primary/40 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider font-semibold text-muted">{title}</span>
        <div className={`p-2 rounded-lg border ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-black text-text tracking-tight">{value}</span>
        {unit && <span className="text-xs font-semibold text-muted uppercase">{unit}</span>}
      </div>

      {subtext && <p className="text-[11px] text-muted mt-1">{subtext}</p>}
    </div>
  );
};
