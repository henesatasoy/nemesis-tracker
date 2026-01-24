import { Plus, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Player, ParticipantFormData, CharacterClass } from '@/types/game';
import { CHARACTER_CLASSES } from '@/types/game';
import { CharacterIcon } from '@/components/matches/CharacterIcon';

interface StepSelectPlayersProps {
  players: Player[];
  participants: ParticipantFormData[];
  onChange: (participants: ParticipantFormData[]) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function StepSelectPlayers({
  players,
  participants,
  onChange,
  onNext,
  onBack,
  canProceed,
}: StepSelectPlayersProps) {
  const availablePlayers = players.filter(
    (p) => !participants.some((part) => part.player_id === p.id)
  );

  const usedCharacters = participants.map((p) => p.character_class);

  const addParticipant = () => {
    if (availablePlayers.length === 0) return;
    
    const availableChars = CHARACTER_CLASSES.filter(
      (c) => !usedCharacters.includes(c)
    );
    
    onChange([
      ...participants,
      {
        player_id: availablePlayers[0].id,
        character_class: availableChars[0] || 'Sentinel',
        status: 'Survived',
      },
    ]);
  };

  const removeParticipant = (index: number) => {
    onChange(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, updates: Partial<ParticipantFormData>) => {
    onChange(
      participants.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const getPlayerName = (playerId: string) =>
    players.find((p) => p.id === playerId)?.name || 'Unknown';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Select Players ({participants.length}/5)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {players.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-2">No players added yet</p>
              <p className="text-sm text-muted-foreground">
                Go to the Players page to add your gaming group
              </p>
            </div>
          ) : (
            <>
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Select
                      value={participant.player_id}
                      onValueChange={(value) =>
                        updateParticipant(index, { player_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Player" />
                      </SelectTrigger>
                      <SelectContent>
                        {players
                          .filter(
                            (p) =>
                              p.id === participant.player_id ||
                              !participants.some((part) => part.player_id === p.id)
                          )
                          .map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={participant.character_class}
                      onValueChange={(value) =>
                        updateParticipant(index, {
                          character_class: value as CharacterClass,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Character" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHARACTER_CLASSES.map((char) => (
                          <SelectItem
                            key={char}
                            value={char}
                            disabled={
                              usedCharacters.includes(char) &&
                              participant.character_class !== char
                            }
                          >
                            <div className="flex items-center gap-2">
                              <CharacterIcon character={char} className="h-4 w-4" />
                              {char}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParticipant(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {participants.length < 5 && availablePlayers.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addParticipant}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Player
                </Button>
              )}
            </>
          )}
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
          Next: Outcomes
        </Button>
      </div>
    </div>
  );
}
