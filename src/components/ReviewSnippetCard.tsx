import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import type { Review } from '../types/api';
import { Avatar } from './Avatar';

export function ReviewSnippetCard({ review }: { review: Review }) {
  return (
    <Link
      to={`/reviews/${review.id}`}
      className="bg-white border-l-4 border-[#00464a] drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg pl-7 pr-6 py-6 flex flex-col gap-4 flex-1 min-w-0"
    >
      <div className="flex items-center gap-3">
        <Avatar name={review.user} size={40} />
        <div>
          <p className="font-['Inter'] font-semibold text-sm text-[#1c1b1b]">{review.user}</p>
          <p className="font-['Inter'] font-medium text-xs text-[#3f4949]">
            Reviewed <span className="italic">{review.book.title}</span>
          </p>
        </div>
      </div>
      <p className="font-['Inter'] text-base text-[#1c1b1b] leading-6 line-clamp-3">{review.review_text}</p>
      <div className="flex gap-4 items-center">
        <span className="flex items-center gap-1 text-[#3f4949]">
          <Heart className="w-[15px] h-[15px]" />
          <span className="font-['Inter'] font-medium text-xs">{review.like_count}</span>
        </span>
        <span className="flex items-center gap-1 text-[#3f4949]">
          <MessageCircle className="w-[15px] h-[15px]" />
        </span>
      </div>
    </Link>
  );
}
