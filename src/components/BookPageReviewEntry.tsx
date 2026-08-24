import { Link } from 'react-router-dom';
import { Star, Heart, MessageCircle } from 'lucide-react';
import type { Review } from '../types/api';
import { Avatar } from './Avatar';
import { formatRelativeTime } from '../utils/formatRelativeTime';

export function BookPageReviewEntry({ review }: { review: Review }) {
  return (
    <Link
      to={`/reviews/${review.id}`}
      className="bg-white rounded-lg shadow-[0px_4px_20px_0px_rgba(0,96,100,0.05)] p-6 flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={review.user} size={40} />
          <div>
            <p className="font-['Inter'] font-semibold text-sm text-[#1c1b1b]">{review.user}</p>
            <p className="font-['Inter'] text-xs text-[#3f4949]">{formatRelativeTime(review.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-[#7e5700] text-[#7e5700]" />
          <span className="font-['Inter'] font-semibold text-sm text-[#7e5700]">{review.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="font-['Inter'] text-base text-[#1c1b1b] leading-6 line-clamp-4">{review.review_text}</p>
      <div className="flex gap-4 items-center pt-1">
        <span className="flex items-center gap-1 text-[#3f4949]">
          <Heart className="w-4 h-4" />
          <span className="font-['Inter'] font-medium text-xs">{review.like_count}</span>
        </span>
        <span className="flex items-center gap-1 text-[#3f4949]">
          <MessageCircle className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
