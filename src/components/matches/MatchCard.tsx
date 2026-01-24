import { format } from 'date-fns';
import { MapPin, Users, Trophy, Skull, Heart, Rocket, Building, Mountain, DoorOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MatchWithParticipants } from '@/types/game';
import { CharacterIcon } from './CharacterIcon';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: MatchWithParticipants;
  showDetails?: boolean;
}

const escapeIcons: Record<string, React.ElementType> = {
  'Isolation Room': Building,
  'CSS Pod': Rocket,
  'Surface Bunker': Mountain,
  'Main Gate': DoorOpen,
};

export function MatchCard({ match, showDetails = false }: MatchCardProps) {
  const winners = match.match_participants.filter((p) => p.is_winner);
  const survivors = match.match_participants.filter((p) => p.status === 'Survived');
  const dead = match.match_participants.filter((p) => p.status === 'Dead');

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={match.map_type === 'Mars Surface' ? 'destructive' : 'secondary'}>
              <MapPin className="h-3 w-3 mr-1" />
              {match.map_type === 'Mars Surface' ? 'Mars' : 'Underground'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {match.game_mode === 'Cooperative' ? 'Co-op' : 'Semi-Coop'}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {format(new Date(match.date_played), 'MMM d, yyyy')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-3">
        {/* Character avatars */}
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          {match.match_participants.map((p) => (
            <div
              key={p.id}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                p.is_winner
                  ? 'bg-success/20 text-success'
                  : p.status === 'Dead'
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <CharacterIcon character={p.character_class} className="h-3 w-3" />
              {showDetails && <span>{p.players.name}</span>}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{match.player_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-warning" />
            <span>{winners.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-success" />
            <span>{survivors.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Skull className="h-4 w-4 text-destructive" />
            <span>{dead.length}</span>
          </div>
        </div>

        {/* Detailed participant info */}
        {showDetails && (
          <div className="mt-4 space-y-2 border-t border-border pt-3">
            {match.match_participants.map((p) => {
              const EscapeIcon = p.escape_method ? escapeIcons[p.escape_method] : null;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <CharacterIcon character={p.character_class} className="h-4 w-4" />
                    <span className="font-medium">{p.players.name}</span>
                    <span className="text-muted-foreground">({p.character_class})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.status === 'Dead' ? (
                      <>
                        <Skull className="h-4 w-4 text-destructive" />
                        <span className="text-xs text-muted-foreground">
                          R{p.death_round} - {p.death_cause}
                        </span>
                      </>
                    ) : (
                      <>
                        {p.is_winner && <Trophy className="h-4 w-4 text-warning" />}
                        {EscapeIcon && <EscapeIcon className="h-4 w-4 text-success" />}
                        <span className="text-xs text-muted-foreground">{p.escape_method}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {match.notes && (
              <p className="text-xs text-muted-foreground italic border-t border-border pt-2 mt-2">
                {match.notes}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
