import { CalendarIcon, MapPin, Users, Gamepad2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Player, MapType, GameMode } from '@/types/game';
import { MAP_TYPES, GAME_MODES } from '@/types/game';

export interface FilterState {
  mapType: MapType | null;
  gameMode: GameMode | null;
  playerId: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}

interface MatchFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  players: Player[];
  onApply: () => void;
}

export function MatchFilters({ filters, onChange, players, onApply }: MatchFiltersProps) {
  return (
    <div className="space-y-6 overflow-y-auto pb-4">
      {/* Map Type */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Map
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={filters.mapType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ ...filters, mapType: null })}
          >
            All
          </Button>
          {MAP_TYPES.map((map) => (
            <Button
              key={map}
              variant={filters.mapType === map ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange({ ...filters, mapType: map })}
            >
              {map === 'Mars Surface' ? '🔴 Mars' : '🏢 Under'}
            </Button>
          ))}
        </div>
      </div>

      {/* Game Mode */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Gamepad2 className="h-4 w-4 text-primary" />
          Game Mode
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={filters.gameMode === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ ...filters, gameMode: null })}
          >
            All
          </Button>
          {GAME_MODES.map((mode) => (
            <Button
              key={mode}
              variant={filters.gameMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange({ ...filters, gameMode: mode })}
            >
              {mode === 'Cooperative' ? '🤝 Co-op' : '🎭 Semi'}
            </Button>
          ))}
        </div>
      </div>

      {/* Player */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Player
        </Label>
        <Select
          value={filters.playerId || 'all'}
          onValueChange={(value) =>
            onChange({ ...filters, playerId: value === 'all' ? null : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All players" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            <SelectItem value="all">All Players</SelectItem>
            {players.map((player) => (
              <SelectItem key={player.id} value={player.id}>
                {player.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          Date Range
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !filters.dateFrom && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, 'MMM d') : 'Start'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom || undefined}
                  onSelect={(date) => onChange({ ...filters, dateFrom: date || null })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !filters.dateTo && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, 'MMM d') : 'End'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo || undefined}
                  onSelect={(date) => onChange({ ...filters, dateTo: date || null })}
                  disabled={(date) =>
                    filters.dateFrom ? date < filters.dateFrom : false
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <Button onClick={onApply} className="w-full h-12 text-lg">
        Apply Filters
      </Button>
    </div>
  );
}
