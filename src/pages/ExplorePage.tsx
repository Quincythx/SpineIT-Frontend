import { useEffect, useState } from 'react';
import { Search, Sparkles, MessagesSquare } from 'lucide-react';
import { api } from '../services/api';
import type { Book, Review, Genre } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { BookMiniCard } from '../components/BookMiniCard';
import { ReviewSnippetCard } from '../components/ReviewSnippetCard';

const RATING_OPTIONS = [0, 3, 4, 4.5];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Title A–Z' },
] as const;

export function ExplorePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]['value']>('newest');
  const [allBooks, setAllBooks] = useState<Book[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [genreReviews, setGenreReviews] = useState<Review[] | null>(null);

  const isFiltered = Boolean(query || selectedGenreId || minRating > 0);
  const selectedGenreName = genres.find((g) => g.id === selectedGenreId)?.name;

  useEffect(() => {
    api.getGenres().then(setGenres).catch(() => setGenres([]));
    api
      .getReviews()
      .then((res) => setReviews(res.results.slice(0, 2)))
      .catch(() => setReviews([]));
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      api
        .getBooks(query ? { search: query } : undefined)
        .then(setAllBooks)
        .catch(() => setAllBooks([]));
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  // Genre is a per-review tag, not a book property, so filtering by genre
  // means fetching reviews tagged with it -- not filtering the book list.
  useEffect(() => {
    if (selectedGenreId == null) {
      setGenreReviews(null);
      return;
    }
    api
      .getReviews({ genre: selectedGenreId })
      .then((res) => setGenreReviews(res.results))
      .catch(() => setGenreReviews([]));
  }, [selectedGenreId]);

  const books = allBooks
    ?.filter((b) => (b.average_rating ?? 0) >= minRating)
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.average_rating ?? 0) - (a.average_rating ?? 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 12);

  const displayedReviews = selectedGenreId != null ? genreReviews : reviews;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-8 lg:py-12 flex flex-col items-center gap-12 lg:gap-20">
      {!user && (
        <div className="flex flex-col items-center gap-6 text-center max-w-[672px] pt-4 lg:pt-8">
          <h1 className="font-['Inter'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-accent tracking-[-0.96px]">
            Discover Your Next Obsession
          </h1>
          <p className="font-['Inter'] text-lg text-ink-muted">
            Search millions of books, authors, and community reviews in our digital sanctuary.
          </p>
        </div>
      )}

      <div className="w-full max-w-[672px] flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, authors, or topics..."
            className="w-full bg-bg-hover border border-border-strong border-b-2 rounded-t pl-[49px] pr-4 pt-[15px] pb-4 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedGenreId ?? ''}
            onChange={(e) => setSelectedGenreId(e.target.value ? Number(e.target.value) : null)}
            className="bg-white border border-border-strong rounded-xl px-3 py-2 font-['Inter'] text-sm text-ink outline-none"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-white border border-border-strong rounded-xl px-3 py-2 font-['Inter'] text-sm text-ink outline-none"
          >
            {RATING_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r === 0 ? 'Any Rating' : `${r}+ Stars`}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-border-strong rounded-xl px-3 py-2 font-['Inter'] text-sm text-ink outline-none"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="w-full flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-[21px] h-[21px] text-accent" />
          <h2 className="font-['Inter'] font-semibold text-2xl text-ink">
            {isFiltered ? 'Search Results' : 'Your Next Read'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {books === undefined && <p className="font-['Inter'] text-ink-muted">Loading…</p>}
          {books?.length === 0 && <p className="font-['Inter'] text-ink-muted">No books match those filters.</p>}
          {books?.map((book) => (
            <BookMiniCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="w-full flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <MessagesSquare className="w-[21px] h-[21px] text-accent" />
          <h2 className="font-['Inter'] font-semibold text-2xl text-ink">
            {selectedGenreName ? `Reviews tagged "${selectedGenreName}"` : 'Trending Reviews'}
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 w-full">
          {displayedReviews === null && <p className="font-['Inter'] text-ink-muted">Loading…</p>}
          {displayedReviews?.length === 0 && (
            <p className="font-['Inter'] text-ink-muted">
              {selectedGenreName ? `No reviews tagged "${selectedGenreName}" yet.` : 'No reviews yet.'}
            </p>
          )}
          {displayedReviews?.map((review) => (
            <ReviewSnippetCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}
