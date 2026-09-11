import { Link } from 'react-router-dom';
import { Star, Heart, MessageCircle } from 'lucide-react';
import type { Review } from '../types/api';
import { Avatar } from './Avatar';
import { formatRelativeTime } from '../utils/formatRelativeTime';

export function BookPageReviewEntry({ review }: { review: Review }) {
  return (
    <Link
      to={`/reviews/${review.id}`}
      className="bg-white border border-border rounded-xl p-4 flex flex-col gap-2 w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={review.user} src={review.user_avatar} size={36} />
          <div>
            <p className="font-['Inter'] font-bold text-sm text-ink">{review.user}</p>
            <p className="font-['Inter'] text-xs text-ink-muted">{formatRelativeTime(review.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-['Inter'] font-semibold text-sm text-accent">{review.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="font-['Inter'] text-[15px] text-ink leading-5 line-clamp-4">{review.review_text}</p>
      <div className="flex gap-4 items-center pt-1">
        <span className="flex items-center gap-1 text-ink-muted">
          <Heart className="w-4 h-4" />
          <span className="font-['Inter'] text-xs">{review.like_count}</span>
        </span>
        <span className="flex items-center gap-1 text-ink-muted">
          <MessageCircle className="w-4 h-4" />
          <span className="font-['Inter'] text-xs">{review.comment_count}</span>
        </span>
      </div>
    </Link>
  );
}
