import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, BookOpen } from 'lucide-react';
import type { Review } from '../types/api';
import { Avatar } from './Avatar';
import { UserLink } from './UserLink';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { api } from '../services/api';

export function ReviewCard({ review }: { review: Review }) {
  const [likeCount, setLikeCount] = useState(review.like_count);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

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

  return (
    <article className="bg-white rounded-lg shadow-[0px_4px_20px_0px_rgba(0,96,100,0.05)] overflow-hidden w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 pt-3 pb-[13px] border-b border-[#e5e2e1]">
        <UserLink username={review.user} className="flex items-center gap-3">
          <Avatar name={review.user} size={40} />
          <div>
            <p className="font-['Inter'] font-semibold text-sm text-[#1c1b1b]">{review.user}</p>
            <p className="font-['Inter'] text-xs text-[#3f4949]">{formatRelativeTime(review.created_at)}</p>
          </div>
        </UserLink>
      </div>

      <Link
        to={`/books/${review.book.slug}`}
        className="bg-[#f6f3f2] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-9"
      >
        {review.image ? (
          <img
            src={review.image}
            alt={review.book.title}
            className="aspect-[2/3] h-[220px] sm:h-[280px] object-cover rounded-r-sm shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
          />
        ) : (
          <div className="aspect-[2/3] h-[220px] sm:h-[280px] bg-[#e5e2e1] rounded-r-sm shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#3f4949]" />
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-1 pt-6 sm:pt-9 pr-4 sm:pr-6 pb-6 pl-3">
        <Link to={`/books/${review.book.slug}`}>
          <h2 className="font-['Playfair_Display'] font-bold text-2xl sm:text-[32px] leading-8 sm:leading-[40px] text-[#1c1b1b]">
            {review.book.title}
          </h2>
        </Link>
        <p className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#6f7979]">
          by {review.book.author}
        </p>

        {review.book.genre && (
          <div className="flex gap-2 pt-2">
            <span className="bg-[rgba(255,222,172,0.5)] text-[#604100] text-xs font-medium px-3 py-1 rounded-md">
              {review.book.genre}
            </span>
          </div>
        )}

        <p className="font-['Inter'] text-base text-[#1c1b1b] leading-[26px] py-5 whitespace-pre-line">
          {review.review_text}
        </p>

        <div className="flex items-center justify-between border-t border-[#e5e2e1] pt-[17px]">
          <div className="flex gap-6 items-center">
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center gap-2 text-[#3f4949]"
              aria-pressed={liked}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-[#00464a] text-[#00464a]' : ''}`} />
              <span className="font-['Inter'] font-medium text-xs">{likeCount}</span>
            </button>
            <Link to={`/reviews/${review.id}`} className="flex items-center gap-2 text-[#3f4949]">
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className="flex items-center gap-2 px-3 py-2 rounded font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#00464a] disabled:text-[#6f7979]"
          >
            <Bookmark className={`w-4 h-[18px] ${saved ? 'fill-current' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  );
}
