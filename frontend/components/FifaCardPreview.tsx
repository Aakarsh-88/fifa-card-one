'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayerProfile, STAT_DEFINITIONS } from '@/types/player';
import { Sparkles, Star, User } from 'lucide-react';

interface FifaCardPreviewProps {
  player: PlayerProfile;
  overall?: number | null;
  isAnalyzing?: boolean;
}

export default function FifaCardPreview({
  player,
  overall,
  isAnalyzing = false,
}: FifaCardPreviewProps) {
  // Backend /predict response is the ONLY source of the displayed Scout Rating.
  // Before success: display '—' and 'Awaiting Scout Rating'. No local estimated OVR.
  const rating = overall !== undefined ? overall : player.scoutRating ?? null;
  const isRevealed = rating !== null;
  const revealState = isAnalyzing ? 'analyzing' : isRevealed ? 'revealed' : 'pending';

  // Group the 6 stats into left (Pace, Shooting, Passing) and right (Dribbling, Defending, Physical)
  const leftStats = STAT_DEFINITIONS.slice(0, 3);
  const rightStats = STAT_DEFINITIONS.slice(3, 6);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={revealState}
        initial={
          revealState === 'revealed'
            ? { opacity: 0, rotateY: -90, y: 18, scale: 0.92 }
            : { opacity: 1 }
        }
        animate={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
        exit={{ opacity: 0, rotateY: 90, y: -12, scale: 0.94 }}
        transition={{ duration: revealState === 'revealed' ? 0.75 : 0.25, ease: 'easeOut' }}
        className="flex flex-col items-center [perspective:1200px]"
      >
        {/* Outer Card Animation Container */}
        <div className="relative group select-none">
          {/* Ambient Gold Backglow */}
          <div
            className={`absolute -inset-2 bg-gradient-to-b from-[#f5d77f]/20 via-[#c9a44c]/15 to-transparent rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none ${
              revealState === 'revealed' ? 'opacity-100 blur-2xl' : ''
            }`}
          />

          {/* FUT Gold Card Body */}
          <div
            className={`relative w-[300px] sm:w-[320px] fut-card-shield fut-gold-card p-4 pt-5 pb-9 transition-all duration-300 overflow-hidden text-[#241704] ${
              revealState === 'revealed' ? 'shadow-[0_0_45px_rgba(250,204,21,0.45)]' : ''
            }`}
          >
            {/* Holographic / Metallic Specular Sheen (Ambient Sweep) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-[120px] h-[200%] absolute -top-1/2 left-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-gold-shine" />
            </div>

            {/* Reveal Flash Light Sweep */}
            {revealState === 'revealed' && (
              <motion.div
                initial={{ x: '-120%', opacity: 0 }}
                animate={{ x: '120%', opacity: [0, 0.8, 0] }}
                transition={{ duration: 1.1, delay: 0.25, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-18deg] pointer-events-none z-20"
              />
            )}

            {/* Subtle Geometric Background Facets */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 15%, #ffffff 0%, transparent 60%), repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 8px)`,
              }}
            />

            {/* Top Section: Rating & Position on Left, Photo in Center/Right */}
            <div className="relative z-10 flex items-start justify-between">
              {/* Left Column: OVR, Position, Nation (if chosen), Club (if chosen) */}
              <div className="flex flex-col items-center w-16 pt-1 flex-shrink-0">
                {/* OVR Rating */}
                <div className="relative">
                  <span className="text-5xl font-black tracking-tighter leading-none text-[#261804] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    {isAnalyzing ? '…' : isRevealed ? rating : '—'}
                  </span>
                  {isRevealed && (
                    <span
                      title="Scout Rating"
                      className="absolute -top-1.5 -right-2 text-[#875c13] animate-pulse"
                    >
                      ★
                    </span>
                  )}
                </div>

                {/* Position */}
                <span className="text-lg font-black tracking-wider uppercase font-mono text-[#4a3411] -mt-0.5">
                  {player.position}
                </span>

                {/* Gold Divider Line */}
                <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#8a631c] to-transparent my-2" />

                {/* Optional Nationality (ONLY IF SELECTED) */}
                {player.nation && (
                  <div
                    className="flex flex-col items-center gap-0.5 mb-2 transition-all animate-fadeIn"
                    title={`Nationality: ${player.nation} (${player.nationCode || ''})`}
                  >
                    <span className="text-xl leading-none drop-shadow-sm">
                      {player.nationFlag || '🏳️'}
                    </span>
                    {player.nationCode && (
                      <span className="text-[10px] font-black font-mono tracking-widest text-[#422e0e]">
                        {player.nationCode}
                      </span>
                    )}
                  </div>
                )}

                {/* Optional Club (ONLY IF ENTERED) */}
                {player.club && player.club.trim().length > 0 && (
                  <div
                    className="flex items-center justify-center max-w-[62px] px-1 py-0.5 rounded bg-black/10 border border-[#8a631c]/30 transition-all animate-fadeIn"
                    title={`Club: ${player.club}`}
                  >
                    <span className="text-[9px] font-black tracking-wider uppercase truncate text-[#38260b]">
                      {player.club}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Prominent Player Photo / Portrait Area */}
              <div className="flex-1 flex justify-center items-end relative h-40 overflow-hidden">
                {player.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={player.avatarUrl}
                    alt={player.name || 'Player'}
                    className="h-full max-h-40 w-auto object-cover object-top drop-shadow-[0_8px_10px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-end h-full pb-2 text-[#6e4e1a]/70">
                    <User className="w-24 h-24 stroke-[1.2] opacity-80" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#573d13] -mt-1">
                      No Photo
                    </span>
                  </div>
                )}

                {/* Subtle Gold Fade at bottom of portrait */}
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#cda74f] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Player Name Banner */}
            <div className="relative z-10 text-center my-2">
              <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#5c3e0f] to-transparent mb-1.5 opacity-60" />
              <h3 className="text-xl font-black uppercase tracking-wider text-[#261704] truncate px-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                {player.name.trim() || 'NEW PLAYER'}
              </h3>
              <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#5c3e0f] to-transparent mt-1.5 opacity-60" />
            </div>

            {/* 6 Core Stats Layout (Classic 2-Column FUT Arrangement) */}
            <div className="relative z-10 flex items-center justify-center gap-4 px-3 py-1 font-mono">
              {/* Left 3 Stats (PAC, SHO, PAS) */}
              <div className="flex-1 space-y-1">
                {leftStats.map((def) => {
                  const val = player.stats[def.key];
                  const abbr = def.abbreviation;
                  return (
                    <div key={def.key} className="flex items-center justify-between text-sm">
                      <span className="text-base font-black text-[#261704] drop-shadow-sm">
                        {val}
                      </span>
                      <span className="text-xs font-black tracking-wider uppercase text-[#473210]">
                        {abbr}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Vertical Center Gold Separator */}
              <div className="w-[1.5px] h-14 bg-gradient-to-b from-transparent via-[#755017] to-transparent opacity-60" />

              {/* Right 3 Stats (DRI, DEF, PHY) */}
              <div className="flex-1 space-y-1">
                {rightStats.map((def) => {
                  const val = player.stats[def.key];
                  const abbr = def.abbreviation;
                  return (
                    <div key={def.key} className="flex items-center justify-between text-sm">
                      <span className="text-base font-black text-[#261704] drop-shadow-sm">
                        {val}
                      </span>
                      <span className="text-xs font-black tracking-wider uppercase text-[#473210]">
                        {abbr}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Card Footer: Skill Moves, Weak Foot, Preferred Foot */}
            <div className="relative z-10 mt-3 pt-2 border-t border-[#7a5418]/30 flex items-center justify-between text-[10px] font-mono font-bold text-[#473210] px-2">
              <div className="flex items-center gap-1">
                <span>SM:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${
                        i < player.skillMoves ? 'fill-[#473210] text-[#473210]' : 'text-[#a37d37]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span>WF:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${
                        i < player.weakFoot ? 'fill-[#473210] text-[#473210]' : 'text-[#a37d37]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span>FOOT: </span>
                <span className="font-black text-[#261704]">{player.preferredFoot[0]}</span>
              </div>
            </div>

            {/* Scouting In-Progress Scanner Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-[#080c14]/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center">
                <div className="relative mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-[#00ff87]/30 border-t-[#00ff87] animate-spin" />
                  <Sparkles className="w-5 h-5 text-[#00ff87] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <span className="text-xs font-mono font-bold uppercase text-[#00ff87] tracking-wider">
                  Scouting Player…
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Evaluating player attributes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scout Report Status Card Below */}
        <div className="mt-5 w-full max-w-[320px] p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Scout Report
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                isRevealed
                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                  : isAnalyzing
                  ? 'bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isRevealed
                ? `Scout Rating: ${rating}`
                : isAnalyzing
                ? 'Scouting Player…'
                : 'Awaiting Scout Rating'}
            </span>
          </div>

          {/* Top Attribute Highlights */}
          {isRevealed && player.featureImportance && (
            <div className="space-y-1 pt-0.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Key Strengths:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(player.featureImportance)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([stat, imp]) => (
                    <span
                      key={stat}
                      className="px-2 py-0.5 rounded bg-slate-800/90 text-[10px] text-emerald-400 border border-slate-700 capitalize font-medium"
                    >
                      {stat} (+{Math.round(imp * 100)}%)
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>Work Rates:</span>
            <span className="font-semibold text-slate-200">
              {player.workRateAttacking} / {player.workRateDefensive}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
