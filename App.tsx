import React, { useState, useEffect } from 'react';
import { RotateCw, ToggleLeft, RotateCcw, BarChart3, MessageSquare } from 'lucide-react';
import PodcastChart from './components/PodcastChart';
import { MetricType } from './types';

export const THEMES = {
  classic: {
    name: 'Teal Archive',
    solo: { start: '#2dd4bf', end: '#0f766e' }, // Deep Teal
    guest: { start: '#475569', end: '#334155' }, // Shadow Gray
    default: { start: '#334155', end: '#1e293b' } // Deep Ink Archive
  },
  golden: {
    name: 'Gold Horizon',
    solo: { start: '#fbbf24', end: '#b45309' }, // Warm Gold
    guest: { start: '#475569', end: '#334155' }, // Shadow Gray
    default: { start: '#334155', end: '#1e293b' } // Deep Ink Archive
  },
  neon: {
    name: 'Rose Mauve',
    solo: { start: '#fb7185', end: '#be123c' }, // Soft Rose
    guest: { start: '#475569', end: '#334155' }, // Shadow Gray
    default: { start: '#334155', end: '#1e293b' } // Deep Ink Archive
  }
};

export type ThemeKey = keyof typeof THEMES;
export type SortOrder = 'id' | 'desc' | 'asc';
export type AnimationMode = 'rise' | 'shutter';

const App: React.FC = () => {
  const [chartKey, setChartKey] = useState(0);
  const [isColoredByType, setIsColoredByType] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricType>('playCount');
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('classic');
  const [sortOrder, setSortOrder] = useState<SortOrder>('id');
  const [animationType, setAnimationType] = useState<AnimationMode>('rise');
  const [animSpeed, setAnimSpeed] = useState<number>(0.05);

  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [activeMetric, sortOrder, animationType, animSpeed]);

  const handleReplay = () => setChartKey(prev => prev + 1);

  const activeThemeData = THEMES[currentTheme];

  // STYLE 2: Minimalist Archive (Bottom dimension switch) - Guardrailed style
  const metricBtnBase = "flex items-center gap-3 px-8 py-3 transition-all duration-300 font-serif text-[12px] font-bold tracking-widest uppercase border border-zinc-200";
  const metricBtnInactive = "bg-white text-muted hover:text-ink hover:border-zinc-400";
  const metricBtnActive = "bg-zinc-900 text-white border-zinc-900 shadow-lg";

  const actionBtnBase = "flex items-center gap-3 px-8 py-3 border-2 transition-all duration-500 active:scale-95 text-[11px] uppercase tracking-[0.2em] font-bold font-serif";

  return (
    <div className="h-screen w-full bg-paper text-ink selection:bg-zinc-100 font-sans p-6 md:p-10 lg:p-12 overflow-hidden flex flex-col items-center justify-between">
      
      {/* 1. Editorial Header */}
      <header className="w-full max-w-7xl flex justify-between items-end border-b-2 border-zinc-900 pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-serif uppercase tracking-[0.5em] font-bold text-muted">
            Digital Archive / Series 043-MY
          </span>
          <h1 className="font-serif text-2xl md:text-3xl uppercase tracking-tight font-black text-ink leading-none">
            Unknown (无人知晓) — {isColoredByType ? 'Spotlight Analysis' : 'Aggregated Metrics'}
          </h1>
        </div>
        
        <div className="flex items-center gap-12">
          <div className={`flex items-center gap-6 mb-1 transition-all duration-[2000ms] ease-linear ${isColoredByType ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: activeThemeData.solo.start }} />
              <span className="text-[10px] font-mono font-bold text-ink uppercase tracking-wider">Solo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeThemeData.guest.start }} />
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider">Guest</span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-mono text-muted uppercase tracking-widest leading-none mb-1">
              Theme: {activeThemeData.name}
            </span>
            <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest leading-none">
              Ink Archive Palette v2
            </span>
          </div>
        </div>
      </header>

      {/* 2. Visualization Area */}
      <main className="w-full max-w-7xl flex-grow flex flex-col justify-center py-6">
        <div className="w-full h-[58vh]">
          <PodcastChart 
            metric={activeMetric} 
            isColoredByType={isColoredByType} 
            chartKey={chartKey} 
            theme={currentTheme}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            animationType={animationType}
            setAnimationType={setAnimationType}
            animSpeed={animSpeed}
            setAnimSpeed={setAnimSpeed}
          />
        </div>

        {/* 3. Bottom Controls: The Data Dimension (Minimalist Archive) */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-zinc-100 mt-6">
          
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-serif uppercase tracking-[0.2em] font-bold text-muted">Dimensions</span>
            <div className="flex bg-zinc-100 p-1 rounded-none">
              <button 
                onClick={() => setActiveMetric('playCount')}
                className={`${metricBtnBase} ${activeMetric === 'playCount' ? metricBtnActive : metricBtnInactive}`}
              >
                <BarChart3 size={14} />
                播放量 (Plays)
              </button>
              <button 
                onClick={() => setActiveMetric('commentCount')}
                className={`${metricBtnBase} ${activeMetric === 'commentCount' ? metricBtnActive : metricBtnInactive}`}
              >
                <MessageSquare size={14} />
                评论数 (Comments)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 self-end">
            <div className="flex items-center">
              <button 
                onClick={() => setIsColoredByType(!isColoredByType)}
                className={`${actionBtnBase} ${isColoredByType ? 'bg-ink border-ink text-white' : 'bg-white border-zinc-200 text-muted hover:border-ink hover:text-ink'}`}
              >
                {isColoredByType ? (
                  <>
                    <RotateCcw size={16} />
                    <span>返回聚合视图</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={16} />
                    <span>区分孟岩 vs. 嘉宾</span>
                  </>
                )}
              </button>

              {/* Theme Selector - Fixing Clipping & Enhancing Depth */}
              <div className={`transition-all duration-[1000ms] flex items-center h-16 ${
                isColoredByType ? 'max-w-[300px] opacity-100 ml-6 pl-6 pr-4' : 'max-w-0 opacity-0 ml-0 overflow-hidden'
              }`}>
                <div className="flex gap-4 items-center">
                  {(Object.keys(THEMES) as ThemeKey[]).map((tKey) => (
                    <button
                      key={tKey}
                      onClick={() => setCurrentTheme(tKey)}
                      className={`w-7 h-7 rounded-full border-2 border-zinc-900 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] ${
                        currentTheme === tKey 
                          ? 'scale-110 ring-2 ring-zinc-900 ring-offset-2' 
                          : 'opacity-40 hover:opacity-100 scale-100'
                      }`}
                      style={{ backgroundColor: THEMES[tKey].solo.start }}
                      title={THEMES[tKey].name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleReplay}
              className={`${actionBtnBase} bg-white border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white group`}
            >
              <RotateCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>Replay</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl flex flex-col md:flex-row justify-between pt-6 border-t border-zinc-50 items-end">
        <div className="max-w-xl">
          <p className="text-[11px] text-muted font-serif leading-relaxed italic uppercase tracking-wide">
            Spectral State: {isColoredByType ? 'Spotlight Filter.' : 'Ink Archive Aggregation.'} 
            Velocity: {animSpeed === 0.1 ? 'SLOW' : animSpeed === 0.05 ? 'NORMAL' : 'FAST'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <span className="text-[10px] text-zinc-300 font-mono tracking-[0.3em] uppercase font-bold">
            Project Ref: UNKNOWN-VIZ-INK
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;