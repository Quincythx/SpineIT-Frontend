import axios from 'axios';
import type {
  AuthTokens,
  User,
  Genre,
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
  CursorPage,
} from '../types/api';
import { mockApi } from './mockApi';

// Set base URL to production SpineIT API or local fallback via VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://spineit-api.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT access token if present in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('spineit_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized by attempting JWT token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request returns 401 and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('spineit_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post<AuthTokens>(`${API_BASE_URL}/auth/login/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = res.data.access;
          localStorage.setItem('spineit_access_token', newAccessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch {
          // Refresh token expired or blacklisted -> Clear tokens & log out
          localStorage.removeItem('spineit_access_token');
          localStorage.removeItem('spineit_refresh_token');
          localStorage.removeItem('spineit_user');
          window.dispatchEvent(new Event('spineit_auth_change'));
        }
      }
    }
    return Promise.reject(error);
  }
);

// Normalizes DRF's paginated-or-plain-array response shapes into a plain array.
function toArray<T>(data: PaginatedResponse<T> | T[]): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

// The backend's Follow endpoints filter by username, so looking up "my own"
// follow relationships needs my own username, not just a token.
function currentUsername(): string | null {
  try {
    const raw = localStorage.getItem('spineit_user');
    return raw ? (JSON.parse(raw) as User).username : null;
  } catch {
    return null;
  }
}

// ==========================================
// API Endpoint Functions
// ==========================================

const realApi = {
  // --- AUTH ENDPOINTS ---
  login: async (credentials: { username: string; password: string }) => {
    const res = await apiClient.post<AuthTokens>('/auth/login/', credentials);
    return res.data;
  },

  sendVerificationCode: async (payload: SendCodePayload) => {
    const res = await apiClient.post<{ detail: string }>('/auth/send-code/', payload);
    return res.data;
  },

  verifyCodeAndRegister: async (payload: VerifyCodeAndRegisterPayload) => {
    const res = await apiClient.post<RegisterResult>('/auth/verify-code-register/', payload);
    return res.data;
  },

  logout: async (refreshToken: string) => {
    try {
      await apiClient.post('/auth/logout/', { refresh: refreshToken });
    } finally {
      localStorage.removeItem('spineit_access_token');
      localStorage.removeItem('spineit_refresh_token');
      localStorage.removeItem('spineit_user');
    }
  },

  getProfile: async () => {
    const res = await apiClient.get<User>('/auth/profile/');
    return res.data;
  },

  updateProfile: async (data: FormData | Partial<User>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await apiClient.patch<User>('/auth/profile/', data, { headers });
    return res.data;
  },

  requestPasswordReset: async (email: string) => {
    const res = await apiClient.post('/auth/password-reset/', { email });
    return res.data;
  },

  confirmPasswordReset: async (payload: { uid: string; token: string; new_password: string }) => {
    const res = await apiClient.post('/auth/password-reset-confirm/', payload);
    return res.data;
  },

  // --- BOOKS ENDPOINTS ---
  getBooks: async (params?: { search?: string; page?: number }) => {
    const res = await apiClient.get<PaginatedResponse<Book> | Book[]>('/books/', { params });
    return toArray(res.data);
  },

  getBook: async (slug: string) => {
    const res = await apiClient.get<Book>(`/books/${slug}/`);
    return res.data;
  },

  createBook: async (input: CreateBookInput) => {
    const res = await apiClient.post<Book>('/books/', {
      title: input.title,
      author: input.author,
    });
    return res.data;
  },

  // --- REVIEWS ENDPOINTS ---
  getReviews: async (params?: { search?: string; page?: number; book?: number; genre?: number }) => {
    const res = await apiClient.get<PaginatedResponse<Review>>('/reviews/', { params });
    return { ...res.data, results: toArray(res.data) };
  },

  getMyReviews: async () => {
    const all: Review[] = [];
    let url: string | null = '/reviews/';
    let params: Record<string, unknown> | undefined = { mine: true };
    while (url) {
      const res: { data: PaginatedResponse<Review> | Review[] } = await apiClient.get(url, { params });
      all.push(...toArray(res.data));
      url = Array.isArray(res.data) ? null : res.data.next;
      params = undefined; // `next` is already a full URL with query params baked in
    }
    return all;
  },

  getReview: async (id: number) => {
    const res = await apiClient.get<Review>(`/reviews/${id}/`);
    return res.data;
  },

  createReview: async (input: CreateReviewInput) => {
    if (input.image) {
      const formData = new FormData();
      formData.append('book_id', String(input.book_id));
      if (input.genre_id != null) formData.append('genre_id', String(input.genre_id));
      formData.append('review_text', input.review_text);
      formData.append('rating', String(input.rating));
      formData.append('image', input.image);
      const res = await apiClient.post<Review>('/reviews/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    }
    const res = await apiClient.post<Review>('/reviews/', input);
    return res.data;
  },

  updateReview: async (id: number, input: Partial<CreateReviewInput>) => {
    const res = await apiClient.patch<Review>(`/reviews/${id}/`, input);
    return res.data;
  },

  deleteReview: async (id: number) => {
    await apiClient.delete(`/reviews/${id}/`);
  },

  // --- GENRES ENDPOINTS ---
  getGenres: async () => {
    const res = await apiClient.get<PaginatedResponse<Genre> | Genre[]>('/genres/');
    return toArray(res.data);
  },

  // --- COMMENTS ENDPOINTS ---
  getComments: async (reviewId: number) => {
    const res = await apiClient.get<PaginatedResponse<Comment> | Comment[]>('/comments/', {
      params: { review: reviewId },
    });
    return toArray(res.data);
  },

  createComment: async (reviewId: number, text: string) => {
    const res = await apiClient.post<Comment>('/comments/', { review: reviewId, text });
    return res.data;
  },

  deleteComment: async (id: number) => {
    await apiClient.delete(`/comments/${id}/`);
  },

  // --- LIKES ENDPOINTS ---
  getLikes: async () => {
    const res = await apiClient.get<PaginatedResponse<Like> | Like[]>('/likes/');
    return toArray(res.data);
  },

  addLike: async (reviewId: number) => {
    const res = await apiClient.post<Like>('/likes/', { review: reviewId });
    return res.data;
  },

  removeLike: async (likeId: number) => {
    await apiClient.delete(`/likes/${likeId}/`);
  },

  // --- BOOKMARKS ENDPOINTS (save a specific review) ---
  getBookmarks: async () => {
    const res = await apiClient.get<PaginatedResponse<Bookmark> | Bookmark[]>('/bookmarks/');
    return toArray(res.data);
  },

  addBookmark: async (reviewId: number) => {
    const res = await apiClient.post<Bookmark>('/bookmarks/', { review: reviewId });
    return res.data;
  },

  removeBookmark: async (bookmarkId: number) => {
    await apiClient.delete(`/bookmarks/${bookmarkId}/`);
  },

  // --- FAVORITES ENDPOINTS (book-level shelf) ---
  getFavorites: async () => {
    const res = await apiClient.get<PaginatedResponse<Favorite> | Favorite[]>('/favorites/');
    return toArray(res.data);
  },

  addFavorite: async (bookId: number) => {
    const res = await apiClient.post<Favorite>('/favorites/', { book_id: bookId });
    return res.data;
  },

  removeFavorite: async (favoriteId: number) => {
    await apiClient.delete(`/favorites/${favoriteId}/`);
  },

  // --- SOCIAL: PUBLIC PROFILES & FOLLOWS ---
  getUserByUsername: async (username: string) => {
    const res = await apiClient.get<User>(`/users/${username}/`);
    return res.data;
  },

  isFollowing: async (username: string): Promise<boolean> => {
    const me = currentUsername();
    if (!me) return false;
    const res = await apiClient.get<PaginatedResponse<Follow>>('/follows/', {
      params: { follower: me, following: username },
    });
    return res.data.count > 0;
  },

  followUser: async (username: string) => {
    const res = await apiClient.post<Follow>('/follows/', { following: username });
    return res.data;
  },

  unfollowUser: async (username: string) => {
    const me = currentUsername();
    if (!me) return;
    const res = await apiClient.get<PaginatedResponse<Follow>>('/follows/', {
      params: { follower: me, following: username },
    });
    const existing = res.data.results[0];
    if (existing) await apiClient.delete(`/follows/${existing.id}/`);
  },

  getFollowerCount: async (username: string): Promise<number> => {
    const res = await apiClient.get<PaginatedResponse<Follow>>('/follows/', {
      params: { following: username },
    });
    return res.data.count;
  },

  getFollowingCount: async (username: string): Promise<number> => {
    const res = await apiClient.get<PaginatedResponse<Follow>>('/follows/', {
      params: { follower: username },
    });
    return res.data.count;
  },

  getFollowingUsernames: async (username: string): Promise<string[]> => {
    const all: string[] = [];
    let url: string | null = '/follows/';
    let params: Record<string, unknown> | undefined = { follower: username };
    while (url) {
      const res: { data: PaginatedResponse<Follow> } = await apiClient.get(url, { params });
      all.push(...res.data.results.map((f) => f.following));
      url = res.data.next;
      params = undefined; // `next` is already a full URL with query params baked in
    }
    return all;
  },

  // --- SOCIAL: NOTIFICATIONS (server-created only, never posted by the client) ---
  getNotifications: async (): Promise<Notification[]> => {
    const res = await apiClient.get<PaginatedResponse<Notification>>('/notifications/');
    return res.data.results;
  },

  markAllNotificationsRead: async () => {
    await apiClient.patch('/notifications/mark-read/');
  },

  // --- SOCIAL: FEED (cursor-paginated -- pass cursorUrl from a previous
  // page's `next` to load more; omit it for the first page) ---
  getFeed: async (params: { scope?: 'public' | 'following'; cursorUrl?: string }): Promise<CursorPage<Review>> => {
    if (params.cursorUrl) {
      const res = await apiClient.get<CursorPage<Review>>(params.cursorUrl);
      return res.data;
    }
    const res = await apiClient.get<CursorPage<Review>>('/feed/', {
      params: { scope: params.scope ?? 'public' },
    });
    return res.data;
  },
};

// While the real backend is being rebuilt, the app runs entirely against in-memory
// mock data (see mockApi.ts). Set VITE_USE_MOCKS=false in .env.local to switch back.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const api: typeof realApi = USE_MOCKS ? mockApi : realApi;
