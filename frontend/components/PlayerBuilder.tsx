'use client';

import React, { useRef, useState } from 'react';
import {
  PlayerProfile,
  PlayerStats,
  Position,
  StatKey,
  STAT_DEFINITIONS,
  POSITION_CATEGORIES,
  PlayerArchetype,
  WorkRate,
  PreferredFoot,
} from '@/types/player';
import StatSlider from './StatSlider';
import PositionSelector from './PositionSelector';
import ArchetypeSelector from './ArchetypeSelector';
import FifaCardPreview from './FifaCardPreview';
import { predictPlayerRating } from '@/lib/api';
import {
  RotateCcw,
  Dice5,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  SlidersHorizontal,
  UserCheck,
  Zap,
} from 'lucide-react';

const INITIAL_STATS: PlayerStats = {
  pace: 82,
  shooting: 78,
  passing: 80,
  dribbling: 83,
  defending: 65,
  physical: 74,
};

const INITIAL_PLAYER: PlayerProfile = {
  name: 'Marcus Sterling',
  position: 'ST',
  nation: 'England',
  club: 'Manchester City',
  league: 'Premier League',
  age: 24,
  height: 182,
  weight: 77,
  preferredFoot: 'Right',
  weakFoot: 4,
  skillMoves: 4,
  workRateAttacking: 'High',
  workRateDefensive: 'Medium',
  stats: INITIAL_STATS,
};

const POPULAR_NATIONS = [
  'Argentina',
  'Brazil',
  'France',
  'England',
  'Spain',
  'Germany',
  'Portugal',
  'Netherlands',
  'Italy',
  'Belgium',
];

const POPULAR_CLUBS = [
  'Real Madrid',
  'Manchester City',
  'Arsenal',
  'Barcelona',
  'Bayern Munich',
  'Paris Saint-Germain',
  'Liverpool',
  'Inter Milan',
];

export default function PlayerBuilder() {
  const [player, setPlayer] = useState<PlayerProfile>(INITIAL_PLAYER);
  const [activeArchetype, setActiveArchetype] = useState<string | undefined>('clinical-striker');
  const [activeTab, setActiveTab] = useState<'attributes' | 'profile' | 'presets'>('attributes');
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [predictedOverall, setPredictedOverall] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const predictionRequestId = useRef(0);

  const isGk = POSITION_CATEGORIES[player.position] === 'GK';

  // Handle stat change
  const handleStatChange = (key: StatKey, value: number) => {
    predictionRequestId.current += 1;
    setPredictedOverall(null);
    setPredictionError(null);
    setIsAnalyzing(false);
    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: value,
      },
    }));
    setActiveArchetype(undefined); // custom change resets active archetype highlight
  };

  // Handle position change
  const handlePositionChange = (newPos: Position) => {
    predictionRequestId.current += 1;
    setPredictedOverall(null);
    setPredictionError(null);
    setIsAnalyzing(false);
    setPlayer((prev) => ({
      ...prev,
      position: newPos,
    }));
  };

  // Handle archetype selection
  const handleSelectArchetype = (archetype: PlayerArchetype) => {
    predictionRequestId.current += 1;
    setPredictedOverall(null);
    setPredictionError(null);
    setIsAnalyzing(false);
    setPlayer((prev) => ({
      ...prev,
      position: archetype.position,
      stats: { ...archetype.stats },
    }));
    setActiveArchetype(archetype.id);
  };

  // Randomize stats
  const handleRandomizeStats = () => {
    predictionRequestId.current += 1;
    setPredictedOverall(null);
    setPredictionError(null);
    setIsAnalyzing(false);
    const randomStat = () => Math.floor(Math.random() * (96 - 55 + 1)) + 55;
    setPlayer((prev) => ({
      ...prev,
      stats: {
        pace: randomStat(),
        shooting: randomStat(),
        passing: randomStat(),
        dribbling: randomStat(),
        defending: randomStat(),
        physical: randomStat(),
      },
    }));
    setActiveArchetype(undefined);
  };

  // Reset to default
  const handleReset = () => {
    predictionRequestId.current += 1;
    setPlayer(INITIAL_PLAYER);
    setActiveArchetype('clinical-striker');
    setValidationSuccess(null);
    setPredictionError(null);
    setPredictedOverall(null);
    setIsAnalyzing(false);
  };

  // Validate inputs
  const validateForm = () => {
    if (!player.name.trim()) {
      return { valid: false, message: 'Please provide a player name.' };
    }
    const values = Object.values(player.stats);
    for (const v of values) {
      if (v < 1 || v > 99) {
        return { valid: false, message: 'All stats must be between 1 and 99.' };
      }
    }
    if (isGk) {
      return { valid: false, message: 'Goalkeepers are not supported by the ML prediction model.' };
    }
    return { valid: true, message: 'Player data verified successfully.' };
  };

  const handleValidateClick = async () => {
    const result = validateForm();
    setValidationSuccess(null);
    setPredictionError(null);

    if (!result.valid) {
      setPredictionError(result.message);
      return;
    }

    const requestId = ++predictionRequestId.current;
    setIsAnalyzing(true);

    try {
      const prediction = await predictPlayerRating(player.stats, player.position);
      if (requestId !== predictionRequestId.current) {
        return;
      }
      setPredictedOverall(prediction.overall);
      setValidationSuccess('Player analyzed successfully. ML OVR is now live on the card.');
    } catch (error: unknown) {
      if (requestId !== predictionRequestId.current) {
        return;
      }
      setPredictionError(
        error instanceof Error ? error.message : 'Unable to analyze this player.'
      );
    } finally {
      if (requestId === predictionRequestId.current) {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <section id="player-builder" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#00ff87] tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            Milestone 2 • Laboratory Workstation
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            PLAYER PROFILE BUILDER
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure player attributes, archetype parameters, and core FIFA scouting statistics.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRandomizeStats}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Dice5 className="w-3.5 h-3.5 text-[#00ff87]" />
            Randomize Stats
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Builder Grid: Left = Controls, Right = Live FUT Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Builder Navigation Tabs */}
          <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('attributes')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'attributes'
                  ? 'bg-[#00ff87] text-slate-950 shadow-[0_0_12px_rgba(0,255,135,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Core Stats (1-99)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#00ff87] text-slate-950 shadow-[0_0_12px_rgba(0,255,135,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Bio & Traits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'presets'
                  ? 'bg-[#00ff87] text-slate-950 shadow-[0_0_12px_rgba(0,255,135,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Archetypes
            </button>
          </div>

          {/* Tab 1: Core Stats Sliders */}
          {activeTab === 'attributes' && (
            <div className="space-y-4 rounded-2xl bg-slate-950/40 p-5 border border-slate-800/80 shadow-futuristic">
              {/* Position selector always accessible above stats */}
              <PositionSelector
                value={player.position}
                onChange={handlePositionChange}
              />

              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {isGk ? 'Goalkeeper Stat Matrix' : 'Outfield Stat Matrix'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Dual Slider & Numeric Input
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STAT_DEFINITIONS.map((def) => {
                    const label = isGk ? def.gkLabel : def.label;
                    const abbr = isGk ? def.gkAbbreviation : def.abbreviation;
                    return (
                      <StatSlider
                        key={def.key}
                        statKey={def.key}
                        label={label}
                        abbreviation={abbr}
                        description={def.description}
                        value={player.stats[def.key]}
                        onChange={handleStatChange}
                        isGk={isGk}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Profile & Traits */}
          {activeTab === 'profile' && (
            <div className="space-y-5 rounded-2xl bg-slate-950/40 p-5 border border-slate-800/80 shadow-futuristic">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Player Full Name *
                </label>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => setPlayer({ ...player, name: e.target.value })}
                  placeholder="e.g. Erling Haaland"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00ff87] text-sm"
                />
              </div>

              {/* Nation & Club */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nationality
                  </label>
                  <input
                    type="text"
                    list="popular-nations"
                    value={player.nation}
                    onChange={(e) => setPlayer({ ...player, nation: e.target.value })}
                    placeholder="e.g. France"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00ff87] text-sm"
                  />
                  <datalist id="popular-nations">
                    {POPULAR_NATIONS.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Club
                  </label>
                  <input
                    type="text"
                    list="popular-clubs"
                    value={player.club}
                    onChange={(e) => setPlayer({ ...player, club: e.target.value })}
                    placeholder="e.g. Real Madrid"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00ff87] text-sm"
                  />
                  <datalist id="popular-clubs">
                    {POPULAR_CLUBS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Physical Profile: Age, Height, Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Age (Yrs)
                  </label>
                  <input
                    type="number"
                    min={16}
                    max={45}
                    value={player.age}
                    onChange={(e) =>
                      setPlayer({ ...player, age: parseInt(e.target.value, 10) || 18 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#00ff87]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min={150}
                    max={220}
                    value={player.height}
                    onChange={(e) =>
                      setPlayer({ ...player, height: parseInt(e.target.value, 10) || 180 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#00ff87]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={110}
                    value={player.weight}
                    onChange={(e) =>
                      setPlayer({ ...player, weight: parseInt(e.target.value, 10) || 75 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#00ff87]"
                  />
                </div>
              </div>

              {/* Foot & Stars (Weak Foot / Skill Moves) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                {/* Preferred Foot */}
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Preferred Foot
                  </span>
                  <div className="flex gap-2">
                    {(['Right', 'Left'] as PreferredFoot[]).map((foot) => (
                      <button
                        key={foot}
                        type="button"
                        onClick={() => setPlayer({ ...player, preferredFoot: foot })}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          player.preferredFoot === foot
                            ? 'bg-[#00ff87] text-slate-950 border-[#00ff87]'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {foot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weak Foot */}
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Weak Foot ({player.weakFoot}★)
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setPlayer({ ...player, weakFoot: star })}
                        className={`flex-1 py-1 text-xs font-mono font-bold rounded border ${
                          star <= player.weakFoot
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skill Moves */}
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Skill Moves ({player.skillMoves}★)
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setPlayer({ ...player, skillMoves: star })}
                        className={`flex-1 py-1 text-xs font-mono font-bold rounded border ${
                          star <= player.skillMoves
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Work Rates */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Attacking Work Rate
                  </span>
                  <div className="flex gap-1">
                    {(['Low', 'Medium', 'High'] as WorkRate[]).map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setPlayer({ ...player, workRateAttacking: rate })}
                        className={`flex-1 py-1 text-xs font-semibold rounded border ${
                          player.workRateAttacking === rate
                            ? 'bg-slate-200 text-slate-950 border-white'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Defensive Work Rate
                  </span>
                  <div className="flex gap-1">
                    {(['Low', 'Medium', 'High'] as WorkRate[]).map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setPlayer({ ...player, workRateDefensive: rate })}
                        className={`flex-1 py-1 text-xs font-semibold rounded border ${
                          player.workRateDefensive === rate
                            ? 'bg-slate-200 text-slate-950 border-white'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Archetypes & Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-4 rounded-2xl bg-slate-950/40 p-5 border border-slate-800/80 shadow-futuristic">
              <ArchetypeSelector
                onSelect={handleSelectArchetype}
                activeId={activeArchetype}
              />
            </div>
          )}

          {/* Validation & Milestone Boundary Banner */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Milestone 2 Status: Player Builder UI Complete
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#00ff87]/15 text-[#00ff87] border border-[#00ff87]/30">
                Phase Active
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              All interactive player builder controls, dual range sliders, tactical position selectors,
              and live FUT card rendering are fully wired. Form validation is active.
            </p>

            {validationSuccess && (
              <div className="p-2.5 rounded-lg bg-[#00ff87]/15 border border-[#00ff87]/40 text-xs font-mono text-[#00ff87] flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {validationSuccess}
              </div>
            )}

            {predictionError && (
              <div
                role="alert"
                className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {predictionError}
              </div>
            )}

            <button
              type="button"
              onClick={handleValidateClick}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-xl font-black text-sm tracking-wider uppercase bg-[#00ff87] hover:bg-[#00ff87]/90 text-slate-950 shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-slate-950" />
              )}
              {isAnalyzing ? 'Analyzing Player…' : 'Verify & Analyze Player'}
            </button>
          </div>
        </div>

        {/* Right Column: Live FUT Card Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 shadow-futuristic flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
                Live Card Canvas
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Real-Time Reactive
              </span>
            </div>

            <FifaCardPreview
              player={player}
              overall={predictedOverall}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
