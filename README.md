# 📚 SpineIT — Frontend

🔗 **Live App:** https://spineit.vercel.app
🔗 **Backend repo:** https://github.com/Quincythx/SpineIT
🔗 **Live API Docs:** https://spineit-api.onrender.com/api/docs/

SpineIT is a social platform for book reviews — post your take on a book, follow other readers, like and comment on reviews, and discover what people are reading. It's built to feel like a social timeline (X/Twitter-style: a persistent nav shell, a dense scrollable feed, always-visible engagement counts) rather than a reading tracker or digital library — there are no shelves or "currently reading" lists.

This repo is the frontend: a React + TypeScript single-page app that talks to the [SpineIT backend](https://github.com/Quincythx/SpineIT) (Django REST Framework, JWT-authenticated).

---

## ✨ Features

- **Two-step, email-verified signup** — email → verification code → username → password, with real-time code validation before the rest of the form
- **A social app shell** — persistent left sidebar (desktop) / bottom tab bar (mobile), not just a marketing-style top nav
- **A Twitter-style feed** — public and "following" scopes, cursor-paginated "Load More"
- **Reviews** — star rating, text, and an optional photo; genre is a tag you pick per-review, not a fixed property of the book
- **Social** — follow/unfollow, notifications (bell icon with unread badge, polls for new ones), like/comment/bookmark on any review
- **Profiles** — editable username, bio, and avatar upload; public profile pages for other users
- **Explore** — search books by title/author, filter reviews by genre tag, browse by rating/newest
- **Password reset** — a real forgot-password → email link → reset-password flow

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 (theme tokens in `src/index.css`, no `tailwind.config.js` — v4 is CSS-config-based) |
| HTTP client | Axios, with an interceptor that auto-refreshes expired JWTs |
| Icons | lucide-react |
| Deployment | Vercel |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Quincythx/SpineIT-Frontend.git
cd SpineIT-Frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the dev server
```bash
npm run dev
```
Opens on `http://localhost:3000` (pinned in `vite.config.ts`, not Vite's default 5173).

That's it for a quick start — **by default the app runs against an in-memory mock API**, seeded with demo users, books, and reviews, so you can explore the whole app without a backend running at all. Log in with any seeded email (e.g. `jane@spineit.com`) and any password.

### 4. (Optional) Point it at a real backend

Create `.env.local`:
```bash
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://127.0.0.1:8000/api   # or the live API, https://spineit-api.onrender.com/api
```

With `VITE_USE_MOCKS=false`, the app makes real HTTP requests — you'll need the [backend](https://github.com/Quincythx/SpineIT) running locally (or just point at the live API, which is the default `VITE_API_BASE_URL` if you omit it).

### 5. Build for production
```bash
npm run build
```

---

## 🎭 Mock mode vs. real mode

This is the one thing worth understanding before touching the code: **every API call goes through `src/services/api.ts`**, which exports either `realApi` (real HTTP calls) or `mockApi` (an in-memory fake, `src/services/mockApi.ts` + seed data in `src/services/mockData.ts`) depending on `VITE_USE_MOCKS`. Both implement the exact same function signatures, so pages never know which one they're talking to. When adding a new API call, add it to *both* — the mock and the real implementation should behave identically (same validation errors, same shape of data returned), so the whole app is fully explorable and demoable with zero backend setup.

---

## 🗂 Project Structure

```
src/
├── pages/            # One component per route (FeedPage, ExplorePage, ProfilePage, ...)
├── components/        # Reusable pieces -- Sidebar, BottomNav, ReviewCard, Avatar, ...
├── context/           # AuthContext (JWT/session state)
├── services/
│   ├── api.ts          # Picks realApi or mockApi based on VITE_USE_MOCKS
│   ├── mockApi.ts       # In-memory fake backend
│   └── mockData.ts      # Seed users/books/reviews for mock mode
├── types/api.ts        # TypeScript types matching the backend's serializers
├── utils/
├── index.css           # Tailwind v4 @theme block -- all color/font tokens live here
└── App.tsx              # Routes
```

**Theming**: colors and fonts are centralized as Tailwind v4 `@theme` tokens in `src/index.css` (`bg`, `ink`, `ink-muted`, `border`, `accent`, etc., plus `font-sans`) — use those utility classes (`bg-accent`, `text-ink-muted`, ...) instead of hardcoding hex values, so a future palette change stays a one-file edit.

---

## 📄 License

All Rights Reserved. See [LICENSE](./LICENSE). This is proprietary software owned solely by Osedunme Quincy — no part of it may be copied, modified, or redistributed without written permission.

## 👤 Author

Built by **Osedunme Quincy**.
