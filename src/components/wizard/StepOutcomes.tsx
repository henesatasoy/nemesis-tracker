import { Skull, Heart, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Player, ParticipantFormData, DeathCause, EscapeMethod } from '@/types/game';
import { DEATH_CAUSES, ESCAPE_METHODS } from '@/types/game';
import { CharacterIcon } from '@/components/matches/CharacterIcon';
import { cn } from '@/lib/utils';

interface StepOutcomesProps {
  participants: ParticipantFormData[];
  players: Player[];
  onChange: (participants: ParticipantFormData[]) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function StepOutcomes({
  participants,
  players,
  onChange,
  onNext,
  onBack,
  canProceed,
}: StepOutcomesProps) {
  const updateParticipant = (index: number, updates: Partial<ParticipantFormData>) => {
    onChange(
      participants.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const getPlayerName = (playerId: string) =>
    players.find((p) => p.id === playerId)?.name || 'Unknown';

  const toggleStatus = (index: number) => {
    const current = participants[index];
    const newStatus = current.status === 'Survived' ? 'Dead' : 'Survived';
    
    updateParticipant(index, {
      status: newStatus,
      // Reset conditional fields
      death_round: undefined,
      death_cause: undefined,
      escape_method: undefined,
      objective_met: undefined,
      contingency_passed: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Match Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {participants.map((participant, index) => {
            const isWinner =
              participant.status === 'Survived' &&
              participant.objective_met &&
              participant.contingency_passed;

            return (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  participant.status === 'Dead'
                    ? 'border-destructive/50 bg-destructive/10'
                    : isWinner
                    ? 'border-success/50 bg-success/10'
                    : 'border-border bg-muted'
                )}
              >
                {/* Player header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CharacterIcon
                      character={participant.character_class}
                      className="h-5 w-5"
                    />
                    <span className="font-medium">
                      {getPlayerName(participant.player_id)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({participant.character_class})
                    </span>
                  </div>
                  {isWinner && <Trophy className="h-5 w-5 text-warning" />}
                </div>

                {/* Status toggle */}
                <div className="flex gap-2 mb-3">
                  <Button
                    type="button"
                    variant={participant.status === 'Survived' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleStatus(index)}
                    className={cn(
                      participant.status === 'Survived' && 'bg-success hover:bg-success/90'
                    )}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Survived
                  </Button>
                  <Button
                    type="button"
                    variant={participant.status === 'Dead' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleStatus(index)}
                    className={cn(
                      participant.status === 'Dead' && 'bg-destructive hover:bg-destructive/90'
                    )}
                  >
                    <Skull className="h-4 w-4 mr-1" />
                    Dead
                  </Button>
                </div>

                {/* Conditional fields */}
                {participant.status === 'Dead' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Death Round</Label>
                        <Input
                          type="number"
                          min={1}
                          max={15}
                          placeholder="Round"
                          value={participant.death_round || ''}
                          onChange={(e) =>
                            updateParticipant(index, {
                              death_round: parseInt(e.target.value) || undefined,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Death Cause</Label>
                        <Select
                          value={participant.death_cause || ''}
                          onValueChange={(value) =>
                            updateParticipant(index, {
                              death_cause: value as DeathCause,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select cause" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEATH_CAUSES.map((cause) => (
                              <SelectItem key={cause} value={cause}>
                                {cause}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Escape Method</Label>
                      <Select
                        value={participant.escape_method || ''}
                        onValueChange={(value) =>
                          updateParticipant(index, {
                            escape_method: value as EscapeMethod,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="How did they escape?" />
                        </SelectTrigger>
                        <SelectContent>
                          {ESCAPE_METHODS.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`objective-${index}`}
                          checked={participant.objective_met || false}
                          onCheckedChange={(checked) =>
                            updateParticipant(index, {
                              objective_met: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor={`objective-${index}`} className="text-sm">
                          Personal Objective Met
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`contingency-${index}`}
                          checked={participant.contingency_passed || false}
                          onCheckedChange={(checked) =>
                            updateParticipant(index, {
                              contingency_passed: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor={`contingency-${index}`} className="text-sm">
                          Contingency Passed
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 h-12 text-lg"
        >
          Review Match
        </Button>
      </div>
    </div>
  );
}
