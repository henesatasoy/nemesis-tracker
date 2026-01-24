import { useState } from 'react';
import { Target, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlayers } from '@/hooks/usePlayers';
import { useMatches } from '@/hooks/useMatches';
import { useObjectivesByType, usePlayerObjectives, useUpdateObjectiveStatus, useUpdateObjectiveNotes } from '@/hooks/useObjectives';
import { useContingenciesCatalog, usePlayerContingencyKnowledge, useInitializeContingencyTracking, useUpdateContingencyStatus } from '@/hooks/useContingencies';
import { ObjectiveDraft } from '@/components/objectives/ObjectiveDraft';
import { ObjectiveDetail } from '@/components/objectives/ObjectiveDetail';
import { ContingencyTracker } from '@/components/contingencies/ContingencyTracker';
import type { ContingencyStatus, ObjectiveStatus } from '@/types/game';
import { toast } from 'sonner';

export default function Dossier() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'objectives' | 'contingencies'>('objectives');

  const { data: players, isLoading: playersLoading } = usePlayers();
  const { data: matches, isLoading: matchesLoading } = useMatches();

  // Get objectives for the selected player/match
  const { data: playerObjectives, isLoading: objectivesLoading } = usePlayerObjectives(
    selectedMatchId, 
    selectedPlayerId
  );

  // Get contingency knowledge for the selected player/match
  const { data: contingencyKnowledge, isLoading: contingenciesLoading } = usePlayerContingencyKnowledge(
    selectedMatchId,
    selectedPlayerId
  );

  // Get catalog data for drafting
  const { data: corporateObjectives } = useObjectivesByType('CORPORATE', 
    matches?.find(m => m.id === selectedMatchId)?.player_count
  );
  const { data: personalObjectives } = useObjectivesByType('PERSONAL',
    matches?.find(m => m.id === selectedMatchId)?.player_count
  );

  // Mutations
  const updateObjectiveStatus = useUpdateObjectiveStatus();
  const updateObjectiveNotes = useUpdateObjectiveNotes();
  const initializeContingencyTracking = useInitializeContingencyTracking();
  const updateContingencyStatus = useUpdateContingencyStatus();

  const handleObjectiveStatusUpdate = (id: string, status: ObjectiveStatus) => {
    updateObjectiveStatus.mutate({ id, status }, {
      onSuccess: () => toast.success('Objective updated'),
      onError: () => toast.error('Failed to update objective'),
    });
  };

  const handleObjectiveNotesUpdate = (id: string, notes: string) => {
    updateObjectiveNotes.mutate({ id, notes });
  };

  const handleContingencyToggle = (id: string, newStatus: ContingencyStatus) => {
    updateContingencyStatus.mutate({ id, status: newStatus });
  };

  const handleInitializeContingencies = () => {
    if (!selectedMatchId || !selectedPlayerId) return;
    
    initializeContingencyTracking.mutate({ 
      matchId: selectedMatchId, 
      playerId: selectedPlayerId 
    }, {
      onSuccess: () => toast.success('Contingency tracking initialized'),
      onError: () => toast.error('Failed to initialize tracking'),
    });
  };

  const activeObjectives = playerObjectives?.filter(o => o.status === 'ACTIVE') || [];
  const hasContingencyTracking = contingencyKnowledge && contingencyKnowledge.length > 0;

  // Get a random objective for draft (simplified demo)
  const randomCorporate = corporateObjectives?.[Math.floor(Math.random() * (corporateObjectives?.length || 1))];
  const randomPersonal = personalObjectives?.[Math.floor(Math.random() * (personalObjectives?.length || 1))];
  const needsDraft = selectedMatchId && selectedPlayerId && 
    playerObjectives?.length === 0 && 
    randomCorporate && randomPersonal;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/20">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mission Dossier</h1>
          <p className="text-sm text-muted-foreground">
            Track objectives and contingencies
          </p>
        </div>
      </div>

      {/* Player & Match Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Session Selection
          </CardTitle>
          <CardDescription>
            Choose a player and match to view their dossier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select player..." />
              </SelectTrigger>
              <SelectContent>
                {playersLoading ? (
                  <div className="p-2"><Skeleton className="h-5 w-full" /></div>
                ) : (
                  players?.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
              <SelectTrigger>
                <SelectValue placeholder="Select match..." />
              </SelectTrigger>
              <SelectContent>
                {matchesLoading ? (
                  <div className="p-2"><Skeleton className="h-5 w-full" /></div>
                ) : (
                  matches?.slice(0, 10).map((match) => (
                    <SelectItem key={match.id} value={match.id}>
                      {new Date(match.date_played).toLocaleDateString()} - {match.map_type}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {selectedPlayerId && selectedMatchId ? (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'objectives' | 'contingencies')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="contingencies">Contingencies</TabsTrigger>
          </TabsList>

          <TabsContent value="objectives" className="mt-4 space-y-4">
            {objectivesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : needsDraft ? (
              <ObjectiveDraft
                corporateObjective={randomCorporate}
                personalObjective={randomPersonal}
                onSelect={(keptId, discardedId) => {
                  // This would need the full implementation with useAssignObjectives
                  toast.info('Objective draft feature - assign objectives first');
                }}
              />
            ) : activeObjectives.length > 0 ? (
              <div className="space-y-4">
                {activeObjectives.map((objective) => (
                  <ObjectiveDetail
                    key={objective.id}
                    objective={objective}
                    onUpdateNotes={(notes) => handleObjectiveNotesUpdate(objective.id, notes)}
                    onUpdateStatus={(status) => handleObjectiveStatusUpdate(objective.id, status)}
                    isUpdating={updateObjectiveStatus.isPending}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No objectives assigned yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Objectives will appear during the First Encounter phase
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contingencies" className="mt-4">
            {contingenciesLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : hasContingencyTracking ? (
              <ContingencyTracker
                contingencies={contingencyKnowledge}
                onToggleStatus={handleContingencyToggle}
                isUpdating={updateContingencyStatus.isPending}
                showDangerWarnings
              />
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center space-y-3">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-muted-foreground">No contingency tracking initialized</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start tracking to deduce the active contingency
                    </p>
                  </div>
                  <Button 
                    onClick={handleInitializeContingencies}
                    disabled={initializeContingencyTracking.isPending}
                  >
                    Initialize Tracking
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Select a player and match to view their dossier
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
