import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateMatch } from '@/hooks/useMatches';
import { usePlayers } from '@/hooks/usePlayers';
import { toast } from 'sonner';
import type { MatchFormData, ParticipantFormData } from '@/types/game';
import { WizardProgress } from '@/components/wizard/WizardProgress';
import { StepMatchDetails } from '@/components/wizard/StepMatchDetails';
import { StepSelectPlayers } from '@/components/wizard/StepSelectPlayers';
import { StepOutcomes } from '@/components/wizard/StepOutcomes';
import { StepSummary } from '@/components/wizard/StepSummary';

const TOTAL_STEPS = 4;

export default function LogMatch() {
  const navigate = useNavigate();
  const createMatch = useCreateMatch();
  const { data: players } = usePlayers();

  const [currentStep, setCurrentStep] = useState(1);
  const [matchData, setMatchData] = useState<MatchFormData>({
    date_played: new Date(),
    map_type: 'Underground Facility',
    game_mode: 'Normal (Semi-Coop)',
    notes: '',
  });
  const [participants, setParticipants] = useState<ParticipantFormData[]>([]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      await createMatch.mutateAsync({ matchData, participants });
      toast.success('Match logged successfully!');
      navigate('/');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save match';
      toast.error(message);
    }
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return true; // Match details always valid with defaults
      case 2:
        return participants.length > 0;
      case 3:
        return participants.every((p) =>
          p.status === 'Dead'
            ? p.death_cause && p.death_round
            : p.escape_method !== undefined
        );
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {currentStep === 1 && (
        <StepMatchDetails
          data={matchData}
          onChange={setMatchData}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <StepSelectPlayers
          players={players || []}
          participants={participants}
          onChange={setParticipants}
          onNext={handleNext}
          onBack={handleBack}
          canProceed={canProceedFromStep(2)}
        />
      )}

      {currentStep === 3 && (
        <StepOutcomes
          participants={participants}
          players={players || []}
          onChange={setParticipants}
          onNext={handleNext}
          onBack={handleBack}
          canProceed={canProceedFromStep(3)}
        />
      )}

      {currentStep === 4 && (
        <StepSummary
          matchData={matchData}
          participants={participants}
          players={players || []}
          onBack={handleBack}
          onSave={handleSave}
          isSaving={createMatch.isPending}
        />
      )}
    </div>
  );
}
