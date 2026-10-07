'use client';

import React from 'react';
import { PlayerProfile, POSITION_CATEGORIES, STAT_DEFINITIONS } from '@/types/player';
import { Shield, Sparkles, Star, User } from 'lucide-react';
import { getStatColor } from './StatSlider';

interface FifaCardPreviewProps {
  player: PlayerProfile;
  overall: number | null;
  isAnalyzing: boolean;
}

export default function FifaCardPreview({
  player,
  overall,
  isAnalyzing,
}: FifaCardPreviewProps) {
  const isGk = POSITION_CATEGORIES[player.position] === 'GK';

  // Calculate quick average of the 6 stats for the preview draft rating
  const statValues = Object.values(player.stats);
  const avgStat = Math.round(
    statValues.reduce((sum, val) => sum + val, 0) / statValues.length
  );

  const rating = overall;

  // Card theme styling
  const getCardThemeClasses = () => {
    if (rating !== null && rating >= 90) {
      return {
        cardBorder: 'border-[#00ff87]/80 shadow-[0_0_35px_rgba(0,255,135,0.4)]',
        accentGradient: 'from-emerald-400 via-[#00ff87] to-teal-400',
        cardBg: 'from-slate-900 via-[#062417] to-slate-950',
        badge: 'bg-[#00ff87] text-slate-950',
        textGlow: 'text-[#00ff87]',
      };
    }
    if (rating !== null && rating >= 84) {
      return {
        cardBorder: 'border-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.35)]',
        accentGradient: 'from-amber-300 via-yellow-400 to-amber-500',
        cardBg: 'from-slate-900 via-[#271d05] to-slate-950',
        badge: 'bg-yellow-400 text-slate-950',
        textGlow: 'text-yellow-400',
      };
    }
    if (rating !== null && rating >= 75) {
      return {
        cardBorder: 'border-slate-500/70 shadow-[0_0_20px_rgba(148,163,184,0.2)]',
        accentGradient: 'from-slate-300 via-slate-100 to-slate-400',
        cardBg: 'from-slate-900 via-slate-800 to-slate-950',
        badge: 'bg-slate-300 text-slate-950',
        textGlow: 'text-slate-300',
      };
    }
    return {
      cardBorder: 'border-amber-700/70 shadow-[0_0_20px_rgba(180,83,9,0.2)]',
      accentGradient: 'from-amber-600 via-amber-700 to-amber-900',
      cardBg: 'from-slate-900 via-[#23120b] to-slate-950',
      badge: 'bg-amber-600 text-white',
      textGlow: 'text-amber-500',
    };
  };

  const theme = getCardThemeClasses();

  return (
    <div className="flex flex-col items-center">
      {/* FUT Card Container */}
      <div
        className={`relative w-[310px] sm:w-[330px] rounded-3xl p-5 border-2 bg-gradient-to-b ${theme.cardBg} ${theme.cardBorder} transition-all duration-300`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px))',
        }}
      >
        {/* Holographic light sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none rounded-3xl" />

        {/* Top Header: Rating, Position, Club/Nation icons */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex flex-col items-center">
            {/* Backend ML Rating Badge */}
            <span className={`text-4xl font-black tracking-tighter leading-none ${theme.textGlow}`}>
              {isAnalyzing ? '…' : rating ?? '—'}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mt-1">
              {isAnalyzing ? 'Analyzing' : rating === null ? 'Awaiting ML' : 'ML OVR'}
            </span>
            <span className="text-base font-black tracking-wider uppercase text-slate-100 font-mono mt-0.5">
              {player.position}
            </span>

            {/* Divider line */}
            <div className="w-8 h-[2px] bg-slate-700 my-1.5" />

            {/* Nation & Club Icons */}
            <div className="flex flex-col items-center gap-1.5 mt-0.5">
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-200 border border-slate-700"
                title={`Nation: ${player.nation}`}
              >
                {player.nation ? player.nation.slice(0, 3).toUpperCase() : 'NAT'}
              </span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700 flex items-center gap-1"
                title={`Club: ${player.club}`}
              >
                <Shield className="w-2.5 h-2.5 text-[#00ff87]" />
                {player.club ? player.club.slice(0, 3).toUpperCase() : 'CLB'}
              </span>
            </div>
          </div>

          {/* Player Visual Silhouette / Avatar Frame */}
          <div className="flex-1 flex justify-center items-center relative h-36">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800/60 border border-slate-700/80 flex items-center justify-center relative overflow-hidden group shadow-inner">
              {player.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <User className="w-16 h-16 opacity-60 text-slate-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                    LAB SPECIMEN
                  </span>
                </div>
              )}
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_50%,rgba(0,255,135,0.06)_50%)] bg-[length:100%_4px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Player Name Display */}
        <div className="text-center my-3 relative z-10">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-2" />
          <h3 className="text-xl font-black uppercase tracking-wider text-white truncate px-2">
            {player.name.trim() || 'NEW PLAYER'}
          </h3>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent mt-2" />
        </div>

        {/* 6 Core Stats Grid (2 columns x 3 rows) */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-2 px-2 py-1 relative z-10 text-sm font-mono">
          {STAT_DEFINITIONS.map((def) => {
            const val = player.stats[def.key];
            const abbr = isGk ? def.gkAbbreviation : def.abbreviation;
            const statColor = getStatColor(val);

            return (
              <div
                key={def.key}
                className="flex items-center justify-between border-b border-slate-800/80 pb-1"
              >
                <span className="text-slate-400 font-bold tracking-wider text-xs">
                  {abbr}
                </span>
                <span className={`text-base font-black ${statColor.text}`}>
                  {val}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Card Attributes (Foot, Skills, Weak Foot) */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400 px-2 relative z-10">
          <div className="flex items-center gap-1">
            <span>SM:</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < player.skillMoves ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span>WF:</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < player.weakFoot ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <span>FOOT: </span>
            <span className="text-slate-200 font-bold">{player.preferredFoot[0]}</span>
          </div>
        </div>
      </div>

      {/* Card Metadata / Live Scout Summary Pill */}
      <div className="mt-4 w-full max-w-[330px] p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-800 pb-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff87]" />
            Live Scouting Metrics
          </span>
          <span className="text-[#00ff87] text-[11px]">
            {isAnalyzing ? 'Analyzing…' : rating === null ? 'Awaiting analysis' : 'ML Prediction'}
          </span>
        </div>

        <div className="flex justify-between items-center text-[11px]">
          <span>Overall Stat Average:</span>
          <span className="font-bold text-white">{avgStat}</span>
        </div>

        <div className="flex justify-between items-center text-[11px]">
          <span>Total Stat Points:</span>
          <span className="font-bold text-white">
            {statValues.reduce((a, b) => a + b, 0)} / 594
          </span>
        </div>

        <div className="flex justify-between items-center text-[11px]">
          <span>Work Rates (Att/Def):</span>
          <span className="font-bold text-slate-200">
            {player.workRateAttacking} / {player.workRateDefensive}
          </span>
        </div>

        <div className="pt-1 text-[10px] text-slate-500 italic text-center">
          {rating === null
            ? '* Verify the player to calculate the final ML OVR.'
            : '* Final OVR supplied by the FastAPI prediction model.'}
        </div>
      </div>
    </div>
  );
}
