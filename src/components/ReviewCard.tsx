import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, BookOpen } from 'lucide-react';
import type { Review } from '../types/api';
import { Avatar } from './Avatar';
import { UserLink } from './UserLink';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { api } from '../services/api';

const TEXT_CLAMP_LENGTH = 320;

export function ReviewCard({ review }: { review: Review }) {
  const [likeCount, setLikeCount] = useState(review.like_count);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikeCount((c) => c + 1);
    try {
      await api.addLike(review.id);
    } catch {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  const handleSave = async () => {
    if (saved) return;
    setSaved(true);
    try {
      await api.addBookmark(review.id);
    } catch {
      setSaved(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(`${window.location.origin}/reviews/${review.id}`);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  const isLong = review.review_text.length > TEXT_CLAMP_LENGTH;
  const shownText = isLong && !expanded ? `${review.review_text.slice(0, TEXT_CLAMP_LENGTH)}…` : review.review_text;

  return (
    <article className="border-b border-border px-4 py-3 flex gap-3 w-full">
      <UserLink username={review.user} className="shrink-0">
        <Avatar name={review.user} size={40} />
      </UserLink>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <UserLink username={review.user} className="font-['Inter'] font-bold text-[15px] text-ink hover:underline">
            {review.user}
          </UserLink>
          <span className="text-ink-muted">·</span>
          <span className="font-['Inter'] text-sm text-ink-muted">{formatRelativeTime(review.created_at)}</span>
        </div>

        <Link to={`/books/${review.book.slug}`} className="flex items-center gap-1.5 w-fit hover:underline">
          <BookOpen className="w-3.5 h-3.5 text-ink-muted shrink-0" />
          <span className="font-['Inter'] font-semibold text-sm text-ink">{review.book.title}</span>
          <span className="font-['Inter'] text-sm text-ink-muted">by {review.book.author}</span>
        </Link>

        {review.genre && (
          <span className="bg-accent-tint text-accent-hover text-xs font-medium px-2.5 py-0.5 rounded-full w-fit mt-0.5">
            {review.genre}
          </span>
        )}

        <p className="font-['Inter'] text-[15px] text-ink leading-[22px] whitespace-pre-line mt-1">
          {shownText}
          {isLong && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-accent font-semibold ml-1 hover:underline"
            >
              Show more
            </button>
          )}
        </p>

        {review.image && (
          <Link to={`/reviews/${review.id}`} className="mt-2 block">
            <img
              src={review.image}
              alt={review.book.title}
              className="w-full max-h-80 object-cover rounded-2xl border border-border"
            />
          </Link>
        )}

        <div className="flex items-center justify-between max-w-md mt-2 -ml-2">
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-2 text-ink-muted hover:text-accent px-2 py-1.5 rounded-full"
            aria-pressed={liked}
          >
            <Heart className={`w-[18px] h-[18px] ${liked ? 'fill-accent text-accent' : ''}`} />
            <span className="font-['Inter'] text-[13px]">{likeCount}</span>
          </button>
          <Link
            to={`/reviews/${review.id}`}
            className="flex items-center gap-2 text-ink-muted hover:text-accent px-2 py-1.5 rounded-full"
          >
            <MessageCircle className="w-[18px] h-[18px]" />
            <span className="font-['Inter'] text-[13px]">{review.comment_count}</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center px-2 py-1.5 rounded-full ${saved ? 'text-accent' : 'text-ink-muted hover:text-accent'}`}
            aria-label={saved ? 'Saved' : 'Save'}
          >
            <Bookmark className={`w-[18px] h-[18px] ${saved ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-ink-muted hover:text-accent px-2 py-1.5 rounded-full"
            aria-label="Copy link"
          >
            <Share2 className="w-[18px] h-[18px]" />
            {shareStatus === 'copied' && <span className="font-['Inter'] text-[13px]">Copied</span>}
          </button>
        </div>
      </div>
    </article>
  );
}
