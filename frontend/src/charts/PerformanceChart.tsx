import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface PerformanceChartProps {
  data: any[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-md">
      <h3 className="text-xs uppercase font-bold tracking-wider text-muted mb-3">Position RMSE Comparison (Meters)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="method" stroke="#94A3B8" fontSize={10} />
            <YAxis stroke="#94A3B8" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#0D1320', borderColor: '#1F2937', color: '#F8FAFC' }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            <Bar dataKey="position_rmse_m" fill="#00B8FF" name="RMSE Error (m)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
