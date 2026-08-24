import { useState } from 'react';
import { BookOpen, Home, Compass, PenLine, Bookmark, User, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';

const NAV_LINKS = [
  { to: '/', label: 'Feed', icon: Home, end: true },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/write', label: 'Write', icon: PenLine },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: User },
];

export function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="bg-[#fcf9f8] flex flex-col items-start w-full drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)]"
      data-node-id="2:3"
    >
      <div className="flex h-16 lg:h-20 items-center justify-between max-w-[1280px] px-4 sm:px-6 lg:px-16 w-full mx-auto">
        <NavLink to="/" className="flex items-center gap-2.5 lg:gap-[16.6px] shrink-0" onClick={() => setIsMenuOpen(false)}>
          <BookOpen className="w-[22px] h-[22px] text-[#00464a]" />
          <span className="font-['Playfair_Display'] text-base text-[#00464a]">SpineIt</span>
        </NavLink>

        {user ? (
          <div className="flex items-center gap-2 lg:gap-6 shrink-0">
            <nav className="hidden lg:flex gap-8 items-start shrink-0">
              {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex flex-col gap-1 items-center shrink-0 font-['Inter'] text-sm tracking-[0.7px] ${
                      isActive ? 'font-bold text-[#00464a]' : 'font-semibold text-[#3f4949]'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <NotificationBell />
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden text-[#00464a] p-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `font-['Inter'] font-semibold text-sm tracking-[0.7px] pb-1.5 ${
                  isActive ? 'text-[#00464a] border-b-2 border-[#00464a]' : 'text-[#3f4949]'
                }`
              }
            >
              Explore
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-[#00464a] text-white font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-4 sm:px-6 py-2.5 sm:py-3"
            >
              Join Now
            </NavLink>
          </div>
        )}
      </div>

      {user && isMenuOpen && (
        <nav className="lg:hidden flex flex-col items-stretch w-full border-t border-[#e5e2e1] px-4 sm:px-6 py-2">
          {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 font-['Inter'] text-sm tracking-[0.7px] ${
                  isActive ? 'font-bold text-[#00464a]' : 'font-semibold text-[#3f4949]'
                }`
              }
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
