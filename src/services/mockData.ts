import type {
  User,
  Genre,
  Book,
  Review,
  Comment,
  Bookmark,
  Like,
  Favorite,
  ReadingList,
  ReadingListItem,
} from '../types/api';

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

function daysAgo(d: number): string {
  return hoursAgo(d * 24);
}

export const mockGenres: Genre[] = [
  { id: 1, name: 'Historical Fiction' },
  { id: 2, name: 'Literary' },
  { id: 3, name: 'Sci-Fi' },
  { id: 4, name: 'Philosophical' },
  { id: 5, name: 'Fantasy' },
  { id: 6, name: 'Romance' },
  { id: 7, name: 'Design' },
  { id: 8, name: 'Psychology' },
];

const SEED_BOOKS: Book[] = [
  {
    id: 1,
    slug: 'the-weight-of-ink',
    title: 'The Weight of Ink',
    author: 'Marcus Thorne',
    genre: 'Historical Fiction',
    average_rating: 4.8,
    review_count: 1,
    created_at: daysAgo(40),
  },
  {
    id: 2,
    slug: 'echoes-of-silica',
    title: 'Echoes of Silica',
    author: 'Anya Volkov',
    genre: 'Sci-Fi',
    average_rating: 4.2,
    review_count: 1,
    created_at: daysAgo(35),
  },
  {
    id: 3,
    slug: 'the-shadow-of-the-wind',
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    genre: 'Literary',
    average_rating: 5,
    review_count: 1,
    created_at: daysAgo(60),
  },
  {
    id: 4,
    slug: 'circe',
    title: 'Circe',
    author: 'Madeline Miller',
    genre: 'Fantasy',
    average_rating: 4.5,
    review_count: 1,
    created_at: daysAgo(70),
  },
  {
    id: 5,
    slug: 'the-night-circus',
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    genre: 'Fantasy',
    average_rating: 4.5,
    review_count: 0,
    created_at: daysAgo(90),
  },
  {
    id: 6,
    slug: 'the-echoes-of-time',
    title: 'The Echoes of Time',
    author: 'Julian Barnes',
    genre: 'Historical Fiction',
    average_rating: 4.5,
    review_count: 1,
    created_at: daysAgo(20),
  },
];

const SEED_USERS: User[] = [
  {
    id: 1,
    username: 'jane_reader',
    email: 'jane@spineit.com',
    bio: 'Seeking sanctuary in the margins. Devoted to contemporary fiction and magical realism. Always brewing a fresh pot of Earl Grey.',
    is_verified: true,
    avatar: null,
  },
  {
    id: 2,
    username: 'elena_rostova',
    email: 'elena@spineit.com',
    bio: 'Verified Reader.',
    is_verified: true,
    avatar: null,
  },
  {
    id: 3,
    username: 'david_chen',
    email: 'david@spineit.com',
    bio: null,
    is_verified: false,
    avatar: null,
  },
];

const SEED_REVIEWS: Review[] = [
  {
    id: 1,
    user: 'elena_rostova',
    book: SEED_BOOKS[0],
    review_text:
      "Thorne's latest is a masterclass in atmospheric storytelling. The way he describes the scent of old paper and the quiet desperation of the protagonist is palpable. I found myself lingering on pages just to soak in the prose. A must-read for anyone who loves books about books.",
    rating: 5,
    image: null,
    like_count: 124,
    created_at: hoursAgo(2),
    updated_at: hoursAgo(2),
  },
  {
    id: 2,
    user: 'david_chen',
    book: SEED_BOOKS[1],
    review_text:
      "An incredibly dense but rewarding read. Volkov tackles the nature of consciousness not with lasers and space battles, but with quiet conversations in sterile rooms. It's slow, demanding, and utterly brilliant.",
    rating: 4,
    image: null,
    like_count: 89,
    created_at: hoursAgo(5),
    updated_at: hoursAgo(5),
  },
  {
    id: 3,
    user: 'jane_reader',
    book: SEED_BOOKS[2],
    review_text:
      'A captivating love letter to literature. Zafón weaves a mesmerizing tale through the gothic streets of Barcelona. Every page smells of old paper and secrets. A true masterpiece.',
    rating: 5,
    image: null,
    like_count: 12,
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
  {
    id: 4,
    user: 'jane_reader',
    book: SEED_BOOKS[3],
    review_text:
      'Miller breathes breathtaking life into ancient myth. Circe is transformed from a peripheral villain into a complex, relatable protagonist discovering her own power. Beautifully written from start to finish.',
    rating: 4.5,
    image: null,
    like_count: 8,
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: 5,
    user: 'elena_rostova',
    book: SEED_BOOKS[5],
    review_text:
      "Barnes has an uncanny ability to distill the vast, terrifying expanse of history into deeply intimate, almost suffocatingly personal moments. In \"The Echoes of Time,\" he abandons the sprawling narrative structures of his earlier work for something tighter, more constrained, and ultimately more devastating. The novel is framed not around grand events, but the quiet, reverberating aftermath of those events—the silences between the ticking of the clock.\n\nThe prose here is sparse, almost skeletal. It demands patience. I found myself having to slow down, rereading sentences not because they were complex, but because they held a weight that wasn't immediately apparent.\n\n\"We do not remember days; we remember moments where the light caught the dust just right, and for a second, everything was perfectly still.\"\n\nWhere the book falters slightly is in its pacing during the middle third. However, the final twenty pages are a masterclass in emotional resonance. Highly recommended.",
    rating: 4.5,
    image: null,
    like_count: 245,
    created_at: hoursAgo(2),
    updated_at: hoursAgo(2),
  },
];

const SEED_COMMENTS: Comment[] = [
  {
    id: 1,
    review: 5,
    user: 'Marcus T.',
    text: "Spot on review, Elena. I entirely agree about the pacing in the middle third. I almost put it down, but that ending... it really does stick with you.",
    created_at: hoursAgo(1),
  },
  {
    id: 2,
    review: 5,
    user: 'elena_rostova',
    text: 'Glad you powered through it, Marcus! The payoff is definitely worth the slight slog.',
    created_at: hoursAgo(0.75),
  },
  {
    id: 3,
    review: 5,
    user: 'Sarah J.',
    text: "I loved \"The Sense of an Ending,\" so based on your recommendation I'm definitely picking this up next! That quote you pulled is beautiful.",
    created_at: hoursAgo(3),
  },
];

const SEED_LIKES: Like[] = [];

const SEED_BOOKMARKS: Bookmark[] = [
  { id: 1, review: 1, user: 'jane_reader', created_at: daysAgo(1) },
  { id: 2, review: 2, user: 'jane_reader', created_at: daysAgo(2) },
];

const SEED_FAVORITES: Favorite[] = [];

const SEED_READING_LISTS: ReadingList[] = [{ id: 1, name: 'My Shelf', item_count: 1, created_at: daysAgo(10) }];

const SEED_READING_LIST_ITEMS: ReadingListItem[] = [
  { id: 1, reading_list_id: 1, book: SEED_BOOKS[4], added_at: daysAgo(2) },
];

// Follows and notifications have no equivalent in the real backend contract
// yet, so these types live only here (mock-only), not in src/types/api.ts.
export interface Follow {
  id: number;
  follower: string;
  following: string;
  created_at: string;
}

export type NotificationType = 'like' | 'comment' | 'follow';

export interface AppNotification {
  id: number;
  recipient: string;
  actor: string;
  type: NotificationType;
  reviewId?: number;
  read: boolean;
  created_at: string;
}

const SEED_FOLLOWS: Follow[] = [
  { id: 1, follower: 'jane_reader', following: 'elena_rostova', created_at: daysAgo(6) },
  { id: 2, follower: 'david_chen', following: 'jane_reader', created_at: daysAgo(4) },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    recipient: 'jane_reader',
    actor: 'elena_rostova',
    type: 'follow',
    read: false,
    created_at: daysAgo(4),
  },
];

const SEED_NEXT_IDS = {
  user: 4,
  book: 7,
  review: 6,
  comment: 4,
  like: 1,
  bookmark: 3,
  favorite: 1,
  readingList: 2,
  readingListItem: 2,
  follow: 3,
  notification: 2,
};

// Mock data lives only in the browser tab's memory by default, which would
// otherwise silently reset to the seed on every full page reload (not just
// SPA navigation). Persisting it to localStorage makes the demo behave like
// a real backend within a browser session. Cleared automatically if the
// shape changes (e.g. after an app update) via STORAGE_VERSION.
const STORAGE_KEY = 'spineit_mock_snapshot_v1';

interface Snapshot {
  users: User[];
  books: Book[];
  reviews: Review[];
  comments: Comment[];
  likes: Like[];
  bookmarks: Bookmark[];
  favorites: Favorite[];
  readingLists: ReadingList[];
  readingListItems: ReadingListItem[];
  follows: Follow[];
  notifications: AppNotification[];
  nextIds: typeof SEED_NEXT_IDS;
}

function loadSnapshot(): Snapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Snapshot) : null;
  } catch {
    return null;
  }
}

const snapshot = loadSnapshot();

export const mockUsers: User[] = snapshot?.users ?? [...SEED_USERS];
export const mockBooks: Book[] = snapshot?.books ?? [...SEED_BOOKS];
export const mockReviews: Review[] = snapshot?.reviews ?? [...SEED_REVIEWS];
export const mockComments: Comment[] = snapshot?.comments ?? [...SEED_COMMENTS];
export const mockLikes: Like[] = snapshot?.likes ?? [...SEED_LIKES];
export const mockBookmarks: Bookmark[] = snapshot?.bookmarks ?? [...SEED_BOOKMARKS];
export const mockFavorites: Favorite[] = snapshot?.favorites ?? [...SEED_FAVORITES];
export const mockReadingLists: ReadingList[] = snapshot?.readingLists ?? [...SEED_READING_LISTS];
export const mockReadingListItems: ReadingListItem[] = snapshot?.readingListItems ?? [...SEED_READING_LIST_ITEMS];
export const mockFollows: Follow[] = snapshot?.follows ?? [...SEED_FOLLOWS];
export const mockNotifications: AppNotification[] = snapshot?.notifications ?? [...SEED_NOTIFICATIONS];
export const mockNextIds = snapshot?.nextIds ?? { ...SEED_NEXT_IDS };

export function persistMockData() {
  const data: Snapshot = {
    users: mockUsers,
    books: mockBooks,
    reviews: mockReviews,
    comments: mockComments,
    likes: mockLikes,
    bookmarks: mockBookmarks,
    favorites: mockFavorites,
    readingLists: mockReadingLists,
    readingListItems: mockReadingListItems,
    follows: mockFollows,
    notifications: mockNotifications,
    nextIds: mockNextIds,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — the session just won't persist across reloads.
  }
}

export function resetMockData() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
