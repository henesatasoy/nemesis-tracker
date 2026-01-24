import { Shield, Terminal, Wrench, FlaskConical, Heart, Bug } from 'lucide-react';
import type { CharacterClass } from '@/types/game';
import { cn } from '@/lib/utils';

const iconMap: Record<CharacterClass, React.ElementType> = {
  'Sentinel': Shield,
  'Hacker': Terminal,
  'Janitor': Wrench,
  'Lab Rat': FlaskConical,
  'Survivor': Heart,
  'Xenobiologist': Bug,
};

interface CharacterIconProps {
  character: CharacterClass;
  className?: string;
}

export function CharacterIcon({ character, className }: CharacterIconProps) {
  const Icon = iconMap[character];
  return <Icon className={cn('h-4 w-4', className)} />;
}
