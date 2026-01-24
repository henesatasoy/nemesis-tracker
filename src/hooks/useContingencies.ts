import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  ContingencyCatalog, 
  PlayerContingencyKnowledge,
  PlayerContingencyWithDetails,
  SessionContingency,
  ContingencyStatus,
  LethalityType,
  CONTINGENCY_STATUS_ORDER
} from '@/types/game';

// Fetch all contingencies from catalog
export function useContingenciesCatalog() {
  return useQuery({
    queryKey: ['contingencies-catalog'],
    queryFn: async (): Promise<ContingencyCatalog[]> => {
      const { data, error } = await supabase
        .from('contingencies_catalog')
        .select('*')
        .order('name');

      if (error) throw error;
      return (data || []).map((c) => ({
        ...c,
        lethality: c.lethality as LethalityType,
      }));
    },
  });
}

// Fetch player's contingency knowledge for a match
export function usePlayerContingencyKnowledge(matchId: string, playerId: string) {
  return useQuery({
    queryKey: ['player-contingency-knowledge', matchId, playerId],
    queryFn: async (): Promise<PlayerContingencyWithDetails[]> => {
      const { data, error } = await supabase
        .from('player_contingency_knowledge')
        .select(`
          *,
          contingencies_catalog (*)
        `)
        .eq('match_id', matchId)
        .eq('player_id', playerId);

      if (error) throw error;
      return (data || []).map((k) => ({
        ...k,
        status: k.status as ContingencyStatus,
        contingencies_catalog: {
          ...k.contingencies_catalog,
          lethality: k.contingencies_catalog.lethality as LethalityType,
        },
      }));
    },
    enabled: !!matchId && !!playerId,
  });
}

// Initialize contingency tracking for a player (creates entries for all contingencies)
export function useInitializeContingencyTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, playerId }: { matchId: string; playerId: string }) => {
      // First get all contingencies
      const { data: contingencies, error: fetchError } = await supabase
        .from('contingencies_catalog')
        .select('id');

      if (fetchError) throw fetchError;

      // Create knowledge entries for each contingency
      const inserts = (contingencies || []).map((c) => ({
        match_id: matchId,
        player_id: playerId,
        contingency_id: c.id,
        status: 'POSSIBLE' as const,
      }));

      const { error } = await supabase
        .from('player_contingency_knowledge')
        .insert(inserts);

      if (error) throw error;
    },
    onSuccess: (_, { matchId, playerId }) => {
      queryClient.invalidateQueries({ queryKey: ['player-contingency-knowledge', matchId, playerId] });
    },
  });
}

// Update contingency status (cycle through states)
export function useUpdateContingencyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContingencyStatus }) => {
      const { error } = await supabase
        .from('player_contingency_knowledge')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-contingency-knowledge'] });
    },
  });
}

// Session contingency (the "truth")
export function useSessionContingency(matchId: string) {
  return useQuery({
    queryKey: ['session-contingency', matchId],
    queryFn: async (): Promise<SessionContingency | null> => {
      const { data, error } = await supabase
        .from('session_contingencies')
        .select('*')
        .eq('match_id', matchId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });
}

// Set the active contingency for a session
export function useSetSessionContingency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      matchId, 
      contingencyId 
    }: { 
      matchId: string; 
      contingencyId: string 
    }) => {
      // Upsert - create or update
      const { error } = await supabase
        .from('session_contingencies')
        .upsert({
          match_id: matchId,
          active_contingency_id: contingencyId,
          is_revealed: false,
        }, {
          onConflict: 'match_id',
        });

      if (error) throw error;
    },
    onSuccess: (_, { matchId }) => {
      queryClient.invalidateQueries({ queryKey: ['session-contingency', matchId] });
    },
  });
}

// Reveal the active contingency
export function useRevealContingency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase
        .from('session_contingencies')
        .update({ is_revealed: true })
        .eq('match_id', matchId);

      if (error) throw error;
    },
    onSuccess: (_, matchId) => {
      queryClient.invalidateQueries({ queryKey: ['session-contingency', matchId] });
    },
  });
}
