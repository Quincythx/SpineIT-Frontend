import { Link } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';
import type { Book } from '../types/api';

export function BookMiniCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.slug}`}
      className="bg-white drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg p-4 flex flex-col gap-4 flex-1 min-w-0"
    >
      <div className="w-full aspect-[2/3] rounded-md bg-[#f6f3f2] flex items-center justify-center">
        <BookOpen className="w-8 h-8 text-[#3f4949]" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-['Inter'] font-bold text-base text-[#1c1b1b] truncate">{book.title}</h3>
        <p className="font-['Inter'] text-sm text-[#3f4949] truncate">{book.author}</p>
        {book.average_rating != null && (
          <div className="flex gap-1 items-center pt-1">
            <Star className="w-[13px] h-[13px] fill-[#7e5700] text-[#7e5700]" />
            <span className="font-['Inter'] font-medium text-xs text-[#7e5700]">{book.average_rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
