import { Trophy, Gamepad2, Medal } from 'lucide-react';
import type { CharacterClass } from '@/types/game';
import { CharacterIcon } from '@/components/matches/CharacterIcon';

interface PlayerStat {
  id: string;
  name: string;
  gamesPlayed: number;
  wins: number;
  winRate: number;
  favoriteCharacter: CharacterClass | null;
}

interface PlayerLeaderboardProps {
  data: PlayerStat[];
}

const medals = ['🥇', '🥈', '🥉'];

export function PlayerLeaderboard({ data }: PlayerLeaderboardProps) {
  return (
    <div className="space-y-2">
      {data.map((player, index) => (
        <div
          key={player.id}
          className="flex items-center justify-between p-3 bg-muted rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg w-6 text-center">
              {index < 3 ? medals[index] : `#${index + 1}`}
            </span>
            <div>
              <p className="font-medium">{player.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Gamepad2 className="h-3 w-3" />
                  {player.gamesPlayed} games
                </span>
                {player.favoriteCharacter && (
                  <span className="flex items-center gap-1">
                    <CharacterIcon
                      character={player.favoriteCharacter}
                      className="h-3 w-3"
                    />
                    {player.favoriteCharacter}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              {player.winRate.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {player.wins}W / {player.gamesPlayed - player.wins}L
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
