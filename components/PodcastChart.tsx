import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { PODCAST_DATA } from '../data';
import { MetricType } from '../types';
import CustomBar from './CustomBar';
import { THEMES, ThemeKey, SortOrder, AnimationMode } from '../App';

interface PodcastChartProps {
  metric: MetricType;
  isColoredByType: boolean;
  chartKey: number;
  theme: ThemeKey;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  animationType: AnimationMode;
  setAnimationType: (mode: AnimationMode) => void;
  animSpeed: number;
  setAnimSpeed: (speed: number) => void;
}

const CustomTooltip = ({ active, payload, metric }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPlayCount = metric === 'playCount';
    
    return (
      <div className="bg-white border-4 border-zinc-900 p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pointer-events-none">
        <p className="text-[9px] tracking-[0.2em] text-zinc-400 font-black mb-1 uppercase font-sans">
          REF. {data.id} — NODE
        </p>
        <h3 className="font-serif text-zinc-900 font-black text-base leading-tight mb-4 border-b-2 border-zinc-100 pb-2">
          {data.title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-black text-zinc-800 tracking-tighter">
            {isPlayCount ? data.playCount : data.commentCount.toLocaleString()}
          </span>
          <span className="text-[10px] font-sans text-zinc-500 uppercase tracking-[0.1em] font-black">
            {isPlayCount ? '万次收听' : '条评论'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const PodcastChart: React.FC<PodcastChartProps> = ({ 
  metric, 
  isColoredByType, 
  chartKey, 
  theme,
  sortOrder,
  setSortOrder,
  animationType,
  setAnimationType,
  animSpeed,
  setAnimSpeed
}) => {
  const currentThemeData = THEMES[theme];

  const sortedData = useMemo(() => {
    return [...PODCAST_DATA].sort((a, b) => {
      if (sortOrder === 'desc') return b[metric] - a[metric];
      if (sortOrder === 'asc') return a[metric] - b[metric];
      return a.id.localeCompare(b.id);
    });
  }, [metric, sortOrder]);

  // STYLE 1: Tactile Instrument (Top-right cluster)
  // Hard borders, black font, downward translation on active
  const subBtnBase = "border-2 border-zinc-900 font-black text-[10px] uppercase tracking-tighter px-3 py-1.5 transition-all duration-75 active:scale-95";
  const subBtnInactive = "bg-white text-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-50 active:translate-y-[2px] active:shadow-none";
  const subBtnActive = "bg-zinc-900 text-white translate-y-[2px] shadow-none";

  return (
    <div className="w-full h-full relative group">
      {/* Top-Right Tactile Instrument Panel */}
      <div className="absolute top-0 right-4 z-20 flex items-start gap-8">
        
        {/* Cluster: Physics Mode */}
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-zinc-400 mb-2 uppercase tracking-[0.2em]">Mode</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setAnimationType('rise')}
              className={`${subBtnBase} ${animationType === 'rise' ? subBtnActive : subBtnInactive}`}
            >
              Rise
            </button>
            <button 
              onClick={() => setAnimationType('shutter')}
              className={`${subBtnBase} ${animationType === 'shutter' ? subBtnActive : subBtnInactive}`}
            >
              Shutter
            </button>
          </div>
        </div>

        {/* Cluster: Velocity */}
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-zinc-400 mb-2 uppercase tracking-[0.2em]">Velocity</span>
          <div className="flex gap-2">
            {[
              { val: 0.1, label: 'S' },
              { val: 0.05, label: 'N' },
              { val: 0.02, label: 'F' }
            ].map(s => (
              <button 
                key={s.label}
                onClick={() => setAnimSpeed(s.val)}
                className={`${subBtnBase} ${animSpeed === s.val ? subBtnActive : subBtnInactive} min-w-[32px]`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cluster: Sort Protocol */}
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-zinc-400 mb-2 uppercase tracking-[0.2em]">Sort Protocol</span>
          <div className="flex gap-3">
            <button 
              onClick={() => setSortOrder('id')}
              className={`${subBtnBase} ${sortOrder === 'id' ? subBtnActive : subBtnInactive}`}
            >
              Time
            </button>
            <button 
              onClick={() => setSortOrder('desc')}
              className={`${subBtnBase} ${sortOrder === 'desc' ? subBtnActive : subBtnInactive}`}
            >
              Max
            </button>
            <button 
              onClick={() => setSortOrder('asc')}
              className={`${subBtnBase} ${sortOrder === 'asc' ? subBtnActive : subBtnInactive}`}
            >
              Min
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          key={`${chartKey}-${sortOrder}-${animationType}-${animSpeed}`} 
          data={sortedData}
          margin={{ top: 80, right: 0, left: -10, bottom: 0 }}
          barCategoryGap="18%"
        >
          <defs>
            <linearGradient id="gradientDefault" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentThemeData.default.start} stopOpacity={1} />
              <stop offset="100%" stopColor={currentThemeData.default.end} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="gradientSolo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentThemeData.solo.start} stopOpacity={1} />
              <stop offset="100%" stopColor={currentThemeData.solo.end} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="gradientGuest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentThemeData.guest.start} stopOpacity={1} />
              <stop offset="100%" stopColor={currentThemeData.guest.end} stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="0" />
          
          <XAxis 
            dataKey="id" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'Inter', fontWeight: 900 }}
            dy={12}
            interval={2}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#1e293b', fontSize: 10, fontFamily: 'Inter', fontWeight: 900 }}
            tickFormatter={(value) => metric === 'playCount' ? `${value}万` : value.toLocaleString()}
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.3)]}
            width={60}
          />
          
          <Tooltip 
            cursor={{ fill: '#f8fafc', opacity: 1 }}
            content={<CustomTooltip metric={metric} />}
            animationDuration={100}
          />
          
          <Bar 
            dataKey={metric} 
            shape={<CustomBar animationType={animationType} animSpeed={animSpeed} />}
            isAnimationActive={false} 
          >
            {sortedData.map((entry) => {
              let fillId = 'gradientDefault';
              if (isColoredByType) {
                fillId = entry.type === 'Solo' ? 'gradientSolo' : 'gradientGuest';
              }
              return (
                <Cell 
                  key={`cell-${entry.id}`} 
                  fill={`url(#${fillId})`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PodcastChart;