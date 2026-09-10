import { BookOpen, Home, Compass, Bookmark, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/saved', label: 'Bookmarks', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border px-3 py-4">
      <NavLink to="/" className="flex items-center gap-2 px-3 py-3 rounded-full hover:bg-bg-hover w-fit" aria-label="SpineIt home">
        <BookOpen className="w-7 h-7 text-accent" />
      </NavLink>

      <nav className="flex flex-col gap-1 mt-2">
        {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-full hover:bg-bg-hover font-['Inter'] text-xl ${
                isActive ? 'font-bold text-accent' : 'text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        <NotificationBell variant="row" panelClassName="left-full top-0 ml-3" />
      </nav>

      <NavLink
        to="/write"
        className="mt-4 bg-accent hover:bg-accent-hover text-white font-['Inter'] font-bold text-base rounded-full py-3.5 text-center transition-colors"
      >
        Write a Review
      </NavLink>
    </aside>
  );
}
