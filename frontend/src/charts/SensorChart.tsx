import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface SensorChartProps {
  data: any[];
  title: string;
  lines: { key: string; color: string; name: string }[];
}

export const SensorChart: React.FC<SensorChartProps> = ({ data, title, lines }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-md">
      <h3 className="text-xs uppercase font-bold tracking-wider text-muted mb-3">{title}</h3>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
            <YAxis stroke="#94A3B8" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#0D1320', borderColor: '#1F2937', color: '#F8FAFC' }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                name={line.name}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
