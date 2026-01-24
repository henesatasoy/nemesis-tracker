import { motion } from 'framer-motion';
import { Brain, MapPin, Rocket, Skull, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { 
  PlayerContingencyWithDetails, 
  ContingencyStatus, 
  LethalityType,
  CONTINGENCY_STATUS_ORDER 
} from '@/types/game';
import { cn } from '@/lib/utils';

const STATUS_ORDER: ContingencyStatus[] = ['POSSIBLE', 'ELIMINATED', 'SUSPECTED', 'CONFIRMED'];

const LETHALITY_ICONS: Record<LethalityType, React.ReactNode> = {
  'KNOWLEDGE_CHECK': <Brain className="h-4 w-4" />,
  'LOCATION_CHECK': <MapPin className="h-4 w-4" />,
  'CSS_CHECK': <Rocket className="h-4 w-4" />,
  'GLOBAL_KILL': <Skull className="h-4 w-4" />,
};

const LETHALITY_COLORS: Record<LethalityType, string> = {
  'KNOWLEDGE_CHECK': 'text-[hsl(var(--chart-3))]',
  'LOCATION_CHECK': 'text-[hsl(var(--warning))]',
  'CSS_CHECK': 'text-[hsl(var(--chart-5))]',
  'GLOBAL_KILL': 'text-destructive',
};

interface ContingencyTrackerProps {
  contingencies: PlayerContingencyWithDetails[];
  onToggleStatus: (id: string, newStatus: ContingencyStatus) => void;
  isUpdating?: boolean;
  showDangerWarnings?: boolean;
  playerKnowledge?: number;
}

export function ContingencyTracker({
  contingencies,
  onToggleStatus,
  isUpdating,
  showDangerWarnings = true,
  playerKnowledge,
}: ContingencyTrackerProps) {
  const handleToggle = (contingency: PlayerContingencyWithDetails) => {
    if (isUpdating) return;

    const currentIndex = STATUS_ORDER.indexOf(contingency.status);
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
    const newStatus = STATUS_ORDER[nextIndex];

    onToggleStatus(contingency.id, newStatus);
  };

  const getStatusStyles = (status: ContingencyStatus) => {
    switch (status) {
      case 'ELIMINATED':
        return {
          bg: 'bg-muted/50',
          text: 'text-muted-foreground line-through',
          border: 'border-muted',
          badge: 'bg-muted text-muted-foreground',
        };
      case 'SUSPECTED':
        return {
          bg: 'bg-[hsl(var(--warning))]/10',
          text: 'text-[hsl(var(--warning))]',
          border: 'border-[hsl(var(--warning))]/50',
          badge: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]',
        };
      case 'CONFIRMED':
        return {
          bg: 'bg-destructive/10',
          text: 'text-destructive',
          border: 'border-destructive/50',
          badge: 'bg-destructive text-destructive-foreground',
        };
      default: // POSSIBLE
        return {
          bg: 'bg-card',
          text: 'text-foreground',
          border: 'border-border',
          badge: 'bg-secondary text-secondary-foreground',
        };
    }
  };

  const isDanger = (contingency: PlayerContingencyWithDetails) => {
    if (!showDangerWarnings || contingency.status === 'ELIMINATED') return false;
    
    const catalog = contingency.contingencies_catalog;
    
    // Check knowledge-based dangers
    if (catalog.lethality === 'KNOWLEDGE_CHECK' && playerKnowledge !== undefined) {
      // "Less than 3 Knowledge" danger
      if (catalog.name === 'System Failure' && playerKnowledge < 3) return true;
      // "More than 4 Knowledge" danger
      if (catalog.name === 'Containment Breach' && playerKnowledge > 4) return true;
    }
    
    return false;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Contingency Tracker</h3>
          <p className="text-xs text-muted-foreground">
            Tap to cycle: Possible → Eliminated → Suspected → Confirmed
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <span className="w-2 h-2 rounded-full bg-muted-foreground mr-1" /> Possible
          </Badge>
          <Badge variant="outline" className="text-xs line-through text-muted-foreground">
            Eliminated
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {contingencies.map((contingency) => {
          const catalog = contingency.contingencies_catalog;
          const styles = getStatusStyles(contingency.status);
          const hasDanger = isDanger(contingency);

          return (
            <motion.div
              key={contingency.id}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() => handleToggle(contingency)}
            >
              <Card 
                className={cn(
                  'transition-all duration-200 border',
                  styles.bg,
                  styles.border,
                  hasDanger && 'ring-2 ring-destructive animate-pulse'
                )}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        'p-2 rounded-lg bg-muted shrink-0',
                        LETHALITY_COLORS[catalog.lethality]
                      )}>
                        {LETHALITY_ICONS[catalog.lethality]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={cn('font-medium text-sm', styles.text)}>
                            {catalog.name}
                          </h4>
                          {hasDanger && (
                            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                          )}
                        </div>
                        <p className={cn(
                          'text-xs mt-1 line-clamp-2',
                          contingency.status === 'ELIMINATED' 
                            ? 'text-muted-foreground' 
                            : 'text-muted-foreground'
                        )}>
                          {catalog.effect_text}
                        </p>
                      </div>
                    </div>
                    <Badge className={cn('shrink-0 text-xs', styles.badge)}>
                      {contingency.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {showDangerWarnings && contingencies.some(isDanger) && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-sm">CRITICAL DANGER</p>
                <p className="text-xs opacity-80">
                  One or more active contingencies may kill you based on your current status!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
