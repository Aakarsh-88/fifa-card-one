'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import StatusPill from '@/components/StatusPill';
import PlayerBuilder from '@/components/PlayerBuilder';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Award,
  ChevronDown,
  Flame,
} from 'lucide-react';

export default function Home() {
  const studioRef = useRef<HTMLDivElement>(null);

  const scrollToStudio = () => {
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pitch-grid relative selection:bg-[#00ff87]/30 selection:text-[#00ff87] overflow-x-hidden">
      {/* Stadium Floodlights (Top Left & Top Right) */}
      <div className="absolute top-0 left-0 w-[550px] h-[550px] stadium-light-left pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] stadium-light-right pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c14]/85 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff87] via-emerald-500 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,135,0.4)]">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5">
                <span className="text-white">FIFA</span>
                <span className="text-[#00ff87]">CARD ONE</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                Official Scouting Studio
              </div>
            </div>
          </div>

          {/* Right Header Navigation & StatusPill */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-slate-400">
              <a href="#how-it-works" className="hover:text-[#00ff87] transition-colors">
                How It Works
              </a>
              <a href="#player-builder" className="hover:text-[#00ff87] transition-colors">
                Player Studio
              </a>
            </nav>
            <StatusPill />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Faint Pitch Markings in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none opacity-40 z-0">
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
            {/* Center Spot */}
            <div className="w-3 h-3 rounded-full bg-[#00ff87]/30 shadow-[0_0_12px_#00ff87]" />
          </div>
        </div>

        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00ff87]/15 via-amber-500/10 to-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          {/* Football Emblem Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/30 text-xs font-mono text-[#00ff87] uppercase tracking-wider mb-6">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Gen Football Scouting</span>
          </div>

          {/* Animated Football */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              {/* Ball Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#00ff87]/30 to-amber-400/30 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Stylized Match Ball SVG */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-2 border-white/20 p-1 shadow-2xl animate-ball-float">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full animate-ball-spin"
                  style={{ animationDuration: '24s' }}
                >
                  <circle cx="50" cy="50" r="48" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                  {/* Pentagonal center patch */}
                  <polygon
                    points="50,32 66,44 60,63 40,63 34,44"
                    fill="#0f172a"
                  />
                  {/* Surrounding panel lines & patches */}
                  <line x1="50" y1="32" x2="50" y2="12" stroke="#0f172a" strokeWidth="3" />
                  <line x1="66" y1="44" x2="84" y2="38" stroke="#0f172a" strokeWidth="3" />
                  <line x1="60" y1="63" x2="74" y2="78" stroke="#0f172a" strokeWidth="3" />
                  <line x1="40" y1="63" x2="26" y2="78" stroke="#0f172a" strokeWidth="3" />
                  <line x1="34" y1="44" x2="16" y2="38" stroke="#0f172a" strokeWidth="3" />
                  {/* Edge decorative panels */}
                  <polygon points="50,12 40,3 60,3" fill="#0f172a" />
                  <polygon points="84,38 96,28 97,46" fill="#0f172a" />
                  <polygon points="74,78 88,86 70,95" fill="#0f172a" />
                  <polygon points="26,78 12,86 30,95" fill="#0f172a" />
                  <polygon points="16,38 4,28 3,46" fill="#0f172a" />
                </svg>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none">
            FIFA Card <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff87] via-emerald-300 to-amber-300 text-glow-lime">
              One
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            Craft your signature football card with authentic EA FC gold styling and official
            scout ratings.
          </p>

          {/* Primary CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToStudio}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00ff87] hover:bg-[#00ff87]/90 text-slate-950 font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(0,255,135,0.45)] hover:shadow-[0_0_35px_rgba(0,255,135,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Create Your Player</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-mono text-xs tracking-wider uppercase border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center"
            >
              How It Works
            </a>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section: 3 Football Steps */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00ff87]">
            Scouting Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            Pick Stats → Scout → Reveal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            From custom player stats to an official EA FC-style gold card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: PICK YOUR STATS */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-[#00ff87]/30 shadow-[0_0_20px_rgba(0,255,135,0.08)] relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-3xl font-black font-mono text-[#00ff87]/20">
              01
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#00ff87]/15 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87] mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono uppercase text-[#00ff87] font-bold">
              Step 1
            </div>
            <h3 className="text-lg font-black text-white uppercase mt-1 mb-2">
              Pick Your Stats
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your player position and tune the 6 core football attributes: Pace, Shooting,
              Passing, Dribbling, Defending, and Physicality.
            </p>
          </motion.div>

          {/* Step 2: SCOUT THIS PLAYER */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-3xl font-black font-mono text-slate-800">
              02
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono uppercase text-amber-400 font-bold">
              Step 2
            </div>
            <h3 className="text-lg font-black text-slate-200 uppercase mt-1 mb-2">
              Scout This Player
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our scouting system evaluates your player's attribute balance to determine
              their true overall rating.
            </p>
          </motion.div>

          {/* Step 3: REVEAL THE CARD */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-3xl font-black font-mono text-slate-800">
              03
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-4">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">
              Step 3
            </div>
            <h3 className="text-lg font-black text-slate-200 uppercase mt-1 mb-2">
              Reveal the Card
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unveil your finished EA FC gold card with official Scout Rating, customized player photo,
              nationality flag, and key scouted strengths.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Downward indicator */}
      <div className="flex justify-center -mb-4 relative z-10">
        <button
          onClick={scrollToStudio}
          className="text-slate-500 hover:text-[#00ff87] transition-colors p-2 animate-bounce"
          aria-label="Scroll down to Player Studio"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Interactive Player Studio Container */}
      <div ref={studioRef} className="relative z-10">
        <PlayerBuilder />
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-800/80 text-center text-xs font-mono text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
            <span className="text-slate-400">FIFA Card One • Player Studio</span>
          </div>
          <div>FIFA Card One • Ultimate Football Scouting Experience</div>
        </div>
      </footer>
    </div>
  );
}
