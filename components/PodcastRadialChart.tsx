
import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  Cell
} from 'recharts';
import { PODCAST_DATA } from '../data';
import { MetricType } from '../types';
import { THEMES, ThemeKey } from '../App';

interface PodcastRadialChartProps {
  metric: MetricType;
  isColoredByType: boolean;
  theme: ThemeKey;
  chartKey: number;
}

const CustomRadialTooltip = ({ active, payload, metric }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPlayCount = metric === 'playCount';
    
    return (
      <div className="bg-white/90 border-2 border-zinc-900 p-6 shadow-2xl pointer-events-none ring-1 ring-black ring-opacity-10 backdrop-blur-xl">
        <p className="text-[9px] tracking-[0.3em] text-zinc-400 font-bold mb-2 uppercase font-sans">
          EP. {data.id} — ARCHIVAL NODE
        </p>
        <h3 className="font-serif text-zinc-900 font-bold text-lg leading-tight mb-5 border-b border-zinc-200 pb-3">
          {data.title}
        </h3>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Metric Value:</span>
            <span className="font-mono text-xl font-bold text-zinc-800 tracking-tighter">
              {isPlayCount ? data.playCount : data.commentCount.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-sans text-zinc-400 uppercase tracking-[0.1em] font-medium">
            {isPlayCount ? '10k Playcount units' : 'Total Comments collected'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const PodcastRadialChart: React.FC<PodcastRadialChartProps> = ({ metric, isColoredByType, theme, chartKey }) => {
  const currentThemeData = THEMES[theme];

  // Radial Bar Chart expects data points as individual objects which it stacks.
  // We'll reverse the data so E01 is in the center or outer depending on outerRadius logic.
  const chartData = [...PODCAST_DATA].reverse();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        key={chartKey}
        cx="50%"
        cy="50%"
        innerRadius="20%"
        outerRadius="100%"
        barSize={8}
        data={chartData}
        startAngle={90}
        endAngle={450}
      >
        <defs>
          {/* Defined local gradients for this SVG instance to ensure theme sync */}
          <linearGradient id="radialSoloGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={currentThemeData.solo.start} stopOpacity={1} />
            <stop offset="100%" stopColor={currentThemeData.solo.end} stopOpacity={1} />
          </linearGradient>
          <linearGradient id="radialGuestGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={currentThemeData.guest.start} stopOpacity={1} />
            <stop offset="100%" stopColor={currentThemeData.guest.end} stopOpacity={1} />
          </linearGradient>
          <linearGradient id="radialDefaultGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={currentThemeData.default.start} stopOpacity={1} />
            <stop offset="100%" stopColor={currentThemeData.default.end} stopOpacity={1} />
          </linearGradient>
        </defs>

        <RadialBar
          label={false}
          background={{ fill: '#e2e8f0', opacity: 0.1 }}
          dataKey={metric}
          cornerRadius={4}
          animationBegin={0}
          animationDuration={1500}
          animationEasing="ease-in-out"
        >
          {chartData.map((entry, index) => {
            let fillUrl = 'url(#radialDefaultGradient)';
            if (isColoredByType) {
              fillUrl = entry.type === 'Solo' ? 'url(#radialSoloGradient)' : 'url(#radialGuestGradient)';
            }
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={fillUrl} 
                className="transition-all duration-700 cursor-crosshair hover:opacity-50"
              />
            );
          })}
        </RadialBar>
        
        <Tooltip 
          content={<CustomRadialTooltip metric={metric} />}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default PodcastRadialChart;
