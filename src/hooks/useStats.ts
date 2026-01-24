import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CharacterClass, DeathCause, MapType } from '@/types/game';
import { CHARACTER_CLASSES } from '@/types/game';

interface GlobalStats {
  totalMatches: number;
  totalGamesPlayed: number;
  globalWinRate: number;
  totalSurvivors: number;
  totalDeaths: number;
}

interface CharacterStats {
  character: CharacterClass;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

interface DeathStats {
  cause: DeathCause;
  count: number;
  percentage: number;
}

interface MapStats {
  map: MapType;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

interface PlayerStats {
  id: string;
  name: string;
  gamesPlayed: number;
  wins: number;
  winRate: number;
  favoriteCharacter: CharacterClass | null;
}

export function useGlobalStats() {
  return useQuery({
    queryKey: ['stats', 'global'],
    queryFn: async (): Promise<GlobalStats> => {
      const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select('id');
      
      if (matchError) throw matchError;

      const { data: participants, error: participantError } = await supabase
        .from('match_participants')
        .select('status, is_winner');
      
      if (participantError) throw participantError;

      const totalMatches = matches?.length || 0;
      const totalGamesPlayed = participants?.length || 0;
      const totalSurvivors = participants?.filter(p => p.status === 'Survived').length || 0;
      const totalDeaths = participants?.filter(p => p.status === 'Dead').length || 0;
      const totalWins = participants?.filter(p => p.is_winner).length || 0;
      const globalWinRate = totalGamesPlayed > 0 ? (totalWins / totalGamesPlayed) * 100 : 0;

      return {
        totalMatches,
        totalGamesPlayed,
        globalWinRate,
        totalSurvivors,
        totalDeaths,
      };
    },
  });
}

export function useCharacterStats() {
  return useQuery({
    queryKey: ['stats', 'characters'],
    queryFn: async (): Promise<CharacterStats[]> => {
      const { data, error } = await supabase
        .from('match_participants')
        .select('character_class, is_winner');
      
      if (error) throw error;

      const statsMap = new Map<CharacterClass, { games: number; wins: number }>();
      
      CHARACTER_CLASSES.forEach(char => {
        statsMap.set(char, { games: 0, wins: 0 });
      });

      data?.forEach(p => {
        const char = p.character_class as CharacterClass;
        const current = statsMap.get(char)!;
        current.games++;
        if (p.is_winner) current.wins++;
      });

      return CHARACTER_CLASSES.map(char => {
        const stats = statsMap.get(char)!;
        return {
          character: char,
          gamesPlayed: stats.games,
          wins: stats.wins,
          winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
        };
      });
    },
  });
}

export function useDeathStats() {
  return useQuery({
    queryKey: ['stats', 'deaths'],
    queryFn: async (): Promise<DeathStats[]> => {
      const { data, error } = await supabase
        .from('match_participants')
        .select('death_cause')
        .eq('status', 'Dead')
        .not('death_cause', 'is', null);
      
      if (error) throw error;

      const causeCounts = new Map<DeathCause, number>();
      
      data?.forEach(p => {
        const cause = p.death_cause as DeathCause;
        causeCounts.set(cause, (causeCounts.get(cause) || 0) + 1);
      });

      const total = data?.length || 0;

      return Array.from(causeCounts.entries())
        .map(([cause, count]) => ({
          cause,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);
    },
  });
}

export function useMapStats() {
  return useQuery({
    queryKey: ['stats', 'maps'],
    queryFn: async (): Promise<MapStats[]> => {
      const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select(`
          id,
          map_type,
          match_participants (is_winner)
        `);
      
      if (matchError) throw matchError;

      const mapStats = new Map<MapType, { games: number; wins: number }>();
      mapStats.set('Underground Facility', { games: 0, wins: 0 });
      mapStats.set('Mars Surface', { games: 0, wins: 0 });

      matches?.forEach(match => {
        const map = match.map_type as MapType;
        const current = mapStats.get(map)!;
        const participants = match.match_participants as { is_winner: boolean }[];
        current.games += participants.length;
        current.wins += participants.filter(p => p.is_winner).length;
      });

      return Array.from(mapStats.entries()).map(([map, stats]) => ({
        map,
        gamesPlayed: stats.games,
        wins: stats.wins,
        winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
      }));
    },
  });
}

interface EscapeStats {
  method: string;
  count: number;
  percentage: number;
}

export function useEscapeStats() {
  return useQuery({
    queryKey: ['stats', 'escapes'],
    queryFn: async (): Promise<EscapeStats[]> => {
      const { data, error } = await supabase
        .from('match_participants')
        .select('escape_method')
        .eq('status', 'Survived')
        .not('escape_method', 'is', null);
      
      if (error) throw error;

      const methodCounts = new Map<string, number>();
      
      data?.forEach(p => {
        const method = p.escape_method as string;
        methodCounts.set(method, (methodCounts.get(method) || 0) + 1);
      });

      const total = data?.length || 0;

      return Array.from(methodCounts.entries())
        .map(([method, count]) => ({
          method,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);
    },
  });
}

export function usePlayerStats() {
  return useQuery({
    queryKey: ['stats', 'players'],
    queryFn: async (): Promise<PlayerStats[]> => {
      const { data: players, error: playerError } = await supabase
        .from('players')
        .select('id, name');
      
      if (playerError) throw playerError;

      const { data: participants, error: participantError } = await supabase
        .from('match_participants')
        .select('player_id, character_class, is_winner');
      
      if (participantError) throw participantError;

      const playerStatsMap = new Map<string, {
        games: number;
        wins: number;
        characters: Map<CharacterClass, number>;
      }>();

      players?.forEach(p => {
        playerStatsMap.set(p.id, { games: 0, wins: 0, characters: new Map() });
      });

      participants?.forEach(p => {
        const stats = playerStatsMap.get(p.player_id);
        if (stats) {
          stats.games++;
          if (p.is_winner) stats.wins++;
          const char = p.character_class as CharacterClass;
          stats.characters.set(char, (stats.characters.get(char) || 0) + 1);
        }
      });

      return (players || [])
        .map(player => {
          const stats = playerStatsMap.get(player.id)!;
          let favoriteCharacter: CharacterClass | null = null;
          let maxPlays = 0;
          
          stats.characters.forEach((count, char) => {
            if (count > maxPlays) {
              maxPlays = count;
              favoriteCharacter = char;
            }
          });

          return {
            id: player.id,
            name: player.name,
            gamesPlayed: stats.games,
            wins: stats.wins,
            winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
            favoriteCharacter,
          };
        })
        .sort((a, b) => b.winRate - a.winRate);
    },
  });
}
