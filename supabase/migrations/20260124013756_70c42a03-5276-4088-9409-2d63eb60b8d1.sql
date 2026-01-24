-- Create custom enum types for Nemesis: Lockdown
CREATE TYPE map_type AS ENUM ('Underground Facility', 'Mars Surface');
CREATE TYPE game_mode AS ENUM ('Normal (Semi-Coop)', 'Cooperative');
CREATE TYPE character_class AS ENUM ('Sentinel', 'Hacker', 'Janitor', 'Lab Rat', 'Survivor', 'Xenobiologist');
CREATE TYPE participant_status AS ENUM ('Survived', 'Dead');
CREATE TYPE escape_method AS ENUM ('Isolation Room', 'CSS Pod', 'Surface Bunker', 'Main Gate');
CREATE TYPE death_cause AS ENUM ('Intruder Attack', 'Larva/Contamination', 'Bleeding/Wounds', 'Fire', 'Facility Self-Destruct', 'Time Limit', 'Friendly Fire', 'Contingency Procedure', 'Event Card');

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date_played DATE NOT NULL DEFAULT CURRENT_DATE,
  map_type map_type NOT NULL DEFAULT 'Underground Facility',
  game_mode game_mode NOT NULL DEFAULT 'Normal (Semi-Coop)',
  player_count INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create match_participants table (join table)
CREATE TABLE public.match_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  character_class character_class NOT NULL,
  status participant_status NOT NULL DEFAULT 'Survived',
  is_winner BOOLEAN NOT NULL DEFAULT false,
  -- Death fields (nullable, used when status = 'Dead')
  death_round INTEGER,
  death_cause death_cause,
  -- Survival fields (nullable, used when status = 'Survived')
  escape_method escape_method,
  objective_met BOOLEAN,
  contingency_passed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Ensure a player can only appear once per match
  UNIQUE(match_id, player_id)
);

-- Enable Row Level Security (allowing all operations for personal tracker - no auth)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (personal tracker, no auth required)
CREATE POLICY "Allow all operations on players" ON public.players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on matches" ON public.matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on match_participants" ON public.match_participants FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_matches_date ON public.matches(date_played DESC);
CREATE INDEX idx_match_participants_match ON public.match_participants(match_id);
CREATE INDEX idx_match_participants_player ON public.match_participants(player_id);
CREATE INDEX idx_match_participants_character ON public.match_participants(character_class);