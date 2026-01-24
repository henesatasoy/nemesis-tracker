-- First create the timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Phase 1: Create Enum Types
CREATE TYPE objective_type AS ENUM ('CORPORATE', 'PERSONAL', 'SOLO_COOP');
CREATE TYPE objective_status AS ENUM ('DRAFT', 'ACTIVE', 'DISCARDED', 'COMPLETED', 'FAILED');
CREATE TYPE contingency_status AS ENUM ('POSSIBLE', 'ELIMINATED', 'SUSPECTED', 'CONFIRMED');
CREATE TYPE lethality_type AS ENUM ('KNOWLEDGE_CHECK', 'LOCATION_CHECK', 'CSS_CHECK', 'GLOBAL_KILL');

-- Phase 2: Create Catalog Tables (static game rules)
CREATE TABLE public.objectives_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type objective_type NOT NULL,
  description TEXT NOT NULL,
  min_players INT NOT NULL DEFAULT 1,
  max_players INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contingencies_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  effect_text TEXT NOT NULL,
  lethality lethality_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phase 3: Create Game State Tables
CREATE TABLE public.player_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  objective_id UUID NOT NULL REFERENCES public.objectives_catalog(id) ON DELETE RESTRICT,
  status objective_status NOT NULL DEFAULT 'DRAFT',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(match_id, player_id, objective_id)
);

CREATE TABLE public.player_contingency_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  contingency_id UUID NOT NULL REFERENCES public.contingencies_catalog(id) ON DELETE RESTRICT,
  status contingency_status NOT NULL DEFAULT 'POSSIBLE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(match_id, player_id, contingency_id)
);

CREATE TABLE public.session_contingencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE UNIQUE,
  active_contingency_id UUID REFERENCES public.contingencies_catalog(id) ON DELETE SET NULL,
  is_revealed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.objectives_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contingencies_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_contingency_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_contingencies ENABLE ROW LEVEL SECURITY;

-- Catalog tables are public read (static game data)
CREATE POLICY "Anyone can read objectives catalog"
  ON public.objectives_catalog FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read contingencies catalog"
  ON public.contingencies_catalog FOR SELECT
  USING (true);

-- Player objectives: allow all operations (no auth in this app currently)
CREATE POLICY "Allow all operations on player_objectives"
  ON public.player_objectives FOR ALL
  USING (true)
  WITH CHECK (true);

-- Player contingency knowledge: allow all operations
CREATE POLICY "Allow all operations on player_contingency_knowledge"
  ON public.player_contingency_knowledge FOR ALL
  USING (true)
  WITH CHECK (true);

-- Session contingencies: allow all operations
CREATE POLICY "Allow all operations on session_contingencies"
  ON public.session_contingencies FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_player_objectives_match ON public.player_objectives(match_id);
CREATE INDEX idx_player_objectives_player ON public.player_objectives(player_id);
CREATE INDEX idx_player_contingency_match ON public.player_contingency_knowledge(match_id);
CREATE INDEX idx_player_contingency_player ON public.player_contingency_knowledge(player_id);
CREATE INDEX idx_session_contingencies_match ON public.session_contingencies(match_id);

-- Trigger for updated_at timestamps
CREATE TRIGGER update_player_objectives_updated_at
  BEFORE UPDATE ON public.player_objectives
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_player_contingency_knowledge_updated_at
  BEFORE UPDATE ON public.player_contingency_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_contingencies_updated_at
  BEFORE UPDATE ON public.session_contingencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();