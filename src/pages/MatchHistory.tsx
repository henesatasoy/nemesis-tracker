import { History as HistoryIcon, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useMatches, useDeleteMatch } from '@/hooks/useMatches';
import { MatchCard } from '@/components/matches/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MatchHistory() {
  const { data: matches, isLoading } = useMatches();
  const deleteMatch = useDeleteMatch();

  const handleDelete = async (id: string) => {
    try {
      await deleteMatch.mutateAsync(id);
      toast.success('Match deleted');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete match';
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-slide-up">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="animate-slide-up">
        <Card className="p-8 text-center">
          <HistoryIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No match history</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your logged matches will appear here
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-slide-up">
      {matches.map((match) => (
        <div key={match.id} className="relative">
          <MatchCard match={match} showDetails />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Match?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this match and all participant data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(match.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
