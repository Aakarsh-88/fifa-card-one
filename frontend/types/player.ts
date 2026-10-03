export const POSITIONS = [
  // Attackers
  'ST',
  'CF',
  'RW',
  'LW',
  // Midfielders
  'CAM',
  'CM',
  'CDM',
  'LM',
  'RM',
  // Defenders
  'CB',
  'LB',
  'RB',
  'LWB',
  'RWB',
  // Goalkeepers
  'GK',
] as const;

export type Position = (typeof POSITIONS)[number];

export type PositionCategory = 'ATT' | 'MID' | 'DEF' | 'GK';

export const POSITION_CATEGORIES: Record<Position, PositionCategory> = {
  ST: 'ATT',
  CF: 'ATT',
  RW: 'ATT',
  LW: 'ATT',
  CAM: 'MID',
  CM: 'MID',
  CDM: 'MID',
  LM: 'MID',
  RM: 'MID',
  CB: 'DEF',
  LB: 'DEF',
  RB: 'DEF',
  LWB: 'DEF',
  RWB: 'DEF',
  GK: 'GK',
};

export interface PlayerStats {
  pace: number;        // PAC (or DIV for GK)
  shooting: number;    // SHO (or HAN for GK)
  passing: number;     // PAS (or KIC for GK)
  dribbling: number;   // DRI (or REF for GK)
  defending: number;   // DEF (or SPE for GK)
  physical: number;    // PHY (or POS for GK)
}

export type StatKey = keyof PlayerStats;

export interface StatDefinition {
  key: StatKey;
  label: string;
  gkLabel: string;
  abbreviation: string;
  gkAbbreviation: string;
  description: string;
}

export const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'pace', label: 'Pace', gkLabel: 'Diving', abbreviation: 'PAC', gkAbbreviation: 'DIV', description: 'Sprint speed & acceleration' },
  { key: 'shooting', label: 'Shooting', gkLabel: 'Handling', abbreviation: 'SHO', gkAbbreviation: 'HAN', description: 'Finishing & shot power' },
  { key: 'passing', label: 'Passing', gkLabel: 'Kicking', abbreviation: 'PAS', gkAbbreviation: 'KIC', description: 'Vision, crossing & short/long passing' },
  { key: 'dribbling', label: 'Dribbling', gkLabel: 'Reflexes', abbreviation: 'DRI', gkAbbreviation: 'REF', description: 'Agility, balance & ball control' },
  { key: 'defending', label: 'Defending', gkLabel: 'Speed', abbreviation: 'DEF', gkAbbreviation: 'SPE', description: 'Interceptions, marking & tackling' },
  { key: 'physical', label: 'Physicality', gkLabel: 'Positioning', abbreviation: 'PHY', gkAbbreviation: 'POS', description: 'Strength, stamina & jumping' },
];

export type WorkRate = 'Low' | 'Medium' | 'High';
export type PreferredFoot = 'Right' | 'Left';

export interface PlayerProfile {
  name: string;
  position: Position;
  nation: string;
  club: string;
  league: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  preferredFoot: PreferredFoot;
  weakFoot: number; // 1-5
  skillMoves: number; // 1-5
  workRateAttacking: WorkRate;
  workRateDefensive: WorkRate;
  stats: PlayerStats;
  avatarUrl?: string;
  cardTheme?: 'fut-gold' | 'cyber-lime' | 'totw' | 'icon';
}

export interface PlayerArchetype {
  id: string;
  name: string;
  position: Position;
  tagline: string;
  description: string;
  stats: PlayerStats;
}
