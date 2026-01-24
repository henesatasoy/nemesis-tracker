import { format } from 'date-fns';
import { Check, MapPin, CalendarIcon, Trophy, Skull, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Player, MatchFormData, ParticipantFormData } from '@/types/game';
import { CharacterIcon } from '@/components/matches/CharacterIcon';
import { cn } from '@/lib/utils';

interface StepSummaryProps {
  matchData: MatchFormData;
  participants: ParticipantFormData[];
  players: Player[];
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export function StepSummary({
  matchData,
  participants,
  players,
  onBack,
  onSave,
  isSaving,
}: StepSummaryProps) {
  const getPlayerName = (playerId: string) =>
    players.find((p) => p.id === playerId)?.name || 'Unknown';

  const winners = participants.filter(
    (p) =>
      p.status === 'Survived' && p.objective_met && p.contingency_passed
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            Review Match
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Match Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{format(matchData.date_played, 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{matchData.map_type}</span>
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              Mode: {matchData.game_mode}
            </div>
          </div>

          {/* Winners */}
          {winners.length > 0 && (
            <div className="p-3 bg-success/20 border border-success/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-warning" />
                <span className="font-medium text-success">Winners</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {winners.map((p) => (
                  <div
                    key={p.player_id}
                    className="flex items-center gap-1 px-2 py-1 bg-success/20 rounded-full text-sm"
                  >
                    <CharacterIcon character={p.character_class} className="h-4 w-4" />
                    {getPlayerName(p.player_id)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Participants */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">All Participants</h4>
            {participants.map((p) => {
              const isWinner =
                p.status === 'Survived' && p.objective_met && p.contingency_passed;

              return (
                <div
                  key={p.player_id}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-lg',
                    p.status === 'Dead'
                      ? 'bg-destructive/10'
                      : isWinner
                      ? 'bg-success/10'
                      : 'bg-muted'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CharacterIcon character={p.character_class} className="h-4 w-4" />
                    <span className="font-medium">{getPlayerName(p.player_id)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({p.character_class})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {p.status === 'Dead' ? (
                      <>
                        <Skull className="h-4 w-4 text-destructive" />
                        <span className="text-xs text-muted-foreground">
                          R{p.death_round}
                        </span>
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 text-success" />
                        {isWinner && <Trophy className="h-4 w-4 text-warning" />}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          {matchData.notes && (
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-xs text-muted-foreground">Notes:</span>
              <p className="text-sm mt-1">{matchData.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12" disabled={isSaving}>
          Back
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 h-12 text-lg bg-success hover:bg-success/90"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              Save Match
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
