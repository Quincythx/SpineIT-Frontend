import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { api } from '../services/api';
import type { Review } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { ReviewCard } from '../components/ReviewCard';
import { TrendingDiscussions } from '../components/TrendingDiscussions';

type FeedTab = 'public' | 'following';

export function FeedPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<FeedTab>('public');
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [nextCursorUrl, setNextCursorUrl] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setReviews(null);
    setError(null);
    api
      .getFeed({ scope: tab })
      .then((page) => {
        if (cancelled) return;
        setReviews(page.results);
        setNextCursorUrl(page.next);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load the feed right now. Please try again later.');
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const handleLoadMore = async () => {
    if (!nextCursorUrl) return;
    setIsLoadingMore(true);
    try {
      const page = await api.getFeed({ scope: tab, cursorUrl: nextCursorUrl });
      setReviews((prev) => [...(prev ?? []), ...page.results]);
      setNextCursorUrl(page.next);
    } catch {
      setError('Could not load more reviews right now.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-8">
      {user && (
        <div className="flex gap-2 pb-8">
          <button
            type="button"
            onClick={() => setTab('public')}
            className={`font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-5 py-2.5 ${
              tab === 'public' ? 'bg-[#00464a] text-white' : 'text-[#3f4949]'
            }`}
          >
            Discover
          </button>
          <button
            type="button"
            onClick={() => setTab('following')}
            className={`font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-5 py-2.5 ${
              tab === 'following' ? 'bg-[#00464a] text-white' : 'text-[#3f4949]'
            }`}
          >
            Following
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-8 lg:gap-12">
          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3">{error}</p>
          )}
          {!error && reviews === null && (
            <p className="font-['Inter'] text-[#3f4949]">Loading the feed…</p>
          )}
          {tab === 'public' && reviews !== null && reviews.length === 0 && (
            <p className="font-['Inter'] text-[#3f4949]">
              No reviews yet — be the first to{' '}
              <Link to="/write" className="text-[#00464a] underline">
                write one
              </Link>
              .
            </p>
          )}
          {tab === 'following' && reviews !== null && reviews.length === 0 && (
            <p className="font-['Inter'] text-[#3f4949]">
              No reviews from readers you follow yet — visit a{' '}
              <Link to="/" className="text-[#00464a] underline" onClick={() => setTab('public')}>
                book or review
              </Link>{' '}
              to find people to follow.
            </p>
          )}
          {reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {nextCursorUrl && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="self-center font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#00464a] border-2 border-[#00464a] rounded-xl px-6 py-3 disabled:opacity-60"
            >
              {isLoadingMore ? 'Loading…' : 'Load More'}
            </button>
          )}
        </div>

        <div className="lg:col-span-1">
          <TrendingDiscussions />
        </div>
      </div>

      <Link
        to="/write"
        aria-label="Write a new review"
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-[#00464a] rounded-xl size-14 flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
      >
        <PenLine className="w-[18px] h-[18px] text-white" />
      </Link>
    </div>
  );
}
