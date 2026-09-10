import { BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="bg-bg flex items-center justify-between h-16 px-4 sm:px-6 lg:px-16 w-full border-b border-border">
      <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
        <BookOpen className="w-[22px] h-[22px] text-accent" />
        <span className="font-['Inter'] font-bold text-base text-accent">SpineIt</span>
      </NavLink>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `font-['Inter'] font-semibold text-sm tracking-[0.7px] pb-1.5 ${
              isActive ? 'text-accent border-b-2 border-accent' : 'text-ink-muted'
            }`
          }
        >
          Explore
        </NavLink>
        <NavLink
          to="/signup"
          className="bg-accent text-white font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-4 sm:px-6 py-2.5 sm:py-3"
        >
          Join Now
        </NavLink>
      </div>
    </header>
  );
}
