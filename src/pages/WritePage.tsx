import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { X, Star, Camera, Plus, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import type { Genre, Book } from '../types/api';
import { useAuth } from '../context/AuthContext';

export function WritePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const bookSlug = searchParams.get('book');

  const [existingBook, setExistingBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
  const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    if (!bookSlug) return;
    api
      .getBook(bookSlug)
      .then((b) => {
        setExistingBook(b);
        setTitle(b.title);
        setAuthor(b.author);
      })
      .catch(() => setError('Could not load that book. Try again from the book page.'));
  }, [bookSlug]);

  if (!user) {
    return (
      <div className="max-w-[672px] mx-auto px-4 sm:px-6 lg:px-16 py-24 text-center">
        <p className="font-['Inter'] text-ink-muted">
          <Link to="/login" className="text-accent underline">
            Log in
          </Link>{' '}
          to write a review.
        </p>
      </div>
    );
  }

  const handleReviewImageChange = (file: File | null) => {
    setReviewImageFile(file);
    setReviewImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || rating === 0 || !reviewText.trim()) {
      setError('Please fill in the title, author, a rating, and your review.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const bookId = existingBook
        ? existingBook.id
        : (
            await api.createBook({
              title: title.trim(),
              author: author.trim(),
            })
          ).id;
      const review = await api.createReview({
        book_id: bookId,
        genre_id: selectedGenreId,
        review_text: reviewText.trim(),
        rating,
        image: reviewImageFile,
      });
      navigate(`/reviews/${review.id}`);
    } catch {
      setError('Could not publish your review. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-bg">
      <div className="sticky top-0 bg-bg drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between h-16 px-6 z-10">
        <button type="button" onClick={() => navigate(-1)} aria-label="Cancel" className="text-ink p-2 rounded-xl">
          <X className="w-[14px] h-[14px]" />
        </button>
        <h1 className="font-['Inter'] font-semibold text-2xl text-accent tracking-[-0.6px]">
          Write Review
        </h1>
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-accent p-2 disabled:opacity-60"
        >
          {isSubmitting ? 'Posting…' : 'Post'}
        </button>
      </div>

      <div className="max-w-[640px] mx-auto px-4 py-12 flex flex-col gap-12">
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3">{error}</p>}

        {existingBook && (
          <div className="flex items-center gap-4 bg-bg-hover rounded p-4">
            <div className="w-16 h-24 bg-border flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-ink-muted" />
            </div>
            <div>
              <p className="font-['Inter'] font-semibold text-xl text-ink">{existingBook.title}</p>
              <p className="font-['Inter'] text-sm text-ink-muted">by {existingBook.author}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-48 h-[288px] border border-border-strong rounded bg-bg-hover flex flex-col items-center justify-center gap-3 overflow-hidden shadow-[inset_4px_0px_8px_1px_rgba(0,0,0,0.1)]"
          >
            {reviewImagePreview ? (
              <img src={reviewImagePreview} alt="Your photo" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="w-8 h-8 text-border-strong" />
                <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-border-strong">
                  Add a Photo
                </span>
              </>
            )}
          </button>
          <p className="font-['Inter'] text-xs text-ink-muted text-center max-w-[280px]">
            Optional — a cover, a page that stayed with you, or a photo of yourself reading it. Whatever inspired this review.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleReviewImageChange(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex flex-col gap-6">
          {!existingBook && (
            <>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book Title"
                className="w-full border-b border-border-strong pb-3 font-['Inter'] font-semibold text-2xl text-ink placeholder:text-border-strong outline-none focus:border-accent bg-transparent"
              />
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                className="w-full border-b border-border-strong pb-3 font-['Inter'] text-lg text-ink placeholder:text-border-strong outline-none focus:border-accent bg-transparent"
              />
            </>
          )}

          <div className="flex items-center pt-3">
            <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-ink-muted">Rating:</span>
            <div className="flex pl-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star`}>
                  <Star
                    className={`w-5 h-5 ${value <= rating ? 'fill-accent text-accent' : 'text-border-strong'}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-border rounded-xl overflow-hidden">
            <div
              className="absolute left-0 right-0 bottom-0 bg-accent rounded-xl"
              style={{ height: `${Math.min((reviewText.length / 500) * 100, 100)}%` }}
            />
          </div>
          <textarea
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts. What did you love? What fell flat?"
            rows={10}
            className="w-full bg-white border border-border-strong rounded shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] p-6 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none focus:border-accent resize-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-ink-muted">
            Tag a Genre
          </label>
          <p className="font-['Inter'] text-xs text-ink-muted -mt-2">
            Optional — pick whichever genre your take on this book fits best.
          </p>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isSelected = selectedGenreId === genre.id;
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => setSelectedGenreId(isSelected ? null : genre.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl border text-xs font-medium ${
                    isSelected
                      ? 'bg-accent-tint border-accent/20 text-ink'
                      : 'bg-white border-border text-ink-muted'
                  }`}
                >
                  {!isSelected && <Plus className="w-[9px] h-[9px]" />}
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}
