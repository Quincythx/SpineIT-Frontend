import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import type { Review } from '../types/api';
import { Avatar } from './Avatar';

export function ReviewSnippetCard({ review }: { review: Review }) {
  return (
    <Link
      to={`/reviews/${review.id}`}
      className="bg-white border border-border rounded-xl px-5 py-4 flex flex-col gap-3 flex-1 min-w-0"
    >
      <div className="flex items-center gap-3">
        <Avatar name={review.user} size={36} />
        <div>
          <p className="font-['Inter'] font-bold text-sm text-ink">{review.user}</p>
          <p className="font-['Inter'] text-xs text-ink-muted">
            Reviewed <span className="italic">{review.book.title}</span>
          </p>
        </div>
      </div>
      <p className="font-['Inter'] text-[15px] text-ink leading-5 line-clamp-3">{review.review_text}</p>
      <div className="flex gap-4 items-center">
        <span className="flex items-center gap-1 text-ink-muted">
          <Heart className="w-[15px] h-[15px]" />
          <span className="font-['Inter'] text-xs">{review.like_count}</span>
        </span>
        <span className="flex items-center gap-1 text-ink-muted">
          <MessageCircle className="w-[15px] h-[15px]" />
          <span className="font-['Inter'] text-xs">{review.comment_count}</span>
        </span>
      </div>
    </Link>
  );
}
