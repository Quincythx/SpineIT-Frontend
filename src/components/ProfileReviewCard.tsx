import { Link } from 'react-router-dom';
import { Star, Heart, MessageCircle, BookOpen } from 'lucide-react';
import type { Review } from '../types/api';

export function ProfileReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-white rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] overflow-hidden flex w-full">
      <Link to={`/books/${review.book.slug}`} className="shrink-0">
        {review.image ? (
          <img
            src={review.image}
            alt={review.book.title}
            className="w-[160px] h-full object-cover border-l-4 border-accent"
          />
        ) : (
          <div className="w-[160px] h-full bg-bg-hover border-l-4 border-accent flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-ink-muted" />
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <Link to={`/books/${review.book.slug}`}>
              <h3 className="font-['Inter'] font-semibold text-2xl text-ink">{review.book.title}</h3>
            </Link>
            <span className="flex items-center gap-1 shrink-0 pt-2">
              <Star className="w-[12px] h-[11px] fill-accent text-accent" />
              <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-accent">
                {review.rating.toFixed(1)}
              </span>
            </span>
          </div>
          <p className="font-['Inter'] text-base text-ink-muted line-clamp-3">{review.review_text}</p>
        </div>
        <div className="flex items-center justify-between pt-4">
          <span className="font-['Inter'] font-medium text-xs text-ink-muted">
            {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <Link to={`/reviews/${review.id}`} className="flex gap-2 items-center text-ink-muted">
            <Heart className="w-5 h-[18px]" />
            <MessageCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
