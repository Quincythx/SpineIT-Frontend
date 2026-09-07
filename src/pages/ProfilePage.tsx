import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Review } from '../types/api';
import { Avatar } from '../components/Avatar';
import { ProfileReviewCard } from '../components/ProfileReviewCard';

export function ProfilePage() {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(user?.bio ?? '');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.getMyReviews().then(setReviews).catch(() => setReviews([]));
    api.getFollowerCount(user.username).then(setFollowerCount);
    api.getFollowingCount(user.username).then(setFollowingCount);
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-12 lg:py-20 flex flex-col items-center gap-12 lg:gap-20">
        <div className="flex flex-col items-center gap-3 max-w-[512px]">
          <div className="w-24 h-24 rounded-xl bg-[#eae7e7] border-2 border-[#bec8c9] flex items-center justify-center mb-2">
            <UserIcon className="w-8 h-8 text-[#3f4949]" />
          </div>
          <h1 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-[#00464a] text-center tracking-[-0.96px]">
            Join the Community
          </h1>
          <p className="font-['Inter'] text-base text-[#3f4949] text-center">
            Discover your next great read, share what you think, and connect with fellow readers in our digital
            reading nook.
          </p>
        </div>

        <div className="relative w-full rounded-lg border border-[#bec8c9] shadow-[0px_4px_20px_0px_rgba(0,96,100,0.05)] overflow-hidden bg-[#f0eded]">
          <div className="hidden sm:grid blur-[6px] opacity-40 p-6 lg:p-12 grid-cols-3 gap-6" aria-hidden>
            <div className="col-span-1 bg-white border border-[#bec8c9]/50 rounded p-6 flex flex-col gap-4">
              <p className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#3f4949] uppercase">
                Review Stats
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-['Playfair_Display'] font-semibold text-2xl text-[#00464a]">38</p>
                  <p className="font-['Inter'] text-sm text-[#3f4949]">Reviews Written</p>
                </div>
                <div>
                  <p className="font-['Playfair_Display'] font-semibold text-2xl text-[#00464a]">142</p>
                  <p className="font-['Inter'] text-sm text-[#3f4949]">Likes Received</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-white border border-[#bec8c9]/50 rounded p-6 flex gap-6 items-center">
              <div className="w-24 h-36 bg-[#e5e2e1] rounded-sm shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <p className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#7e5700] uppercase">
                  Latest Review
                </p>
                <p className="font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b]">
                  The Echo of Old Pages
                </p>
                <p className="font-['Inter'] text-sm text-[#3f4949]">
                  "A quietly devastating meditation on memory..."
                </p>
              </div>
            </div>
          </div>

          <div className="sm:absolute inset-0 flex items-center justify-center p-4 py-12">
            <div className="bg-white sm:bg-white/95 backdrop-blur border border-[#bec8c9] rounded-lg shadow-[0px_4px_20px_0px_rgba(0,96,100,0.05)] max-w-[512px] w-full p-6 sm:p-12 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-[#ffdbcc] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#6e2a00]" />
              </div>
              <h2 className="font-['Playfair_Display'] font-semibold text-2xl text-[#00464a] text-center pt-2">
                Join the Conversation
              </h2>
              <p className="font-['Inter'] text-base text-[#3f4949] text-center">
                Create a profile to share your reviews, build a following, and connect with fellow readers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 w-full sm:w-auto">
                <Link
                  to="/signup"
                  className="bg-[#00464a] text-white font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-12 py-3 text-center"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-[#00464a] text-[#00464a] font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-12 py-3 text-center"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const reviewedBookCount = reviews ? new Set(reviews.map((r) => r.book.id)).size : null;

  const handleSaveBio = async () => {
    await api.updateProfile({ bio: bioDraft });
    await refreshProfile();
    setIsEditingBio(false);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-8 lg:py-12">
      <div className="flex flex-col items-center pb-8 lg:pb-12">
        <Avatar name={user.username} src={user.avatar} size={120} />
        <h1 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-[#1c1b1b] pt-2 text-center">
          {user.username}
        </h1>

        {isEditingBio ? (
          <div className="flex flex-col items-center gap-2 pt-2 w-full max-w-[672px]">
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              rows={3}
              className="w-full border border-[#e5e2e1] rounded p-3 font-['Inter'] text-base text-[#3f4949] outline-none focus:border-[#00464a]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveBio}
                className="bg-[#00464a] text-white text-sm font-semibold tracking-[0.7px] rounded-xl px-6 py-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setBioDraft(user.bio ?? '');
                  setIsEditingBio(false);
                }}
                className="border border-[#00464a] text-[#00464a] text-sm font-semibold tracking-[0.7px] rounded-xl px-6 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="font-['Inter'] text-lg text-[#3f4949] text-center max-w-[672px] pt-2">
            {user.bio || 'No bio yet.'}
          </p>
        )}

        {!isEditingBio && (
          <div className="flex gap-6 pt-3">
            <span className="font-['Inter'] text-sm text-[#3f4949]">
              <strong className="text-[#1c1b1b]">{followerCount}</strong> Followers
            </span>
            <span className="font-['Inter'] text-sm text-[#3f4949]">
              <strong className="text-[#1c1b1b]">{followingCount}</strong> Following
            </span>
          </div>
        )}

        {!isEditingBio && (
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingBio(true)}
              className="bg-[#00464a] text-white text-sm font-semibold tracking-[0.7px] rounded-xl px-6 py-3"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="border border-[#00464a] text-[#00464a] text-sm font-semibold tracking-[0.7px] rounded-xl px-6 py-3"
            >
              {shareStatus === 'copied' ? 'Link Copied!' : 'Share'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[#3f4949] text-sm font-semibold tracking-[0.7px] px-6 py-3 underline"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pb-12 lg:pb-20">
        <div className="bg-white drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg flex-1 flex flex-col items-center justify-center p-6">
          <p className="font-['Playfair_Display'] font-bold text-[32px] text-[#00464a]">{reviews?.length ?? '—'}</p>
          <p className="font-['Inter'] font-semibold text-sm tracking-[1.4px] uppercase text-[#3f4949]">
            Reviews Shared
          </p>
        </div>
        <div className="bg-white drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg flex-1 flex flex-col items-center justify-center p-6">
          <p className="font-['Playfair_Display'] font-bold text-[32px] text-[#00464a]">{reviewedBookCount ?? '—'}</p>
          <p className="font-['Inter'] font-semibold text-sm tracking-[1.4px] uppercase text-[#3f4949]">
            Books Reviewed
          </p>
        </div>
      </div>

      <div className="max-w-[768px] mx-auto flex flex-col gap-8 lg:gap-12">
        <h2 className="font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b] border-b border-[#e5e2e1] pb-[17px]">
          My Sanctuary
        </h2>
          {reviews === null && <p className="font-['Inter'] text-[#3f4949]">Loading…</p>}
          {reviews?.length === 0 && (
            <p className="font-['Inter'] text-[#3f4949]">
              You haven't written any reviews yet —{' '}
              <Link to="/write" className="text-[#00464a] underline">
                write your first one
              </Link>
              .
            </p>
          )}
          {reviews?.map((review) => (
            <ProfileReviewCard key={review.id} review={review} />
          ))}
      </div>
    </div>
  );
}
