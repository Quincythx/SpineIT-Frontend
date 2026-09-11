import type {
  AuthTokens,
  User,
  Book,
  CreateBookInput,
  Review,
  CreateReviewInput,
  Comment,
  Like,
  Bookmark,
  Favorite,
  PaginatedResponse,
  SendCodePayload,
  VerifyCodeAndRegisterPayload,
  RegisterResult,
  Follow,
  Notification,
  NotificationType,
  CursorPage,
} from '../types/api';
import {
  mockGenres,
  mockUsers,
  mockBooks,
  mockReviews,
  mockComments,
  mockLikes,
  mockBookmarks,
  mockFavorites,
  mockFollows,
  mockNotifications,
  mockNextIds,
  persistMockData,
} from './mockData';

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function fail(message: string): never {
  throw new Error(message);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function currentUserId(): number | null {
  const token = localStorage.getItem('spineit_access_token');
  if (!token?.startsWith('mock-')) return null;
  const id = Number(token.replace('mock-', ''));
  return Number.isFinite(id) ? id : null;
}

function requireCurrentUser(): User {
  const id = currentUserId();
  const user = mockUsers.find((u) => u.id === id);
  if (!user) fail('Not authenticated');
  return user;
}

function recalcBookStats(bookId: number) {
  const book = mockBooks.find((b) => b.id === bookId);
  if (!book) return;
  const reviewsForBook = mockReviews.filter((r) => r.book.id === bookId);
  book.review_count = reviewsForBook.length;
  book.average_rating = reviewsForBook.length
    ? Math.round((reviewsForBook.reduce((sum, r) => sum + r.rating, 0) / reviewsForBook.length) * 10) / 10
    : null;

  // Mirrors the backend: stand in with the most-liked review's photo,
  // since a book has no cover of its own.
  const withImage = reviewsForBook
    .filter((r) => r.image)
    .sort((a, b) => b.like_count - a.like_count || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  book.cover_image = withImage[0]?.image ?? null;
}

// Simulates what the real backend's signals do automatically on Like/Comment/
// Follow -- only ever called from within this file, never by the client.
function notify(recipient: string, actor: string, type: NotificationType, reviewId?: number) {
  if (recipient === actor) return;
  mockNotifications.push({
    id: mockNextIds.notification++,
    recipient,
    actor,
    type,
    review: reviewId ?? null,
    read: false,
    created_at: new Date().toISOString(),
  });
}

function notifyLike(recipient: string, actor: string, reviewId: number) {
  notify(recipient, actor, 'like', reviewId);
}

function notifyComment(recipient: string, actor: string, reviewId: number) {
  notify(recipient, actor, 'comment', reviewId);
}

const mockApiRaw = {
  // --- AUTH ---
  login: async ({ username }: { username: string; password: string }): Promise<AuthTokens> => {
    const match = mockUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()
    );
    if (!match) fail('No account found with that email. Try signing up first.');
    return delay({ access: `mock-${match.id}`, refresh: `mock-refresh-${match.id}` });
  },

  sendVerificationCode: async ({ email }: SendCodePayload): Promise<{ detail: string }> => {
    if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      fail('A verified account with this email already exists.');
    }
    return delay({ detail: 'Verification code sent (mock). Use 000000 to continue.' });
  },

  verifyCode: async ({ code }: { email: string; code: string }): Promise<{ detail: string }> => {
    if (code !== '000000') {
      fail('Invalid verification code. Use 000000 in demo mode.');
    }
    return delay({ detail: 'Code is valid.' });
  },

  verifyCodeAndRegister: async ({
    email,
    code,
    username,
  }: VerifyCodeAndRegisterPayload): Promise<RegisterResult> => {
    if (mockUsers.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      fail('A user with that username already exists.');
    }
    if (code !== '000000') {
      fail('Invalid verification code. Use 000000 in demo mode.');
    }
    const user: User = { id: mockNextIds.user++, username, email, bio: null, is_verified: true, avatar: null };
    mockUsers.push(user);
    return delay({ user, access: `mock-${user.id}`, refresh: `mock-refresh-${user.id}` });
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('spineit_access_token');
    localStorage.removeItem('spineit_refresh_token');
    localStorage.removeItem('spineit_user');
    return delay(undefined);
  },

  getProfile: async (): Promise<User> => delay(requireCurrentUser()),

  updateProfile: async (data: FormData | Partial<User>): Promise<User> => {
    const user = requireCurrentUser();

    const nextUsername = data instanceof FormData ? data.get('username') : data.username;
    if (typeof nextUsername === 'string' && nextUsername && nextUsername !== user.username) {
      if (mockUsers.some((u) => u.id !== user.id && u.username === nextUsername)) {
        fail('A user with that username already exists.');
      }
      user.username = nextUsername;
    }

    const nextBio = data instanceof FormData ? data.get('bio') : data.bio;
    if (typeof nextBio === 'string') user.bio = nextBio;

    if (data instanceof FormData) {
      const avatarFile = data.get('avatar');
      if (avatarFile instanceof File) user.avatar = URL.createObjectURL(avatarFile);
    } else if (data.avatar !== undefined) {
      user.avatar = data.avatar;
    }

    return delay(user);
  },

  requestPasswordReset: async (_email: string) => delay({ detail: 'Password reset email sent (mock).' }),
  confirmPasswordReset: async (_payload: { uid: string; token: string; new_password: string }) =>
    delay({ detail: 'Password reset (mock).' }),

  // --- BOOKS ---
  getBooks: async (params?: { search?: string; page?: number }): Promise<Book[]> => {
    let results = mockBooks;
    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    return delay([...results]);
  },

  getBook: async (slug: string): Promise<Book> => {
    const book = mockBooks.find((b) => b.slug === slug);
    if (!book) fail('Book not found');
    return delay(book);
  },

  createBook: async (input: CreateBookInput): Promise<Book> => {
    const book: Book = {
      id: mockNextIds.book++,
      slug: `${slugify(input.title)}-${mockNextIds.book}`,
      title: input.title,
      author: input.author,
      average_rating: null,
      review_count: 0,
      cover_image: null,
      created_at: new Date().toISOString(),
    };
    mockBooks.push(book);
    return delay(book);
  },

  // --- REVIEWS ---
  getReviews: async (params?: {
    search?: string;
    page?: number;
    book?: number;
    genre?: number;
  }): Promise<PaginatedResponse<Review>> => {
    let results = [...mockReviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (params?.book) results = results.filter((r) => r.book.id === params.book);
    if (params?.genre) {
      const genreName = mockGenres.find((g) => g.id === params.genre)?.name;
      results = results.filter((r) => r.genre === genreName);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (r) => r.book.title.toLowerCase().includes(q) || r.review_text.toLowerCase().includes(q)
      );
    }
    return delay({ count: results.length, next: null, previous: null, results });
  },

  getMyReviews: async (): Promise<Review[]> => {
    const user = requireCurrentUser();
    return delay(mockReviews.filter((r) => r.user === user.username));
  },

  getReview: async (id: number): Promise<Review> => {
    const review = mockReviews.find((r) => r.id === id);
    if (!review) fail('Review not found');
    return delay(review);
  },

  createReview: async (input: CreateReviewInput): Promise<Review> => {
    const user = requireCurrentUser();
    const book = mockBooks.find((b) => b.id === input.book_id);
    if (!book) fail('Book not found');
    const review: Review = {
      id: mockNextIds.review++,
      user: user.username,
      book,
      genre: mockGenres.find((g) => g.id === input.genre_id)?.name ?? null,
      review_text: input.review_text,
      rating: input.rating,
      image: input.image ? URL.createObjectURL(input.image) : null,
      like_count: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockReviews.push(review);
    recalcBookStats(book.id);
    return delay(review);
  },

  updateReview: async (id: number, input: Partial<CreateReviewInput>): Promise<Review> => {
    const review = mockReviews.find((r) => r.id === id);
    if (!review) fail('Review not found');
    if (input.review_text !== undefined) review.review_text = input.review_text;
    if (input.rating !== undefined) review.rating = input.rating;
    review.updated_at = new Date().toISOString();
    recalcBookStats(review.book.id);
    return delay(review);
  },

  deleteReview: async (id: number): Promise<void> => {
    const index = mockReviews.findIndex((r) => r.id === id);
    if (index === -1) fail('Review not found');
    const [removed] = mockReviews.splice(index, 1);
    recalcBookStats(removed.book.id);
    return delay(undefined);
  },

  // --- GENRES ---
  getGenres: async () => delay([...mockGenres]),

  // --- COMMENTS ---
  getComments: async (reviewId: number): Promise<Comment[]> =>
    delay(mockComments.filter((c) => c.review === reviewId)),

  createComment: async (reviewId: number, text: string): Promise<Comment> => {
    const user = requireCurrentUser();
    const comment: Comment = {
      id: mockNextIds.comment++,
      review: reviewId,
      user: user.username,
      text,
      created_at: new Date().toISOString(),
    };
    mockComments.push(comment);
    const review = mockReviews.find((r) => r.id === reviewId);
    if (review) {
      review.comment_count += 1;
      notifyComment(review.user, user.username, reviewId);
    }
    return delay(comment);
  },

  deleteComment: async (id: number): Promise<void> => {
    const index = mockComments.findIndex((c) => c.id === id);
    if (index === -1) return delay(undefined);
    const [removed] = mockComments.splice(index, 1);
    const review = mockReviews.find((r) => r.id === removed.review);
    if (review) review.comment_count = Math.max(0, review.comment_count - 1);
    return delay(undefined);
  },

  // --- LIKES ---
  getLikes: async (): Promise<Like[]> => delay([...mockLikes]),

  addLike: async (reviewId: number): Promise<Like> => {
    const user = requireCurrentUser();
    const like: Like = { id: mockNextIds.like++, review: reviewId, user: user.username, created_at: new Date().toISOString() };
    mockLikes.push(like);
    const review = mockReviews.find((r) => r.id === reviewId);
    if (review) {
      review.like_count += 1;
      notifyLike(review.user, user.username, reviewId);
      recalcBookStats(review.book.id);
    }
    return delay(like);
  },

  removeLike: async (likeId: number): Promise<void> => {
    const index = mockLikes.findIndex((l) => l.id === likeId);
    if (index === -1) return delay(undefined);
    const [removed] = mockLikes.splice(index, 1);
    const review = mockReviews.find((r) => r.id === removed.review);
    if (review) {
      review.like_count = Math.max(0, review.like_count - 1);
      recalcBookStats(review.book.id);
    }
    return delay(undefined);
  },

  // --- BOOKMARKS ---
  getBookmarks: async (): Promise<Bookmark[]> => {
    const user = requireCurrentUser();
    return delay(mockBookmarks.filter((b) => b.user === user.username));
  },

  addBookmark: async (reviewId: number): Promise<Bookmark> => {
    const user = requireCurrentUser();
    const bookmark: Bookmark = {
      id: mockNextIds.bookmark++,
      review: reviewId,
      user: user.username,
      created_at: new Date().toISOString(),
    };
    mockBookmarks.push(bookmark);
    return delay(bookmark);
  },

  removeBookmark: async (bookmarkId: number): Promise<void> => {
    const index = mockBookmarks.findIndex((b) => b.id === bookmarkId);
    if (index !== -1) mockBookmarks.splice(index, 1);
    return delay(undefined);
  },

  // --- FAVORITES ---
  getFavorites: async (): Promise<Favorite[]> => {
    const user = requireCurrentUser();
    return delay(mockFavorites.filter((f) => f.user === user.username));
  },

  addFavorite: async (bookId: number): Promise<Favorite> => {
    const user = requireCurrentUser();
    const book = mockBooks.find((b) => b.id === bookId);
    if (!book) fail('Book not found');
    const favorite: Favorite = {
      id: mockNextIds.favorite++,
      book,
      user: user.username,
      created_at: new Date().toISOString(),
    };
    mockFavorites.push(favorite);
    return delay(favorite);
  },

  removeFavorite: async (favoriteId: number): Promise<void> => {
    const index = mockFavorites.findIndex((f) => f.id === favoriteId);
    if (index !== -1) mockFavorites.splice(index, 1);
    return delay(undefined);
  },

  // --- SOCIAL: PUBLIC PROFILES & FOLLOWS ---
  getUserByUsername: async (username: string): Promise<User> => {
    const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!user) fail('User not found');
    return delay(user);
  },

  isFollowing: async (username: string): Promise<boolean> => {
    const me = requireCurrentUser();
    return delay(mockFollows.some((f) => f.follower === me.username && f.following === username));
  },

  followUser: async (username: string): Promise<Follow> => {
    const me = requireCurrentUser();
    if (me.username === username) fail("You can't follow yourself.");
    const existing = mockFollows.find((f) => f.follower === me.username && f.following === username);
    if (existing) return delay(existing);
    const follow: Follow = {
      id: mockNextIds.follow++,
      follower: me.username,
      following: username,
      created_at: new Date().toISOString(),
    };
    mockFollows.push(follow);
    notify(username, me.username, 'follow');
    return delay(follow);
  },

  unfollowUser: async (username: string): Promise<void> => {
    const me = requireCurrentUser();
    const index = mockFollows.findIndex((f) => f.follower === me.username && f.following === username);
    if (index !== -1) mockFollows.splice(index, 1);
    return delay(undefined);
  },

  getFollowerCount: async (username: string): Promise<number> =>
    delay(mockFollows.filter((f) => f.following === username).length),

  getFollowingCount: async (username: string): Promise<number> =>
    delay(mockFollows.filter((f) => f.follower === username).length),

  getFollowingUsernames: async (username: string): Promise<string[]> =>
    delay(mockFollows.filter((f) => f.follower === username).map((f) => f.following)),

  // --- SOCIAL: NOTIFICATIONS ---
  getNotifications: async (): Promise<Notification[]> => {
    const me = requireCurrentUser();
    return delay(
      mockNotifications
        .filter((n) => n.recipient === me.username)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((n) => ({ id: n.id, actor: n.actor, type: n.type, review: n.review, read: n.read, created_at: n.created_at }))
    );
  },

  markAllNotificationsRead: async (): Promise<void> => {
    const me = requireCurrentUser();
    mockNotifications.forEach((n) => {
      if (n.recipient === me.username) n.read = true;
    });
    return delay(undefined);
  },

  // --- SOCIAL: FEED ---
  getFeed: async (params: { scope?: 'public' | 'following'; cursorUrl?: string }): Promise<CursorPage<Review>> => {
    void params.cursorUrl; // mock mode always returns everything in one page
    let results = [...mockReviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (params.scope === 'following') {
      const me = requireCurrentUser();
      const followingUsernames = mockFollows.filter((f) => f.follower === me.username).map((f) => f.following);
      results = results.filter((r) => followingUsernames.includes(r.user));
    }
    return delay({ next: null, previous: null, results });
  },
};

// Every call persists the current in-memory dataset to localStorage afterward,
// so mock state survives a full page reload within the same browser session.
type AsyncFn = (...args: never[]) => Promise<unknown>;
export const mockApi = Object.fromEntries(
  Object.entries(mockApiRaw).map(([key, fn]) => [
    key,
    async (...args: Parameters<AsyncFn>) => {
      const result = await (fn as AsyncFn)(...args);
      persistMockData();
      return result;
    },
  ])
) as typeof mockApiRaw;
