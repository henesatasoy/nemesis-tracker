import { CalendarIcon, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { MatchFormData, MapType, GameMode } from '@/types/game';
import { MAP_TYPES, GAME_MODES } from '@/types/game';

interface StepMatchDetailsProps {
  data: MatchFormData;
  onChange: (data: MatchFormData) => void;
  onNext: () => void;
}

export function StepMatchDetails({ data, onChange, onNext }: StepMatchDetailsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Match Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date Played</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !data.date_played && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.date_played ? format(data.date_played, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.date_played}
                  onSelect={(date) => date && onChange({ ...data, date_played: date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Map Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {MAP_TYPES.map((map) => (
                <Button
                  key={map}
                  type="button"
                  variant={data.map_type === map ? 'default' : 'outline'}
                  className="h-auto py-3 flex flex-col gap-1"
                  onClick={() => onChange({ ...data, map_type: map })}
                >
                  <span className="font-medium">
                    {map === 'Mars Surface' ? '🔴 Mars' : '🏢 Underground'}
                  </span>
                  <span className="text-xs opacity-70">
                    {map === 'Mars Surface' ? 'Surface' : 'Facility'}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Game Mode */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Game Mode
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {GAME_MODES.map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  variant={data.game_mode === mode ? 'default' : 'outline'}
                  className="h-auto py-3"
                  onClick={() => onChange({ ...data, game_mode: mode })}
                >
                  {mode === 'Cooperative' ? '🤝 Co-op' : '🎭 Semi-Coop'}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Any memorable moments or comments..."
              value={data.notes}
              onChange={(e) => onChange({ ...data, notes: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={onNext} className="w-full h-12 text-lg">
        Next: Select Players
      </Button>
    </div>
  );
}
