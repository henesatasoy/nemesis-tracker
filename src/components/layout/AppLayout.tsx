import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopHeader } from './TopHeader';

export function AppLayout() {
  const location = useLocation();
  
  // Get page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/log':
        return 'Log Match';
      case '/analytics':
        return 'Analytics';
      case '/history':
        return 'History';
      case '/players':
        return 'Players';
      default:
        return 'Nemesis: Lockdown';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader title={getPageTitle()} />
      <main className="flex-1 container pb-20 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
