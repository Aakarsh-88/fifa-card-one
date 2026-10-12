'use client';

import React, { useState, useRef, useMemo } from 'react';
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
import { FIFA_ASSOCIATIONS, FifaAssociation } from '@/data/fifaAssociations';
import { predictPlayerRating } from '@/lib/api';
import StatSlider from './StatSlider';
import PositionSelector from './PositionSelector';
import ArchetypeSelector from './ArchetypeSelector';
import FifaCardPreview from './FifaCardPreview';
import {
  RotateCcw,
  Dice5,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  SlidersHorizontal,
  UserCheck,
  Camera,
  Trash2,
  Search,
  X,
  ChevronDown,
} from 'lucide-react';

const INITIAL_STATS: PlayerStats = {
  pace: 84,
  shooting: 82,
  passing: 80,
  dribbling: 85,
  defending: 52,
  physical: 74,
};

// Nationality and club are empty by default
const INITIAL_PLAYER: PlayerProfile = {
  name: 'Marcus Sterling',
  position: 'ST',
  nation: '',
  nationCode: '',
  nationFlag: '',
  club: '',
  age: 23,
  height: 182,
  weight: 77,
  preferredFoot: 'Right',
  weakFoot: 4,
  skillMoves: 4,
  workRateAttacking: 'High',
  workRateDefensive: 'Medium',
  stats: INITIAL_STATS,
  avatarUrl: undefined,
  scoutRating: undefined,
  featureImportance: undefined,
  scoutModel: undefined,
};

export default function PlayerBuilder() {
  const [player, setPlayer] = useState<PlayerProfile>(INITIAL_PLAYER);
  const [activeArchetype, setActiveArchetype] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'attributes' | 'profile' | 'presets'>('attributes');
  const [predictedOverall, setPredictedOverall] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoutMessage, setScoutMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const predictionRequestId = useRef(0);

  // Nationality search state
  const [nationSearch, setNationSearch] = useState('');
  const [isNationDropdownOpen, setIsNationDropdownOpen] = useState(false);
  const nationDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGk = POSITION_CATEGORIES[player.position] === 'GK';

  // Filter 211 FIFA associations based on search query
  const filteredAssociations = useMemo(() => {
    const q = nationSearch.trim().toLowerCase();
    if (!q) return FIFA_ASSOCIATIONS;
    return FIFA_ASSOCIATIONS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q)
    );
  }, [nationSearch]);

  // Handle stat change: immediately clears stale rating
  const handleStatChange = (key: StatKey, value: number) => {
    predictionRequestId.current += 1;
    setPredictedOverall(null);
    setIsAnalyzing(false);
    setScoutMessage(null);
    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: value,
      },
      scoutRating: undefined,
      featureImportance: undefined,
    }));
    setActiveArchetype(undefined);
  };

  // Handle position change: immediately clears stale rating
  const handlePositionChange = (newPos: Position) => {
    predictionRequestId.current += 1;
    setPredictedOverall(null);
    setIsAnalyzing(false);
    setScoutMessage(null);
    setPlayer((prev) => ({
      ...prev,
      position: newPos,
      scoutRating: undefined,
      featureImportance: undefined,
    }));
  };

  // Handle archetype selection: immediately clears stale rating
  const handleSelectArchetype = (archetype: PlayerArchetype) => {
    predictionRequestId.current += 1;
    setPredictedOverall(null);
    setIsAnalyzing(false);
    setScoutMessage(null);
    setPlayer((prev) => ({
      ...prev,
      position: archetype.position,
      stats: { ...archetype.stats },
      scoutRating: undefined,
      featureImportance: undefined,
    }));
    setActiveArchetype(archetype.id);
  };

  // Randomize stats: immediately clears stale rating
  const handleRandomizeStats = () => {
    predictionRequestId.current += 1;
    setPredictedOverall(null);
    setIsAnalyzing(false);
    setScoutMessage(null);
    const randomStat = () => Math.floor(Math.random() * (95 - 55 + 1)) + 55;
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
      scoutRating: undefined,
      featureImportance: undefined,
    }));
    setActiveArchetype(undefined);
  };

  // Reset to default
  const handleReset = () => {
    predictionRequestId.current += 1;
    if (player.avatarUrl && player.avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(player.avatarUrl);
    }
    setPredictedOverall(null);
    setIsAnalyzing(false);
    setScoutMessage(null);
    setPlayer(INITIAL_PLAYER);
    setActiveArchetype(undefined);
    setNationSearch('');
  };

  // Photo Upload Handler (Client-side only)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // Validate size (< 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image file size must be less than 5 MB.');
      return;
    }

    // Clean up previous blob URL if any
    if (player.avatarUrl && player.avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(player.avatarUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setPlayer((prev) => ({
      ...prev,
      avatarUrl: previewUrl,
    }));
  };

  const handleRemovePhoto = () => {
    if (player.avatarUrl && player.avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(player.avatarUrl);
    }
    setPlayer((prev) => ({
      ...prev,
      avatarUrl: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Select Nationality
  const handleSelectNation = (assoc: FifaAssociation) => {
    setPlayer((prev) => ({
      ...prev,
      nation: assoc.name,
      nationCode: assoc.code,
      nationFlag: assoc.flag,
    }));
    setIsNationDropdownOpen(false);
    setNationSearch('');
  };

  const handleClearNation = () => {
    setPlayer((prev) => ({
      ...prev,
      nation: '',
      nationCode: '',
      nationFlag: '',
    }));
    setNationSearch('');
  };

  // Validate inputs
  const validateForm = () => {
    if (!player.name.trim()) {
      return { valid: false, message: 'Please enter a player name before scouting.' };
    }
    const values = Object.values(player.stats);
    for (const v of values) {
      if (v < 1 || v > 99) {
        return { valid: false, message: 'All stats must be between 1 and 99.' };
      }
    }
    if (isGk) {
      return {
        valid: false,
        message: 'Goalkeepers are currently not supported. Pick an outfield position to scout.',
      };
    }
    return { valid: true, message: '' };
  };

  // Scout Player action (calls backend /predict)
  const handleScoutPlayer = async () => {
    const validation = validateForm();
    setScoutMessage(null);

    if (!validation.valid) {
      setScoutMessage({ type: 'error', text: validation.message });
      return;
    }

    const requestId = ++predictionRequestId.current;
    setIsAnalyzing(true);
    setPredictedOverall(null);

    try {
      const prediction = await predictPlayerRating(player.stats, player.position);
      if (requestId !== predictionRequestId.current) {
        return;
      }
      setPredictedOverall(prediction.overall);
      setPlayer((prev) => ({
        ...prev,
        scoutRating: prediction.overall,
        featureImportance: prediction.feature_importance,
        scoutModel: prediction.model,
      }));
      setScoutMessage({
        type: 'success',
        text: `Card revealed! Scout Rating: ${prediction.overall} OVR`,
      });
    } catch (error: unknown) {
      if (requestId !== predictionRequestId.current) {
        return;
      }
      setPredictedOverall(null);
      const isGkErr =
        isGk ||
        (error instanceof Error &&
          error.message.toLowerCase().includes('goalkeeper'));
      setScoutMessage({
        type: 'error',
        text: isGkErr
          ? 'Goalkeepers are currently not supported. Pick an outfield position to scout.'
          : "Couldn't scout this player. Please try again.",
      });
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
            <Sparkles className="w-3.5 h-3.5" />
            FIFA Card One • Player Studio
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            Create Your Player
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure player attributes, pick your stats, and scout the official gold card.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRandomizeStats}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all active:scale-95"
          >
            <Dice5 className="w-3.5 h-3.5 text-[#00ff87]" />
            Randomize Stats
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left = Controls, Right = Live FUT Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
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
              Pick Your Stats
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
              Player Bio & Photo
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
              Presets
            </button>
          </div>

          {/* Tab 1: Core Stats Sliders */}
          {activeTab === 'attributes' && (
            <div className="space-y-4 rounded-2xl bg-slate-950/50 p-5 border border-slate-800 shadow-futuristic">
              <PositionSelector
                value={player.position}
                onChange={handlePositionChange}
              />

              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {isGk ? 'Goalkeeper Stats' : 'Outfield Player Stats'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Dual Slider & Number Input
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

          {/* Tab 2: Profile, Photo, Nationality & Club */}
          {activeTab === 'profile' && (
            <div className="space-y-5 rounded-2xl bg-slate-950/50 p-5 border border-slate-800 shadow-futuristic">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Player Name *
                </label>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => setPlayer({ ...player, name: e.target.value })}
                  placeholder="e.g. Marcus Sterling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00ff87] text-sm"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#00ff87]" />
                    Player Photo
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    JPG, PNG, WebP (Max 5MB)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {player.avatarUrl ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-amber-500/40 bg-slate-950 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={player.avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 flex items-center justify-center flex-shrink-0 text-slate-600">
                      <Camera className="w-6 h-6 stroke-[1.5]" />
                    </div>
                  )}

                  <div className="flex-1 flex flex-wrap gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="player-photo-input"
                    />
                    <label
                      htmlFor="player-photo-input"
                      className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#00ff87]" />
                      {player.avatarUrl ? 'Change Photo' : 'Add Player Photo'}
                    </label>

                    {player.avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Nationality & Club Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Searchable 211 FIFA Nationality Combobox */}
                <div className="relative" ref={nationDropdownRef}>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nationality (Optional)
                  </label>

                  {player.nation ? (
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{player.nationFlag}</span>
                        <span className="font-medium">{player.nation}</span>
                        <span className="text-xs font-mono font-bold text-amber-400/90">
                          ({player.nationCode})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearNation}
                        className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                        title="Remove Nationality"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div
                        onClick={() => setIsNationDropdownOpen(!isNationDropdownOpen)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:border-slate-600 cursor-pointer text-sm"
                      >
                        <span>Select FIFA nationality...</span>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      </div>

                      {isNationDropdownOpen && (
                        <div className="absolute z-40 left-0 right-0 mt-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 space-y-1.5">
                          {/* Search Input */}
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={nationSearch}
                              onChange={(e) => setNationSearch(e.target.value)}
                              placeholder="Search 211 FIFA associations..."
                              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
                              autoFocus
                            />
                          </div>

                          {/* Filtered 211 Associations List */}
                          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 text-xs">
                            {filteredAssociations.length > 0 ? (
                              filteredAssociations.map((assoc) => (
                                <button
                                  key={assoc.code}
                                  type="button"
                                  onClick={() => handleSelectNation(assoc)}
                                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-left text-slate-200 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-base leading-none">{assoc.flag}</span>
                                    <span>{assoc.name}</span>
                                  </div>
                                  <span className="font-mono text-[10px] font-bold text-amber-400/80">
                                    {assoc.code}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="text-center py-3 text-slate-500 text-xs">
                                No association found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Optional Free-Text Club Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Club (Optional)
                    </label>
                    {player.club && (
                      <button
                        type="button"
                        onClick={() => setPlayer({ ...player, club: '' })}
                        className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={player.club}
                    onChange={(e) => setPlayer({ ...player, club: e.target.value })}
                    placeholder="Enter club name (optional)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00ff87] text-sm"
                  />
                </div>
              </div>

              {/* Physical Profile: Age, Height, Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Age
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

              {/* Preferred Foot, Weak Foot, Skill Moves */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
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
            <div className="space-y-4 rounded-2xl bg-slate-950/50 p-5 border border-slate-800 shadow-futuristic">
              <ArchetypeSelector
                onSelect={handleSelectArchetype}
                activeId={activeArchetype}
              />
            </div>
          )}

          {/* Scout Rating Trigger Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00ff87]" />
                Scout Rating
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#00ff87]/15 text-[#00ff87] border border-[#00ff87]/30">
                Official Scouting
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Scout your player's attributes to reveal their official overall rating and complete the card.
            </p>

            {scoutMessage && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                  scoutMessage.type === 'success'
                    ? 'bg-[#00ff87]/10 border-[#00ff87]/40 text-[#00ff87]'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                }`}
              >
                {scoutMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{scoutMessage.text}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleScoutPlayer}
              disabled={isAnalyzing}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm tracking-wider uppercase bg-[#00ff87] hover:bg-[#00ff87]/90 active:scale-[0.99] text-slate-950 shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Scouting Player…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{predictedOverall !== null ? 'Re-Scout This Player' : 'Scout This Player'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live FUT Card Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 shadow-futuristic flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
                Live Card View
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                EA FC Gold Edition
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
