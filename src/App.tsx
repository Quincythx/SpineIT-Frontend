import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FeedPage } from './pages/FeedPage';
import { ExplorePage } from './pages/ExplorePage';
import { WritePage } from './pages/WritePage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ReviewDetailPage } from './pages/ReviewDetailPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="write" element={<WritePage />} />
      <Route path="reviews/:id" element={<ReviewDetailPage />} />
      <Route element={<Layout />}>
        <Route index element={<FeedPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="books/:slug" element={<BookDetailPage />} />
        <Route path="users/:username" element={<UserProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
