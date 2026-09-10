import { Home, Compass, Bookmark, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/saved', label: 'Bookmarks', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-bg border-t border-border flex items-center justify-around pb-[env(safe-area-inset-bottom)] z-20">
      {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={label}
          className={({ isActive }) => `flex items-center justify-center flex-1 py-3 ${isActive ? 'text-accent' : 'text-ink'}`}
        >
          {({ isActive }) => <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />}
        </NavLink>
      ))}
      <div className="flex items-center justify-center flex-1 py-3">
        <NotificationBell panelClassName="right-2 bottom-full mb-2" />
      </div>
    </nav>
  );
}
