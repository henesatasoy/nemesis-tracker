// Nemesis: Lockdown Game Types

export type MapType = 'Underground Facility' | 'Mars Surface';
export type GameMode = 'Normal (Semi-Coop)' | 'Cooperative';
export type CharacterClass = 'Sentinel' | 'Hacker' | 'Janitor' | 'Lab Rat' | 'Survivor' | 'Xenobiologist';
export type ParticipantStatus = 'Survived' | 'Dead';
export type EscapeMethod = 'Isolation Room' | 'CSS Pod' | 'Surface Bunker' | 'Main Gate';
export type DeathCause = 
  | 'Intruder Attack' 
  | 'Larva/Contamination' 
  | 'Bleeding/Wounds' 
  | 'Fire' 
  | 'Facility Self-Destruct' 
  | 'Time Limit' 
  | 'Friendly Fire' 
  | 'Contingency Procedure' 
  | 'Event Card';

// Database row types
export interface Player {
  id: string;
  name: string;
  created_at: string;
}

export interface Match {
  id: string;
  date_played: string;
  map_type: MapType;
  game_mode: GameMode;
  player_count: number;
  notes: string | null;
  created_at: string;
}

export interface MatchParticipant {
  id: string;
  match_id: string;
  player_id: string;
  character_class: CharacterClass;
  status: ParticipantStatus;
  is_winner: boolean;
  death_round: number | null;
  death_cause: DeathCause | null;
  escape_method: EscapeMethod | null;
  objective_met: boolean | null;
  contingency_passed: boolean | null;
  created_at: string;
}

// Extended types with relations
export interface MatchWithParticipants extends Match {
  match_participants: (MatchParticipant & { players: Player })[];
}

export interface ParticipantWithPlayer extends MatchParticipant {
  players: Player;
}

// Form types for the wizard
export interface MatchFormData {
  date_played: Date;
  map_type: MapType;
  game_mode: GameMode;
  notes: string;
}

export interface ParticipantFormData {
  player_id: string;
  character_class: CharacterClass;
  status: ParticipantStatus;
  death_round?: number;
  death_cause?: DeathCause;
  escape_method?: EscapeMethod;
  objective_met?: boolean;
  contingency_passed?: boolean;
}

// Constants for dropdowns
export const MAP_TYPES: MapType[] = ['Underground Facility', 'Mars Surface'];
export const GAME_MODES: GameMode[] = ['Normal (Semi-Coop)', 'Cooperative'];
export const CHARACTER_CLASSES: CharacterClass[] = [
  'Sentinel',
  'Hacker',
  'Janitor',
  'Lab Rat',
  'Survivor',
  'Xenobiologist',
];
export const ESCAPE_METHODS: EscapeMethod[] = [
  'Isolation Room',
  'CSS Pod',
  'Surface Bunker',
  'Main Gate',
];
export const DEATH_CAUSES: DeathCause[] = [
  'Intruder Attack',
  'Larva/Contamination',
  'Bleeding/Wounds',
  'Fire',
  'Facility Self-Destruct',
  'Time Limit',
  'Friendly Fire',
  'Contingency Procedure',
  'Event Card',
];

// Character icons mapping (Lucide icon names)
export const CHARACTER_ICONS: Record<CharacterClass, string> = {
  'Sentinel': 'Shield',
  'Hacker': 'Terminal',
  'Janitor': 'Wrench',
  'Lab Rat': 'FlaskConical',
  'Survivor': 'Heart',
  'Xenobiologist': 'Bug',
};

// Character colors for charts
export const CHARACTER_COLORS: Record<CharacterClass, string> = {
  'Sentinel': 'hsl(var(--chart-1))',
  'Hacker': 'hsl(var(--chart-3))',
  'Janitor': 'hsl(var(--chart-4))',
  'Lab Rat': 'hsl(var(--chart-5))',
  'Survivor': 'hsl(var(--chart-2))',
  'Xenobiologist': 'hsl(var(--chart-6))',
};
