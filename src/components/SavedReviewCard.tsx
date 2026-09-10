import { X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Review } from '../types/api';
import { Avatar } from './Avatar';
import { UserLink } from './UserLink';

export function SavedReviewCard({ review, onRemove }: { review: Review; onRemove: () => void }) {
  return (
    <article className="bg-white border-l-[3px] border-accent drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] rounded-lg pl-7 pr-6 py-6 flex-1 min-w-0 flex flex-col gap-6">
      <div className="flex gap-6 items-start">
        <Link to={`/books/${review.book.slug}`} className="shrink-0">
          {review.image ? (
            <img
              src={review.image}
              alt={review.book.title}
              className="w-[106px] aspect-[2/3] object-cover shadow-[inset_4px_0px_8px_0px_rgba(0,0,0,0.1)]"
            />
          ) : (
            <div className="w-[106px] aspect-[2/3] bg-bg-hover flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-ink-muted" />
            </div>
          )}
        </Link>
        <div className="flex flex-col justify-between min-w-0">
          <div className="flex flex-col gap-1">
            <Link to={`/books/${review.book.slug}`}>
              <h2 className="font-['Inter'] font-semibold text-2xl leading-8 text-ink">
                {review.book.title}
              </h2>
            </Link>
            <p className="font-['Inter'] text-sm text-ink-muted">{review.book.author}</p>
          </div>
          {review.genre && (
            <span className="bg-accent/10 text-ink-muted text-xs font-medium px-3 py-1 rounded-xl w-fit mt-3">
              {review.genre}
            </span>
          )}
        </div>
      </div>

      <Link to={`/reviews/${review.id}`}>
        <p className="font-['Inter'] italic text-sm text-ink-muted leading-5 line-clamp-3">
          &ldquo;{review.review_text}&rdquo;
        </p>
      </Link>

      <div className="flex items-center gap-3 border-t border-border-strong/30 pt-[13px]">
        <UserLink username={review.user} className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar name={review.user} size={24} />
          <span className="font-['Inter'] font-medium text-xs text-ink-muted">Review by @{review.user}</span>
        </UserLink>
        <button type="button" onClick={onRemove} aria-label="Remove from saved" className="text-ink-muted">
          <X className="w-3 h-[13.5px]" />
        </button>
      </div>
    </article>
  );
}
