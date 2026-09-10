import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="max-w-[672px] mx-auto px-4 sm:px-6 lg:px-16 py-24 flex flex-col items-center text-center gap-4">
      <BookOpen className="w-10 h-10 text-accent" />
      <h1 className="font-['Inter'] font-bold text-4xl text-accent">Page Not Found</h1>
      <p className="font-['Inter'] text-ink-muted">
        This page doesn't exist in our library yet.{' '}
        <Link to="/" className="text-accent underline">
          Back to the feed
        </Link>
      </p>
    </div>
  );
}
