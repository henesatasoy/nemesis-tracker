import { useState } from 'react';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { usePlayers, useCreatePlayer, useUpdatePlayer, useDeletePlayer } from '@/hooks/usePlayers';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Players() {
  const { data: players, isLoading } = usePlayers();
  const createPlayer = useCreatePlayer();
  const updatePlayer = useUpdatePlayer();
  const deletePlayer = useDeletePlayer();

  const [newName, setNewName] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<{ id: string; name: string } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    try {
      await createPlayer.mutateAsync(newName);
      setNewName('');
      setIsAddDialogOpen(false);
      toast.success('Player added!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add player';
      toast.error(message);
    }
  };

  const handleUpdate = async () => {
    if (!editingPlayer || !editingPlayer.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    try {
      await updatePlayer.mutateAsync({ id: editingPlayer.id, name: editingPlayer.name });
      setEditingPlayer(null);
      setIsEditDialogOpen(false);
      toast.success('Player updated!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update player';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePlayer.mutateAsync(id);
      toast.success('Player deleted');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete player';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Manage your gaming group</p>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Player</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Enter player name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <DialogFooter>
              <Button onClick={handleCreate} disabled={createPlayer.isPending}>
                {createPlayer.isPending ? 'Adding...' : 'Add Player'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : players && players.length > 0 ? (
        <div className="space-y-2">
          {players.map((player) => (
            <Card key={player.id}>
              <CardContent className="flex items-center justify-between p-4">
                <span className="font-medium">{player.name}</span>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen && editingPlayer?.id === player.id} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPlayer({ id: player.id, name: player.name })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Player</DialogTitle>
                      </DialogHeader>
                      <Input
                        placeholder="Enter player name"
                        value={editingPlayer?.name || ''}
                        onChange={(e) =>
                          setEditingPlayer((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                      />
                      <DialogFooter>
                        <Button onClick={handleUpdate} disabled={updatePlayer.isPending}>
                          {updatePlayer.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Player?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove "{player.name}" and all their match history. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(player.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No players added yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your gaming group members to start tracking!
          </p>
        </Card>
      )}
    </div>
  );
}
