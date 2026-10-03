'use client';

import React from 'react';
import { Position, POSITIONS, POSITION_CATEGORIES } from '@/types/player';

interface PositionSelectorProps {
  value: Position;
  onChange: (pos: Position) => void;
}

const CATEGORY_LABELS = {
  ATT: 'Attackers',
  MID: 'Midfielders',
  DEF: 'Defenders',
  GK: 'Goalkeepers',
} as const;

export default function PositionSelector({ value, onChange }: PositionSelectorProps) {
  const attackPositions = POSITIONS.filter((p) => POSITION_CATEGORIES[p] === 'ATT');
  const midfieldPositions = POSITIONS.filter((p) => POSITION_CATEGORIES[p] === 'MID');
  const defencePositions = POSITIONS.filter((p) => POSITION_CATEGORIES[p] === 'DEF');
  const gkPositions = POSITIONS.filter((p) => POSITION_CATEGORIES[p] === 'GK');

  const groups = [
    { label: 'Attacking', positions: attackPositions },
    { label: 'Midfield', positions: midfieldPositions },
    { label: 'Defending', positions: defencePositions },
    { label: 'Goalkeeping', positions: gkPositions },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Player Position
        </label>
        <span className="text-xs font-mono font-bold text-[#00ff87] px-2 py-0.5 rounded bg-[#00ff87]/10 border border-[#00ff87]/30">
          Selected: {value} ({CATEGORY_LABELS[POSITION_CATEGORIES[value]]})
        </span>
      </div>

      <div className="space-y-2">
        {groups.map((grp) => (
          <div key={grp.label} className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 w-20 flex-shrink-0">
              {grp.label}
            </span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {grp.positions.map((pos) => {
                const isActive = value === pos;
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => onChange(pos)}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all border ${
                      isActive
                        ? 'bg-[#00ff87] text-slate-950 border-[#00ff87] shadow-[0_0_12px_rgba(0,255,135,0.4)] scale-105'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
