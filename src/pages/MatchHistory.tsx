import { useState, useMemo } from 'react';
import { History as HistoryIcon, Trash2, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMatches, useDeleteMatch } from '@/hooks/useMatches';
import { usePlayers } from '@/hooks/usePlayers';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchFilters, FilterState } from '@/components/matches/MatchFilters';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import type { MatchWithParticipants } from '@/types/game';

const defaultFilters: FilterState = {
  mapType: null,
  gameMode: null,
  playerId: null,
  dateFrom: null,
  dateTo: null,
};

export default function MatchHistory() {
  const { data: matches, isLoading } = useMatches();
  const { data: players } = usePlayers();
  const deleteMatch = useDeleteMatch();

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== null).length;
  }, [filters]);

  const filteredMatches = useMemo(() => {
    if (!matches) return [];

    return matches.filter((match) => {
      // Map filter
      if (filters.mapType && match.map_type !== filters.mapType) {
        return false;
      }

      // Mode filter
      if (filters.gameMode && match.game_mode !== filters.gameMode) {
        return false;
      }

      // Player filter
      if (filters.playerId) {
        const hasPlayer = match.match_participants.some(
          (p) => p.player_id === filters.playerId
        );
        if (!hasPlayer) return false;
      }

      // Date range filter
      const matchDate = new Date(match.date_played);
      if (filters.dateFrom && matchDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo) {
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (matchDate > endOfDay) {
          return false;
        }
      }

      return true;
    });
  }, [matches, filters]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMatch.mutateAsync(id);
      toast.success('Match deleted');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete match';
      toast.error(message);
    }
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-slide-up">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="animate-slide-up">
        <Card className="p-8 text-center">
          <HistoryIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No match history</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your logged matches will appear here
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredMatches.length} of {matches.length} matches
        </p>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader className="pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle>Filter Matches</SheetTitle>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </SheetHeader>
            <MatchFilters
              filters={filters}
              onChange={setFilters}
              players={players || []}
              onApply={() => setIsFilterOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.mapType && (
            <Badge variant="secondary" className="gap-1">
              {filters.mapType === 'Mars Surface' ? '🔴 Mars' : '🏢 Underground'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, mapType: null })}
              />
            </Badge>
          )}
          {filters.gameMode && (
            <Badge variant="secondary" className="gap-1">
              {filters.gameMode === 'Cooperative' ? '🤝 Co-op' : '🎭 Semi-Coop'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, gameMode: null })}
              />
            </Badge>
          )}
          {filters.playerId && (
            <Badge variant="secondary" className="gap-1">
              {players?.find((p) => p.id === filters.playerId)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, playerId: null })}
              />
            </Badge>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="gap-1">
              {filters.dateFrom && format(filters.dateFrom, 'MMM d')}
              {filters.dateFrom && filters.dateTo && ' - '}
              {filters.dateTo && format(filters.dateTo, 'MMM d')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, dateFrom: null, dateTo: null })}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Match List */}
      {filteredMatches.length === 0 ? (
        <Card className="p-8 text-center">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No matches match your filters</p>
          <Button variant="link" onClick={clearFilters} className="mt-2">
            Clear filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => (
            <div key={match.id} className="relative">
              <MatchCard match={match} showDetails />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Match?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this match and all participant data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(match.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
