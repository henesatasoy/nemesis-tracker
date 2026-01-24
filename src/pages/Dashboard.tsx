import { Link } from 'react-router-dom';
import { PlusCircle, Trophy, Gamepad2, Skull, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGlobalStats } from '@/hooks/useStats';
import { useRecentMatches } from '@/hooks/useMatches';
import { MatchCard } from '@/components/matches/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGlobalStats();
  const { data: recentMatches, isLoading: matchesLoading } = useRecentMatches(5);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="col-span-2 bg-gradient-to-br from-primary/20 to-card border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              Global Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <p className="text-4xl font-bold text-primary">
                {stats?.globalWinRate.toFixed(1)}%
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-bold">{stats?.totalMatches}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-success" />
              <Skull className="h-4 w-4 text-destructive" />
              S / D
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">
                <span className="text-success">{stats?.totalSurvivors}</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-destructive">{stats?.totalDeaths}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      <Link to="/log">
        <Button size="lg" className="w-full h-14 text-lg font-semibold gap-2 shadow-lg shadow-primary/30">
          <PlusCircle className="h-6 w-6" />
          Log New Match
        </Button>
      </Link>

      {/* Recent Matches */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Matches</h2>
          <Link to="/history" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>

        {matchesLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : recentMatches && recentMatches.length > 0 ? (
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No matches logged yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start by logging your first game!
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
