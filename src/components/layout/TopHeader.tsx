import { AlertTriangle } from 'lucide-react';

interface TopHeaderProps {
  title: string;
}

export function TopHeader({ title }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-primary animate-pulse-glow" />
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Nemesis: Lockdown
          </span>
          <h1 className="text-lg font-bold leading-none">{title}</h1>
        </div>
      </div>
    </header>
  );
}
