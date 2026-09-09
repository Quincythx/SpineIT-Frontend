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
        <p className="font-['Inter'] text-[#3f4949]">
          <Link to="/login" className="text-[#00464a] underline">
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
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#fcf9f8]">
      <div className="sticky top-0 bg-[#fcf9f8] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between h-16 px-6 z-10">
        <button type="button" onClick={() => navigate(-1)} aria-label="Cancel" className="text-[#1c1b1b] p-2 rounded-xl">
          <X className="w-[14px] h-[14px]" />
        </button>
        <h1 className="font-['Playfair_Display'] font-semibold text-2xl text-[#00464a] tracking-[-0.6px]">
          Write Review
        </h1>
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#00464a] p-2 disabled:opacity-60"
        >
          {isSubmitting ? 'Posting…' : 'Post'}
        </button>
      </div>

      <div className="max-w-[640px] mx-auto px-4 py-12 flex flex-col gap-12">
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3">{error}</p>}

        {existingBook && (
          <div className="flex items-center gap-4 bg-[#f6f3f2] rounded p-4">
            <div className="w-16 h-24 bg-[#e5e2e1] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-[#3f4949]" />
            </div>
            <div>
              <p className="font-['Playfair_Display'] font-semibold text-xl text-[#1c1b1b]">{existingBook.title}</p>
              <p className="font-['Inter'] text-sm text-[#3f4949]">by {existingBook.author}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-48 h-[288px] border border-[#bec8c9] rounded bg-[#f6f3f2] flex flex-col items-center justify-center gap-3 overflow-hidden shadow-[inset_4px_0px_8px_1px_rgba(0,0,0,0.1)]"
          >
            {reviewImagePreview ? (
              <img src={reviewImagePreview} alt="Your photo" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="w-8 h-8 text-[#bec8c9]" />
                <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#bec8c9]">
                  Add a Photo
                </span>
              </>
            )}
          </button>
          <p className="font-['Inter'] text-xs text-[#6f7979] text-center max-w-[280px]">
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
                className="w-full border-b border-[#bec8c9] pb-3 font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b] placeholder:text-[#bec8c9] outline-none focus:border-[#00464a] bg-transparent"
              />
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                className="w-full border-b border-[#bec8c9] pb-3 font-['Inter'] text-lg text-[#1c1b1b] placeholder:text-[#bec8c9] outline-none focus:border-[#00464a] bg-transparent"
              />
            </>
          )}

          <div className="flex items-center pt-3">
            <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#3f4949]">Rating:</span>
            <div className="flex pl-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star`}>
                  <Star
                    className={`w-5 h-5 ${value <= rating ? 'fill-[#7e5700] text-[#7e5700]' : 'text-[#bec8c9]'}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#eae7e7] rounded-xl overflow-hidden">
            <div
              className="absolute left-0 right-0 bottom-0 bg-[#00464a] rounded-xl"
              style={{ height: `${Math.min((reviewText.length / 500) * 100, 100)}%` }}
            />
          </div>
          <textarea
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts. What did you love? What fell flat?"
            rows={10}
            className="w-full bg-white border border-[#bec8c9] rounded shadow-[0px_4px_20px_0px_rgba(0,96,100,0.05)] p-6 font-['Inter'] text-base text-[#1c1b1b] placeholder:text-[#6b7280] outline-none focus:border-[#00464a] resize-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#3f4949]">
            Tag a Genre
          </label>
          <p className="font-['Inter'] text-xs text-[#6f7979] -mt-2">
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
                      ? 'bg-[rgba(255,222,172,0.5)] border-[rgba(126,87,0,0.2)] text-[#1c1b1b]'
                      : 'bg-white border-[#e5e2e1] text-[#3f4949]'
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
