import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Match, MatchWithParticipants, MatchFormData, ParticipantFormData, MapType, GameMode, CharacterClass, ParticipantStatus, EscapeMethod, DeathCause } from '@/types/game';

export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async (): Promise<MatchWithParticipants[]> => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          match_participants (
            *,
            players (*)
          )
        `)
        .order('date_played', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(match => ({
        ...match,
        map_type: match.map_type as MapType,
        game_mode: match.game_mode as GameMode,
        match_participants: (match.match_participants || []).map((p: Record<string, unknown>) => ({
          ...p,
          character_class: p.character_class as CharacterClass,
          status: p.status as ParticipantStatus,
          escape_method: p.escape_method as EscapeMethod | null,
          death_cause: p.death_cause as DeathCause | null,
        })),
      })) as MatchWithParticipants[];
    },
  });
}

export function useRecentMatches(limit: number = 5) {
  return useQuery({
    queryKey: ['matches', 'recent', limit],
    queryFn: async (): Promise<MatchWithParticipants[]> => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          match_participants (
            *,
            players (*)
          )
        `)
        .order('date_played', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map(match => ({
        ...match,
        map_type: match.map_type as MapType,
        game_mode: match.game_mode as GameMode,
        match_participants: (match.match_participants || []).map((p: Record<string, unknown>) => ({
          ...p,
          character_class: p.character_class as CharacterClass,
          status: p.status as ParticipantStatus,
          escape_method: p.escape_method as EscapeMethod | null,
          death_cause: p.death_cause as DeathCause | null,
        })),
      })) as MatchWithParticipants[];
    },
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchData,
      participants,
    }: {
      matchData: MatchFormData;
      participants: ParticipantFormData[];
    }) => {
      // Create the match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .insert({
          date_played: matchData.date_played.toISOString().split('T')[0],
          map_type: matchData.map_type,
          game_mode: matchData.game_mode,
          player_count: participants.length,
          notes: matchData.notes || null,
        })
        .select()
        .single();
      
      if (matchError) throw matchError;

      // Create participants
      const participantInserts = participants.map((p) => ({
        match_id: match.id,
        player_id: p.player_id,
        character_class: p.character_class,
        status: p.status,
        is_winner: p.status === 'Survived' && p.objective_met && p.contingency_passed,
        death_round: p.status === 'Dead' ? p.death_round : null,
        death_cause: p.status === 'Dead' ? p.death_cause : null,
        escape_method: p.status === 'Survived' ? p.escape_method : null,
        objective_met: p.status === 'Survived' ? p.objective_met : null,
        contingency_passed: p.status === 'Survived' ? p.contingency_passed : null,
      }));

      const { error: participantsError } = await supabase
        .from('match_participants')
        .insert(participantInserts);
      
      if (participantsError) throw participantsError;

      return match as Match;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeleteMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
