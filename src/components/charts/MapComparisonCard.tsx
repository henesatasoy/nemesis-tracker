import { Building, Mountain, TrendingUp, Gamepad2 } from 'lucide-react';
import type { MapType } from '@/types/game';

interface MapStat {
  map: MapType;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

interface MapComparisonCardProps {
  data: MapStat[];
}

export function MapComparisonCard({ data }: MapComparisonCardProps) {
  const underground = data.find((d) => d.map === 'Underground Facility');
  const mars = data.find((d) => d.map === 'Mars Surface');

  if (!underground?.gamesPlayed && !mars?.gamesPlayed) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No map data yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Underground */}
      <div className="p-4 bg-secondary rounded-lg text-center">
        <Building className="h-8 w-8 mx-auto mb-2 text-chart-3" />
        <h4 className="font-medium text-sm">Underground</h4>
        <p className="text-2xl font-bold text-chart-3 mt-1">
          {underground?.winRate.toFixed(0) || 0}%
        </p>
        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
          <Gamepad2 className="h-3 w-3" />
          {underground?.gamesPlayed || 0} games
        </div>
      </div>

      {/* Mars */}
      <div className="p-4 bg-destructive/20 rounded-lg text-center border border-destructive/30">
        <Mountain className="h-8 w-8 mx-auto mb-2 text-destructive" />
        <h4 className="font-medium text-sm">Mars Surface</h4>
        <p className="text-2xl font-bold text-destructive mt-1">
          {mars?.winRate.toFixed(0) || 0}%
        </p>
        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
          <Gamepad2 className="h-3 w-3" />
          {mars?.gamesPlayed || 0} games
        </div>
      </div>
    </div>
  );
}
