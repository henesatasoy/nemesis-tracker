import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Eye, EyeOff, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { PlayerObjectiveWithDetails, ObjectiveStatus } from '@/types/game';
import { cn } from '@/lib/utils';

interface ObjectiveDetailProps {
  objective: PlayerObjectiveWithDetails;
  onUpdateNotes?: (notes: string) => void;
  onUpdateStatus?: (status: ObjectiveStatus) => void;
  isUpdating?: boolean;
}

export function ObjectiveDetail({
  objective,
  onUpdateNotes,
  onUpdateStatus,
  isUpdating,
}: ObjectiveDetailProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [notes, setNotes] = useState(objective.notes || '');
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const catalog = objective.objectives_catalog;
  const isCorporate = catalog.type === 'CORPORATE';

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, []);

  const handleHoldStart = () => {
    setIsHolding(true);
    holdTimeoutRef.current = setTimeout(() => {
      setIsRevealed(true);
    }, 500); // 500ms hold to reveal
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    // Auto-hide after 3 seconds if revealed
    if (isRevealed) {
      revealTimeoutRef.current = setTimeout(() => {
        setIsRevealed(false);
      }, 3000);
    }
  };

  const handleNotesBlur = () => {
    if (notes !== objective.notes && onUpdateNotes) {
      onUpdateNotes(notes);
    }
  };

  const getStatusBadge = () => {
    switch (objective.status) {
      case 'ACTIVE':
        return <Badge variant="outline" className="border-[hsl(var(--chart-3))] text-[hsl(var(--chart-3))]"><Clock className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'FAILED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'DISCARDED':
        return <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" /> Discarded</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isCorporate 
          ? 'border-[hsl(var(--chart-3))]/30' 
          : 'border-primary/30',
        objective.status === 'DISCARDED' && 'opacity-50'
      )}
    >
      {/* Dossier-style header stripe */}
      <div 
        className={cn(
          'absolute top-0 left-0 right-0 h-1',
          isCorporate ? 'bg-[hsl(var(--chart-3))]' : 'bg-primary'
        )} 
      />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              'p-2 rounded-lg',
              isCorporate ? 'bg-[hsl(var(--chart-3))]/20' : 'bg-primary/20'
            )}>
              {isCorporate 
                ? <Building2 className="h-5 w-5 text-[hsl(var(--chart-3))]" />
                : <User className="h-5 w-5 text-primary" />
              }
            </div>
            <div>
              <CardDescription className={cn(
                'font-medium text-xs',
                isCorporate ? 'text-[hsl(var(--chart-3))]' : 'text-primary'
              )}>
                {catalog.type} OBJECTIVE
              </CardDescription>
              <CardTitle className="text-base">{catalog.title}</CardTitle>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Hold-to-reveal section */}
        <div 
          className="relative select-none"
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onMouseLeave={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
        >
          <motion.div
            className={cn(
              'p-4 rounded-lg border border-dashed transition-colors',
              isRevealed 
                ? 'border-transparent bg-muted' 
                : 'border-muted-foreground/30 bg-muted/50 cursor-pointer'
            )}
            animate={{ 
              scale: isHolding ? 0.98 : 1,
              opacity: isHolding ? 0.8 : 1 
            }}
          >
            {isRevealed ? (
              <p className="text-sm text-foreground leading-relaxed">
                {catalog.description}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 gap-2">
                <div className="p-3 rounded-full bg-destructive/20">
                  <EyeOff className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  TOP SECRET
                </p>
                <p className="text-xs text-muted-foreground">
                  Hold to reveal objective
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Notes section */}
        {objective.status === 'ACTIVE' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Progress Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Track your progress here..."
              className="resize-none text-sm"
              rows={2}
              disabled={isUpdating}
            />
          </div>
        )}

        {/* Status actions */}
        {objective.status === 'ACTIVE' && onUpdateStatus && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-[hsl(var(--success))] text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/10"
              onClick={() => onUpdateStatus('COMPLETED')}
              disabled={isUpdating}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => onUpdateStatus('FAILED')}
              disabled={isUpdating}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Failed
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
