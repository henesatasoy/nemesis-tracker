import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, History, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/log', icon: PlusCircle, label: 'Log', isMain: true },
  { to: '/analytics', icon: BarChart3, label: 'Stats' },
  { to: '/players', icon: Users, label: 'Players' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm safe-area-bottom">
      <div className="container flex h-16 items-center justify-around">
        {navItems.map(({ to, icon: Icon, label, isMain }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors',
                isMain
                  ? 'relative -mt-4 rounded-full bg-primary p-4 text-primary-foreground shadow-lg shadow-primary/30'
                  : isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className={cn('h-5 w-5', isMain && 'h-6 w-6')} />
            {!isMain && <span className="text-xs font-medium">{label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
