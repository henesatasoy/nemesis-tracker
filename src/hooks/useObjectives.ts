import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  ObjectiveCatalog, 
  PlayerObjective, 
  PlayerObjectiveWithDetails,
  ObjectiveType,
  ObjectiveStatus 
} from '@/types/game';

// Fetch all objectives from catalog
export function useObjectivesCatalog(playerCount?: number) {
  return useQuery({
    queryKey: ['objectives-catalog', playerCount],
    queryFn: async (): Promise<ObjectiveCatalog[]> => {
      let query = supabase
        .from('objectives_catalog')
        .select('*')
        .order('type')
        .order('title');

      if (playerCount) {
        query = query
          .lte('min_players', playerCount)
          .gte('max_players', playerCount);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((obj) => ({
        ...obj,
        type: obj.type as ObjectiveType,
      }));
    },
  });
}

// Fetch objectives by type
export function useObjectivesByType(type: ObjectiveType, playerCount?: number) {
  return useQuery({
    queryKey: ['objectives-catalog', type, playerCount],
    queryFn: async (): Promise<ObjectiveCatalog[]> => {
      let query = supabase
        .from('objectives_catalog')
        .select('*')
        .eq('type', type)
        .order('title');

      if (playerCount) {
        query = query
          .lte('min_players', playerCount)
          .gte('max_players', playerCount);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((obj) => ({
        ...obj,
        type: obj.type as ObjectiveType,
      }));
    },
  });
}

// Fetch player's objectives for a match
export function usePlayerObjectives(matchId: string, playerId: string) {
  return useQuery({
    queryKey: ['player-objectives', matchId, playerId],
    queryFn: async (): Promise<PlayerObjectiveWithDetails[]> => {
      const { data, error } = await supabase
        .from('player_objectives')
        .select(`
          *,
          objectives_catalog (*)
        `)
        .eq('match_id', matchId)
        .eq('player_id', playerId);

      if (error) throw error;
      return (data || []).map((obj) => ({
        ...obj,
        status: obj.status as ObjectiveStatus,
        objectives_catalog: {
          ...obj.objectives_catalog,
          type: obj.objectives_catalog.type as ObjectiveType,
        },
      }));
    },
    enabled: !!matchId && !!playerId,
  });
}

// Assign objectives to a player (for draft phase)
export function useAssignObjectives() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      matchId, 
      playerId, 
      objectiveIds 
    }: { 
      matchId: string; 
      playerId: string; 
      objectiveIds: string[] 
    }) => {
      const inserts = objectiveIds.map((objectiveId) => ({
        match_id: matchId,
        player_id: playerId,
        objective_id: objectiveId,
        status: 'DRAFT' as const,
      }));

      const { error } = await supabase
        .from('player_objectives')
        .insert(inserts);

      if (error) throw error;
    },
    onSuccess: (_, { matchId, playerId }) => {
      queryClient.invalidateQueries({ queryKey: ['player-objectives', matchId, playerId] });
    },
  });
}

// Update objective status (keep/discard, complete/fail)
export function useUpdateObjectiveStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes 
    }: { 
      id: string; 
      status: ObjectiveStatus; 
      notes?: string 
    }) => {
      const { error } = await supabase
        .from('player_objectives')
        .update({ status, notes })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-objectives'] });
    },
  });
}

// Update objective notes
export function useUpdateObjectiveNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('player_objectives')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-objectives'] });
    },
  });
}
