import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function UserLink({ username, className, children }: { username: string; className?: string; children: ReactNode }) {
  return (
    <Link to={`/users/${username}`} className={className}>
      {children}
    </Link>
  );
}
