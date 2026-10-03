'use client';

import React from 'react';
import { StatKey } from '@/types/player';

interface StatSliderProps {
  statKey: StatKey;
  label: string;
  abbreviation: string;
  description: string;
  value: number;
  onChange: (key: StatKey, value: number) => void;
  isGk?: boolean;
}

export function getStatColor(val: number): {
  text: string;
  bg: string;
  border: string;
  badge: string;
  glow: string;
} {
  if (val >= 90) {
    return {
      text: 'text-[#00ff87]',
      bg: 'bg-[#00ff87]/15',
      border: 'border-[#00ff87]/40',
      badge: 'bg-[#00ff87] text-slate-950 font-black',
      glow: 'shadow-[0_0_12px_rgba(0,255,135,0.4)]',
    };
  }
  if (val >= 80) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500 text-slate-950 font-bold',
      glow: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    };
  }
  if (val >= 70) {
    return {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/15',
      border: 'border-yellow-500/30',
      badge: 'bg-yellow-500 text-slate-950 font-bold',
      glow: 'shadow-[0_0_8px_rgba(234,179,8,0.25)]',
    };
  }
  if (val >= 60) {
    return {
      text: 'text-orange-400',
      bg: 'bg-orange-500/15',
      border: 'border-orange-500/30',
      badge: 'bg-orange-500 text-slate-950 font-bold',
      glow: 'shadow-[0_0_8px_rgba(249,115,22,0.25)]',
    };
  }
  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500 text-white font-bold',
    glow: 'shadow-[0_0_8px_rgba(244,63,94,0.25)]',
  };
}

export default function StatSlider({
  statKey,
  label,
  abbreviation,
  description,
  value,
  onChange,
}: StatSliderProps) {
  const color = getStatColor(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) parsed = 1;
    if (parsed > 99) parsed = 99;
    if (parsed < 1) parsed = 1;
    onChange(statKey, parsed);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(statKey, parseInt(e.target.value, 10));
  };

  const handleQuickStep = (step: number) => {
    const nextVal = Math.min(99, Math.max(1, value + step));
    onChange(statKey, nextVal);
  };

  // Calculate track percentage fill
  const percent = ((value - 1) / (99 - 1)) * 100;

  return (
    <div className="group relative p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-9 text-center px-1.5 py-0.5 rounded text-xs tracking-wider uppercase font-black ${color.badge}`}>
            {abbreviation}
          </span>
          <div>
            <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
              {label}
            </div>
            <div className="text-[10px] text-slate-500 hidden sm:block">
              {description}
            </div>
          </div>
        </div>

        {/* Numeric input with direct typing */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickStep(-1)}
            aria-label={`Decrease ${label}`}
            className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={value}
            onChange={handleInputChange}
            aria-label={`${label} value`}
            className={`w-11 px-1 py-0.5 text-center text-sm font-mono font-bold rounded bg-slate-950/80 border ${color.border} ${color.text} focus:outline-none focus:ring-1 focus:ring-[#00ff87] transition-all`}
          />
          <button
            type="button"
            onClick={() => handleQuickStep(1)}
            aria-label={`Increase ${label}`}
            className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Slider with styled progress track */}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={1}
          max={99}
          value={value}
          onChange={handleRangeChange}
          aria-label={`${label} slider`}
          className="w-full z-10"
          style={{
            background: `linear-gradient(to right, #00ff87 0%, #00ff87 ${percent}%, #1e293b ${percent}%, #1e293b 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1">
        <span>1</span>
        <span className="text-slate-400 font-medium">Rating: {value} / 99</span>
        <span>99</span>
      </div>
    </div>
  );
}
