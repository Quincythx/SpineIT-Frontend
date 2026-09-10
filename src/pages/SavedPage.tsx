import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { api } from '../services/api';
import type { Review } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { SavedReviewCard } from '../components/SavedReviewCard';
import savedTeaserImage from '../assets/auth/saved-reviews-teaser.jpg';

interface SavedItem {
  bookmarkId: number;
  review: Review;
}

export function SavedPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .getBookmarks()
      .then((bookmarks) =>
        Promise.all(
          bookmarks.map((b) => api.getReview(b.review).then((review) => ({ bookmarkId: b.id, review })))
        )
      )
      .then(setItems)
      .catch(() => setItems([]));
  }, [user]);

  const handleRemove = async (bookmarkId: number) => {
    setItems((prev) => prev?.filter((item) => item.bookmarkId !== bookmarkId) ?? null);
    try {
      await api.removeBookmark(bookmarkId);
    } catch {
      // Re-fetch on failure rather than leaving state inconsistent.
      api
        .getBookmarks()
        .then((bookmarks) =>
          Promise.all(
            bookmarks.map((b) => api.getReview(b.review).then((review) => ({ bookmarkId: b.id, review })))
          )
        )
        .then(setItems);
    }
  };

  if (!user) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-12 lg:py-24 flex justify-center">
        <div className="max-w-[900px] w-full bg-white border border-border rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] flex overflow-hidden">
          <div className="flex-1 bg-bg-hover hidden md:block">
            <img src={savedTeaserImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 p-6 sm:p-16 flex flex-col items-start justify-center gap-6">
            <span className="bg-[rgba(254,179,0,0.2)] flex items-center gap-2 px-3 py-1 rounded-xl">
              <Bookmark className="w-[11px] h-[13px] text-[#6a4800]" />
              <span className="font-['Inter'] font-medium text-xs text-[#6a4800]">Saved Reviews</span>
            </span>
            <h1 className="font-['Inter'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[60px] text-accent tracking-[-1.2px]">
              Your Personal Curation Awaits
            </h1>
            <p className="font-['Inter'] text-lg text-ink-muted leading-[29px]">
              Sign up to start saving your favorite reviews and building your digital sanctuary. Keep track of the
              insights that move you and curate a library of thoughtful perspectives.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link
                to="/signup"
                className="bg-accent text-white font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-12 py-3 text-center"
              >
                Create an Account
              </Link>
              <Link to="/login" className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-accent underline">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-8 lg:py-12 flex flex-col gap-8 lg:gap-12">
      <div className="border-b border-border-strong pb-6 flex flex-col gap-3">
        <h1 className="font-['Inter'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-accent tracking-[-0.96px]">
          Saved Reads
        </h1>
        <p className="font-['Inter'] text-lg text-ink-muted">Your personal curation of community insights.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-stretch flex-wrap">
        {items === null && <p className="font-['Inter'] text-ink-muted">Loading…</p>}
        {items?.length === 0 && (
          <p className="font-['Inter'] text-ink-muted">
            Nothing saved yet — browse the{' '}
            <Link to="/" className="text-accent underline">
              feed
            </Link>{' '}
            and save a review you like.
          </p>
        )}
        {items?.map((item) => (
          <SavedReviewCard key={item.bookmarkId} review={item.review} onRemove={() => handleRemove(item.bookmarkId)} />
        ))}
      </div>
    </div>
  );
}
