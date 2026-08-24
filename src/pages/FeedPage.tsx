import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { api } from '../services/api';
import { socialApi } from '../services/socialApi';
import type { Review } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { ReviewCard } from '../components/ReviewCard';
import { TrendingDiscussions } from '../components/TrendingDiscussions';

type FeedTab = 'discover' | 'following';

export function FeedPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<FeedTab>('discover');
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [followingUsernames, setFollowingUsernames] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getReviews()
      .then((res) => {
        if (!cancelled) setReviews(res.results);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load the feed right now. Please try again later.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    socialApi.getFollowingUsernames(user.username).then(setFollowingUsernames);
  }, [user]);

  const visibleReviews =
    tab === 'following' && followingUsernames
      ? reviews?.filter((r) => followingUsernames.includes(r.user))
      : reviews;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-8">
      {user && (
        <div className="flex gap-2 pb-8">
          <button
            type="button"
            onClick={() => setTab('discover')}
            className={`font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-5 py-2.5 ${
              tab === 'discover' ? 'bg-[#00464a] text-white' : 'text-[#3f4949]'
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
          {tab === 'discover' && reviews !== null && reviews.length === 0 && (
            <p className="font-['Inter'] text-[#3f4949]">
              No reviews yet — be the first to{' '}
              <Link to="/write" className="text-[#00464a] underline">
                write one
              </Link>
              .
            </p>
          )}
          {tab === 'following' && visibleReviews !== undefined && visibleReviews?.length === 0 && (
            <p className="font-['Inter'] text-[#3f4949]">
              No reviews from readers you follow yet — visit a{' '}
              <Link to="/" className="text-[#00464a] underline" onClick={() => setTab('discover')}>
                book or review
              </Link>{' '}
              to find people to follow.
            </p>
          )}
          {visibleReviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
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
