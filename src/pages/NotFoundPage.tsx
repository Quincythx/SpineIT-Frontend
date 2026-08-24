import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="max-w-[672px] mx-auto px-4 sm:px-6 lg:px-16 py-24 flex flex-col items-center text-center gap-4">
      <BookOpen className="w-10 h-10 text-[#00464a]" />
      <h1 className="font-['Playfair_Display'] font-bold text-4xl text-[#00464a]">Page Not Found</h1>
      <p className="font-['Inter'] text-[#3f4949]">
        This page doesn't exist in our library yet.{' '}
        <Link to="/" className="text-[#00464a] underline">
          Back to the feed
        </Link>
      </p>
    </div>
  );
}
