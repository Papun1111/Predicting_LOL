import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Terminal } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.impact > 0;
    return (
      <div className="bg-[#020813]/95 border border-[#00f2ff]/30 p-4 rounded backdrop-blur-md shadow-2xl font-mono">
        <p className="text-white font-bold mb-2">{data.factor}</p>
        <p className={`text-lg font-black ${isPositive ? 'text-[#00f2ff]' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{data.impact} Impact Score
        </p>
      </div>
    );
  }
  return null;
};

export default function XRayDashboard({ explanations }) {
  if (!explanations || explanations.length === 0) return null;

  return (
    <div className="w-full bg-[#031118]/80 border border-[#00f2ff]/20 p-6 rounded-xl backdrop-blur-md mt-8 shadow-[0_0_30px_rgba(0,242,255,0.05)]">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00f2ff]/10 pb-4">
        <Terminal className="text-[#00f2ff]" />
        <h3 className="text-2xl font-black text-white uppercase tracking-widest">
          SHAP <span className="text-[#00f2ff]">X-Ray Analysis</span>
        </h3>
      </div>
      
      <p className="text-slate-400 text-xs mb-6 font-mono uppercase tracking-wider">
         Real-time XGBoost feature importance. Displaying forces driving win probability.
      </p>

      <div className="h-87.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={explanations}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis type="number" hide domain={['dataMin - 2', 'dataMax + 2']} />
            <YAxis 
              dataKey="factor" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              width={160}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,242,255,0.05)' }} />
            <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={20}>
              {explanations.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.impact > 0 ? '#00f2ff' : '#ef4444'} 
                  style={{ filter: `drop-shadow(0 0 5px ${entry.impact > 0 ? 'rgba(0,242,255,0.4)' : 'rgba(239,68,68,0.4)'})` }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}