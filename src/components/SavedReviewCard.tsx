import { X, BookOpen, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Review } from '../types/api';
import { Avatar } from './Avatar';
import { UserLink } from './UserLink';

export function SavedReviewCard({ review, onRemove }: { review: Review; onRemove: () => void }) {
  return (
    <article className="bg-white border border-border rounded-xl pl-5 pr-5 py-5 flex-1 min-w-0 flex flex-col gap-4">
      <div className="flex gap-4 items-start">
        <Link to={`/books/${review.book.slug}`} className="shrink-0">
          {review.image ? (
            <img src={review.image} alt={review.book.title} className="w-20 aspect-[2/3] object-cover rounded" />
          ) : (
            <div className="w-20 aspect-[2/3] bg-bg-hover rounded flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-ink-muted" />
            </div>
          )}
        </Link>
        <div className="flex flex-col justify-between min-w-0">
          <div className="flex flex-col gap-1">
            <Link to={`/books/${review.book.slug}`}>
              <h2 className="font-['Inter'] font-bold text-lg leading-6 text-ink">{review.book.title}</h2>
            </Link>
            <p className="font-['Inter'] text-sm text-ink-muted">{review.book.author}</p>
          </div>
          {review.genre && (
            <span className="bg-accent-tint text-accent-hover text-xs font-medium px-2.5 py-0.5 rounded-full w-fit mt-2">
              {review.genre}
            </span>
          )}
        </div>
      </div>

      <Link to={`/reviews/${review.id}`}>
        <p className="font-['Inter'] italic text-[15px] text-ink-muted leading-5 line-clamp-3">
          &ldquo;{review.review_text}&rdquo;
        </p>
      </Link>

      <div className="flex items-center gap-3 border-t border-border pt-3">
        <UserLink username={review.user} className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar name={review.user} src={review.user_avatar} size={22} />
          <span className="font-['Inter'] font-medium text-xs text-ink-muted">@{review.user}</span>
        </UserLink>
        <span className="flex items-center gap-1 text-ink-muted">
          <Heart className="w-3.5 h-3.5" />
          <span className="font-['Inter'] text-xs">{review.like_count}</span>
        </span>
        <span className="flex items-center gap-1 text-ink-muted">
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="font-['Inter'] text-xs">{review.comment_count}</span>
        </span>
        <button type="button" onClick={onRemove} aria-label="Remove from saved" className="text-ink-muted hover:text-accent">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
