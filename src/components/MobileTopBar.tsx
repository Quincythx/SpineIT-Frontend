import { BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';

export function MobileTopBar() {
  return (
    <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-bg sticky top-0 z-10">
      <NavLink to="/" className="flex items-center gap-2" aria-label="SpineIt home">
        <BookOpen className="w-6 h-6 text-accent" />
      </NavLink>
      <NotificationBell panelClassName="right-0 top-full mt-2" />
    </header>
  );
}
