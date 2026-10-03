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
  Cpu,
  Award,
  ChevronDown,
} from 'lucide-react';

export default function Home() {
  const builderRef = useRef<HTMLDivElement>(null);

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 bg-scout-grid selection:bg-[#00ff87]/30 selection:text-[#00ff87]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c14]/80 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff87] to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,135,0.4)]">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5">
                <span className="text-white">FIFA</span>
                <span className="text-[#00ff87]">RATING LAB</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                AI Scouting Laboratory
              </div>
            </div>
          </div>

          {/* Right Header Navigation & StatusPill */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-slate-400">
              <a href="#workflow" className="hover:text-[#00ff87] transition-colors">
                Protocol
              </a>
              <a href="#player-builder" className="hover:text-[#00ff87] transition-colors">
                Builder
              </a>
            </nav>
            <StatusPill />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00ff87]/15 to-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          {/* Futuristic Lab Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/30 text-xs font-mono text-[#00ff87] uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Futuristic Football Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none">
            Player Rating <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff87] via-emerald-300 to-teal-200 text-glow-lime">
              Laboratory
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Construct high-precision football profiles, fine-tune tactical attributes, and preview
            dynamic Ultimate Team cards powered by advanced machine learning intelligence.
          </p>

          {/* Primary CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToBuilder}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00ff87] hover:bg-[#00ff87]/90 text-slate-950 font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(0,255,135,0.45)] hover:shadow-[0_0_35px_rgba(0,255,135,0.6)] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Create your player</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>

            <a
              href="#workflow"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-mono text-xs tracking-wider uppercase border border-slate-800 transition-colors flex items-center justify-center"
            >
              View Laboratory Workflow
            </a>
          </div>
        </motion.div>
      </section>

      {/* Workflow Section: BUILD -> ANALYSE -> REVEAL */}
      <section id="workflow" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00ff87]">
            Scouting Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            BUILD → ANALYSE → REVEAL
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            A three-stage laboratory pipeline translating raw performance parameters into FIFA card ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1: BUILD */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-[#00ff87]/30 shadow-[0_0_20px_rgba(0,255,135,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-3xl font-black font-mono text-[#00ff87]/20">
              01
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#00ff87]/15 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87] mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono uppercase text-[#00ff87] font-bold">
              Stage 1 • Milestone 2
            </div>
            <h3 className="text-lg font-black text-white uppercase mt-1 mb-2">
              BUILD
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Design player biomechanics, define positions, configure work rates, and adjust the 6 core
              FIFA stat attributes with real-time card responsiveness.
            </p>
          </motion.div>

          {/* Step 2: ANALYSE */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-3xl font-black font-mono text-slate-800">
              02
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono uppercase text-slate-500 font-bold">
              Stage 2 • Milestone 3
            </div>
            <h3 className="text-lg font-black text-slate-200 uppercase mt-1 mb-2">
              ANALYSE
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trained scikit-learn regressors evaluate the attribute matrix against thousands of
              historical FIFA scouting datasets to compute the true overall rating.
            </p>
          </motion.div>

          {/* Step 3: REVEAL */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-3xl font-black font-mono text-slate-800">
              03
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono uppercase text-slate-500 font-bold">
              Stage 3 • Milestone 4
            </div>
            <h3 className="text-lg font-black text-slate-200 uppercase mt-1 mb-2">
              REVEAL
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unveil the finished Ultimate Team card with official holographic tier themes, tier badges,
              and high-resolution export for social sharing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Downward indicator */}
      <div className="flex justify-center -mb-4">
        <button
          onClick={scrollToBuilder}
          className="text-slate-500 hover:text-[#00ff87] transition-colors p-2 animate-bounce"
          aria-label="Scroll down to Builder"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Interactive Milestone 2 Builder Container */}
      <div ref={builderRef}>
        <PlayerBuilder />
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-800/80 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
            <span>FIFA Card Generator • Milestone 2 Implementation</span>
          </div>
          <div>Next.js 15 App Router • Tailwind CSS • Framer Motion</div>
        </div>
      </footer>
    </div>
  );
}
