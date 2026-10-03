'use client';

import React from 'react';
import { PlayerArchetype, PlayerStats, Position } from '@/types/player';
import { Sparkles } from 'lucide-react';

export const ARCHETYPES: PlayerArchetype[] = [
  {
    id: 'speed-winger',
    name: 'Speed Demon',
    position: 'LW',
    tagline: 'Lightning Pace & Flank Dribbler',
    description: 'Blistering acceleration with agile wing footwork to bypass defensive blocks.',
    stats: {
      pace: 94,
      shooting: 82,
      passing: 79,
      dribbling: 91,
      defending: 38,
      physical: 72,
    },
  },
  {
    id: 'clinical-striker',
    name: 'Clinical Finisher',
    position: 'ST',
    tagline: 'Lethal Striker & Target Man',
    description: 'Deadly finishing inside the box coupled with physical strength and positioning.',
    stats: {
      pace: 86,
      shooting: 92,
      passing: 76,
      dribbling: 84,
      defending: 42,
      physical: 85,
    },
  },
  {
    id: 'vision-playmaker',
    name: 'Visionary Maestro',
    position: 'CAM',
    tagline: 'Midfield Orchestrator',
    description: 'Pinpoint precision passes, line-breaking through balls and sublime technique.',
    stats: {
      pace: 78,
      shooting: 84,
      passing: 93,
      dribbling: 89,
      defending: 55,
      physical: 68,
    },
  },
  {
    id: 'box-to-box',
    name: 'B2B Engine',
    position: 'CM',
    tagline: 'Relentless High-Workrate Engine',
    description: 'Endless stamina, capable of breaking attacks and driving into the opposition box.',
    stats: {
      pace: 82,
      shooting: 79,
      passing: 84,
      dribbling: 83,
      defending: 82,
      physical: 86,
    },
  },
  {
    id: 'rock-cb',
    name: 'Defensive Titan',
    position: 'CB',
    tagline: 'Imposing Central Defender',
    description: 'Dominant aerial presence, clean slide tackling and physical leadership.',
    stats: {
      pace: 77,
      shooting: 40,
      passing: 68,
      dribbling: 66,
      defending: 91,
      physical: 90,
    },
  },
  {
    id: 'sweeper-gk',
    name: 'Sweeper Keeper',
    position: 'GK',
    tagline: 'Modern High-Line Goalkeeper',
    description: 'Exceptional reflexes, commanding aerial reach and distribution vision.',
    stats: {
      pace: 88, // DIV
      shooting: 85, // HAN
      passing: 86, // KIC
      dribbling: 90, // REF
      defending: 58, // SPE
      physical: 87, // POS
    },
  },
];

interface ArchetypeSelectorProps {
  onSelect: (archetype: PlayerArchetype) => void;
  activeId?: string;
}

export default function ArchetypeSelector({ onSelect, activeId }: ArchetypeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#00ff87]" />
          Quick Archetype Presets
        </span>
        <span className="text-[11px] text-slate-500">Click to apply baseline stats</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ARCHETYPES.map((arch) => {
          const isSelected = activeId === arch.id;
          return (
            <button
              key={arch.id}
              type="button"
              onClick={() => onSelect(arch)}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-[#00ff87]/10 border-[#00ff87] text-white shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold truncate">{arch.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {arch.position}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">
                {arch.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
