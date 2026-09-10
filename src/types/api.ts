/**
 * SpineIT API Types & Models
 * Matching the Django REST Framework Serializers from SpineIT backend.
 */

// User profile model matching accounts.User
export interface User {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  is_verified: boolean;
  avatar: string | null;
}

// Genre model matching reviews.Genre
export interface Genre {
  id: number;
  name: string;
}

// Minimal book shape nested inside reviews / favorites / reading list items.
// Books have no cover image of their own -- SpineIT is a review platform,
// not a library, so any photo belongs to a specific review, not the book.
// Books also have no genre of their own -- genre is a per-review tag (each
// reviewer picks the genre their own take fits), not a fixed book property.
export interface BookRef {
  id: number;
  slug: string;
  title: string;
  author: string;
}

// Full Book model matching reviews.Book, including aggregate stats
export interface Book extends BookRef {
  average_rating: number | null;
  review_count: number;
  created_at: string;
}

// Data payload for creating a new book in the catalog
export interface CreateBookInput {
  title: string;
  author: string;
}

// Review model matching reviews.Review serializer
export interface Review {
  id: number;
  user: string;           // Username of reviewer
  book: BookRef;
  genre: string | null;   // The genre tag this reviewer picked for their take
  review_text: string;
  rating: number;         // 1 to 5 stars
  image: string | null;   // The reviewer's own photo -- a book cover, a
                           // dog-eared page, themselves reading it, anything
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

// Data payload for creating a new review against an existing book
export interface CreateReviewInput {
  book_id: number;
  genre_id?: number | null;
  review_text: string;
  rating: number;
  image?: File | null;
}

// Comment model matching reviews.Comment
export interface Comment {
  id: number;
  review: number;         // Review ID
  user: string;           // Username of commenter
  text: string;
  created_at: string;
}

// Like model matching reviews.Like (review-level)
export interface Like {
  id: number;
  review: number;         // Liked Review ID
  user: string;
  created_at: string;
}

// Bookmark model matching reviews.Bookmark (review-level "save this take")
export interface Bookmark {
  id: number;
  review: number;         // Bookmarked Review ID
  user: string;
  created_at: string;
}

// Favorite model matching reviews.Favorite (book-level "shelf")
export interface Favorite {
  id: number;
  book: Book;
  user: string;
  created_at: string;
}


// JWT Authentication response tokens from /api/auth/login/
export interface AuthTokens {
  access: string;
  refresh: string;
}

// Step 1 of registration: request a 6-digit code sent to this email
export interface SendCodePayload {
  email: string;
}

// Step 2: the code plus the new account's details, submitted together
export interface VerifyCodeAndRegisterPayload {
  email: string;
  code: string;
  username: string;
  password: string;
}

// Response from /auth/verify-code-register/ -- the account is created
// already verified, and login tokens are returned in the same call.
export interface RegisterResult {
  user: User;
  access: string;
  refresh: string;
}

// Follow model matching social.Follow
export interface Follow {
  id: number;
  follower: string;   // Username of the follower
  following: string;  // Username of the person being followed
  created_at: string;
}

// Notification model matching social.Notification. There is no `recipient`
// field -- GET /notifications/ is always scoped to "your own" by the backend.
export type NotificationType = 'like' | 'comment' | 'follow';

export interface Notification {
  id: number;
  actor: string;         // Username of whoever triggered it
  type: NotificationType;
  review: number | null; // Review ID this relates to, null for a follow
  read: boolean;
  created_at: string;
}

// DRF CursorPagination wrapper shape -- used by /feed/. Unlike
// PaginatedResponse, there is no `count`; `next`/`previous` are full URLs.
export interface CursorPage<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}

// DRF PageNumberPagination wrapper shape
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
