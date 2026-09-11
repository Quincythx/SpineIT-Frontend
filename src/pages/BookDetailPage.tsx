import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, PenLine } from 'lucide-react';
import { api } from '../services/api';
import type { Book, Review } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { RatingDistribution } from '../components/RatingDistribution';
import { BookPageReviewEntry } from '../components/BookPageReviewEntry';

export function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    if (!slug) return;
    api
      .getBook(slug)
      .then((b) => {
        setBook(b);
        return api.getReviews({ book: b.id }).then((res) => setReviews(res.results));
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  const myReview = useMemo(
    () => (user ? reviews?.find((r) => r.user === user.username) ?? null : null),
    [reviews, user]
  );

  if (notFound) {
    return (
      <div className="max-w-[672px] mx-auto px-4 sm:px-6 lg:px-16 py-24 text-center">
        <p className="font-['Inter'] text-ink-muted">
          This book couldn't be found.{' '}
          <Link to="/explore" className="text-accent underline">
            Back to Explore
          </Link>
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-12">
        <p className="font-['Inter'] text-ink-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-8 lg:py-12 flex flex-col gap-12">
      <div className="bg-white rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] p-6 sm:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-12">
          <div className="sm:col-span-4">
            <div className="w-full max-w-[240px] sm:max-w-none mx-auto sm:mx-0 aspect-[2/3] bg-bg-hover rounded-r flex items-center justify-center overflow-hidden">
              {book.cover_image ? (
                <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-10 h-10 text-ink-muted" />
              )}
            </div>
          </div>

          <div className="sm:col-span-8 flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
            <h1 className="font-['Inter'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-ink tracking-[-0.96px]">
              {book.title}
            </h1>
            <p className="font-['Inter'] italic text-lg text-ink-muted">by {book.author}</p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
              {user &&
                (myReview ? (
                  <Link
                    to={`/reviews/${myReview.id}`}
                    className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-accent underline"
                  >
                    View your review
                  </Link>
                ) : (
                  <Link
                    to={`/write?book=${book.slug}`}
                    className="flex items-center gap-2 bg-accent text-white font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-6 py-3 w-full sm:w-auto justify-center"
                  >
                    <PenLine className="w-4 h-4" />
                    Write a Review
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          {reviews === null ? (
            <p className="font-['Inter'] text-ink-muted">Loading ratings…</p>
          ) : (
            <RatingDistribution ratings={reviews.map((r) => r.rating)} />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="font-['Inter'] font-semibold text-2xl text-ink">
          Reviews {reviews ? `(${reviews.length})` : ''}
        </h2>
        {reviews === null && <p className="font-['Inter'] text-ink-muted">Loading reviews…</p>}
        {reviews?.length === 0 && (
          <p className="font-['Inter'] text-ink-muted">
            No reviews yet for this book —{' '}
            {user ? (
              <Link to={`/write?book=${book.slug}`} className="text-accent underline">
                write the first one
              </Link>
            ) : (
              <Link to="/login" className="text-accent underline">
                log in to write one
              </Link>
            )}
            .
          </p>
        )}
        <div className="flex flex-col gap-4">
          {reviews?.map((review) => (
            <BookPageReviewEntry key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
