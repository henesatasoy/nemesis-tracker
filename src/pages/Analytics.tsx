import { BarChart3, PieChart, Map, Users, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCharacterStats, useDeathStats, useMapStats, usePlayerStats } from '@/hooks/useStats';
import { Skeleton } from '@/components/ui/skeleton';
import { CharacterWinRateChart } from '@/components/charts/CharacterWinRateChart';
import { DeathCausePieChart } from '@/components/charts/DeathCausePieChart';
import { MapComparisonCard } from '@/components/charts/MapComparisonCard';
import { PlayerLeaderboard } from '@/components/charts/PlayerLeaderboard';

export default function Analytics() {
  const { data: characterStats, isLoading: charLoading } = useCharacterStats();
  const { data: deathStats, isLoading: deathLoading } = useDeathStats();
  const { data: mapStats, isLoading: mapLoading } = useMapStats();
  const { data: playerStats, isLoading: playerLoading } = usePlayerStats();

  const hasAnyData = characterStats?.some((c) => c.gamesPlayed > 0);

  if (!hasAnyData && !charLoading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <Card className="p-8 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No match data yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Log some matches to see your statistics!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Character Win Rates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-primary" />
            Character Win Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {charLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <CharacterWinRateChart data={characterStats || []} />
          )}
        </CardContent>
      </Card>

      {/* Death Causes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <PieChart className="h-5 w-5 text-destructive" />
            Deadliness Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deathLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : deathStats && deathStats.length > 0 ? (
            <DeathCausePieChart data={deathStats} />
          ) : (
            <p className="text-center text-muted-foreground py-8">No deaths recorded yet!</p>
          )}
        </CardContent>
      </Card>

      {/* Map Balance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Map className="h-5 w-5 text-chart-3" />
            Map Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mapLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <MapComparisonCard data={mapStats || []} />
          )}
        </CardContent>
      </Card>

      {/* Player Leaderboard */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-chart-4" />
            Player Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {playerLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : playerStats && playerStats.length > 0 ? (
            <PlayerLeaderboard data={playerStats} />
          ) : (
            <p className="text-center text-muted-foreground py-8">No player data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
