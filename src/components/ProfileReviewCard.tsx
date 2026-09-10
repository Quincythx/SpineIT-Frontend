import { Link } from 'react-router-dom';
import { Star, Heart, MessageCircle, BookOpen } from 'lucide-react';
import type { Review } from '../types/api';

export function ProfileReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-white border border-border rounded-xl overflow-hidden flex w-full">
      <Link to={`/books/${review.book.slug}`} className="shrink-0">
        {review.image ? (
          <img
            src={review.image}
            alt={review.book.title}
            className="w-[110px] h-full object-cover border-l-4 border-accent"
          />
        ) : (
          <div className="w-[110px] h-full bg-bg-hover border-l-4 border-accent flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-ink-muted" />
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-4">
            <Link to={`/books/${review.book.slug}`}>
              <h3 className="font-['Inter'] font-bold text-lg text-ink">{review.book.title}</h3>
            </Link>
            <span className="flex items-center gap-1 shrink-0 pt-0.5">
              <Star className="w-[12px] h-[11px] fill-accent text-accent" />
              <span className="font-['Inter'] font-semibold text-sm text-accent">{review.rating.toFixed(1)}</span>
            </span>
          </div>
          <p className="font-['Inter'] text-[15px] text-ink-muted line-clamp-2">{review.review_text}</p>
        </div>
        <div className="flex items-center justify-between pt-3">
          <span className="font-['Inter'] text-xs text-ink-muted">
            {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <Link to={`/reviews/${review.id}`} className="flex gap-4 items-center text-ink-muted">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="font-['Inter'] text-xs">{review.like_count}</span>
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="font-['Inter'] text-xs">{review.comment_count}</span>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
