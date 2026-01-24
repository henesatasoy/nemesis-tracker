import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Check, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ObjectiveCatalog } from '@/types/game';
import { cn } from '@/lib/utils';

interface ObjectiveDraftProps {
  corporateObjective: ObjectiveCatalog;
  personalObjective: ObjectiveCatalog;
  onSelect: (keptId: string, discardedId: string) => void;
  isLoading?: boolean;
}

export function ObjectiveDraft({
  corporateObjective,
  personalObjective,
  onSelect,
  isLoading,
}: ObjectiveDraftProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    
    const discardedId = selectedId === corporateObjective.id 
      ? personalObjective.id 
      : corporateObjective.id;
    
    onSelect(selectedId, discardedId);
    setShowConfirmation(false);
  };

  const selectedObjective = selectedId === corporateObjective.id 
    ? corporateObjective 
    : personalObjective;

  return (
    <>
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">First Encounter</h2>
          <p className="text-sm text-muted-foreground">
            Choose one objective to keep. The other will be discarded forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Corporate Objective */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={cn(
                'cursor-pointer transition-all duration-300 border-2',
                'hover:border-[hsl(var(--chart-3))] hover:shadow-lg hover:shadow-[hsl(var(--chart-3))]/20',
                selectedId === corporateObjective.id && 'border-[hsl(var(--chart-3))] ring-2 ring-[hsl(var(--chart-3))]/50'
              )}
              onClick={() => handleSelect(corporateObjective.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[hsl(var(--chart-3))]/20">
                    <Building2 className="h-5 w-5 text-[hsl(var(--chart-3))]" />
                  </div>
                  <div>
                    <CardDescription className="text-[hsl(var(--chart-3))] font-medium">
                      CORPORATE
                    </CardDescription>
                    <CardTitle className="text-lg">{corporateObjective.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {corporateObjective.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Objective */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={cn(
                'cursor-pointer transition-all duration-300 border-2',
                'hover:border-primary hover:shadow-lg hover:shadow-primary/20',
                selectedId === personalObjective.id && 'border-primary ring-2 ring-primary/50'
              )}
              onClick={() => handleSelect(personalObjective.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardDescription className="text-primary font-medium">
                      PERSONAL
                    </CardDescription>
                    <CardTitle className="text-lg">{personalObjective.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {personalObjective.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle>Confirm Selection</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2">
              <p>
                You are about to keep <strong className="text-foreground">{selectedObjective?.title}</strong>.
              </p>
              <p className="text-destructive font-medium">
                This choice is final and cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
              <Check className="h-4 w-4 mr-2" />
              Confirm Selection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
