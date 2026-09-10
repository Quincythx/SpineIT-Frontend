import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { api } from '../services/api';
import type { Notification } from '../types/api';
import { formatRelativeTime } from '../utils/formatRelativeTime';

function describe(n: Notification): string {
  if (n.type === 'like') return `${n.actor} liked your review`;
  if (n.type === 'comment') return `${n.actor} commented on your review`;
  return `${n.actor} started following you`;
}

function linkFor(n: Notification): string {
  if (n.review) return `/reviews/${n.review}`;
  return `/users/${n.actor}`;
}

export function NotificationBell({
  variant = 'icon',
  panelClassName = 'right-0 top-full mt-2',
}: {
  variant?: 'icon' | 'row';
  panelClassName?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = () => api.getNotifications().then(setNotifications);

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = async () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && unreadCount > 0) {
      await api.markAllNotificationsRead();
      load();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className={
          variant === 'row'
            ? `flex items-center gap-4 w-full px-3 py-3 rounded-full hover:bg-bg-hover font-['Inter'] text-xl ${
                isOpen ? 'font-bold text-accent' : 'text-ink'
              }`
            : 'relative text-ink-muted p-2'
        }
      >
        <span className="relative">
          <Bell className="w-6 h-6" strokeWidth={variant === 'row' && isOpen ? 2.5 : 2} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>
        {variant === 'row' && <span>Notifications</span>}
      </button>

      {isOpen && (
        <div className={`absolute ${panelClassName} w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)] border border-border z-20`}>
          <div className="p-4 border-b border-border">
            <p className="font-['Inter'] font-semibold text-lg text-ink">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p className="font-['Inter'] text-sm text-ink-muted p-4">No notifications yet.</p>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  to={linkFor(n)}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 border-b border-border last:border-b-0 hover:bg-bg-hover ${
                    n.read ? '' : 'bg-accent/[0.04]'
                  }`}
                >
                  <p className="font-['Inter'] text-sm text-ink">{describe(n)}</p>
                  <p className="font-['Inter'] text-xs text-ink-muted">{formatRelativeTime(n.created_at)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
