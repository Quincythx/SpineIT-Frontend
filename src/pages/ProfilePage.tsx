import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Sparkles, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Review } from '../types/api';
import { Avatar } from '../components/Avatar';
import { ProfileReviewCard } from '../components/ProfileReviewCard';

export function ProfilePage() {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState(user?.username ?? '');
  const [bioDraft, setBioDraft] = useState(user?.bio ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
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
          <div className="w-24 h-24 rounded-xl bg-border border-2 border-border-strong flex items-center justify-center mb-2">
            <UserIcon className="w-8 h-8 text-ink-muted" />
          </div>
          <h1 className="font-['Inter'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-accent text-center tracking-[-0.96px]">
            Join the Community
          </h1>
          <p className="font-['Inter'] text-base text-ink-muted text-center">
            Discover your next great read, share what you think, and connect with fellow readers in our digital
            reading nook.
          </p>
        </div>

        <div className="relative w-full rounded-lg border border-border-strong shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] overflow-hidden bg-[#f0eded]">
          <div className="hidden sm:grid blur-[6px] opacity-40 p-6 lg:p-12 grid-cols-3 gap-6" aria-hidden>
            <div className="col-span-1 bg-white border border-border-strong/50 rounded p-6 flex flex-col gap-4">
              <p className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-ink-muted uppercase">
                Review Stats
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-['Inter'] font-semibold text-2xl text-accent">38</p>
                  <p className="font-['Inter'] text-sm text-ink-muted">Reviews Written</p>
                </div>
                <div>
                  <p className="font-['Inter'] font-semibold text-2xl text-accent">142</p>
                  <p className="font-['Inter'] text-sm text-ink-muted">Likes Received</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-white border border-border-strong/50 rounded p-6 flex gap-6 items-center">
              <div className="w-24 h-36 bg-border rounded-sm shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <p className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-accent uppercase">
                  Latest Review
                </p>
                <p className="font-['Inter'] font-semibold text-2xl text-ink">
                  The Echo of Old Pages
                </p>
                <p className="font-['Inter'] text-sm text-ink-muted">
                  "A quietly devastating meditation on memory..."
                </p>
              </div>
            </div>
          </div>

          <div className="sm:absolute inset-0 flex items-center justify-center p-4 py-12">
            <div className="bg-white sm:bg-white/95 backdrop-blur border border-border-strong rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] max-w-[512px] w-full p-6 sm:p-12 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-[#ffdbcc] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#6e2a00]" />
              </div>
              <h2 className="font-['Inter'] font-semibold text-2xl text-accent text-center pt-2">
                Join the Conversation
              </h2>
              <p className="font-['Inter'] text-base text-ink-muted text-center">
                Create a profile to share your reviews, build a following, and connect with fellow readers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 w-full sm:w-auto">
                <Link
                  to="/signup"
                  className="bg-accent text-white font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-12 py-3 text-center"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-accent text-accent font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-12 py-3 text-center"
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

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSaveProfile = async () => {
    setEditError(null);
    setIsSavingProfile(true);
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('username', usernameDraft.trim());
        formData.append('bio', bioDraft);
        formData.append('avatar', avatarFile);
        await api.updateProfile(formData);
      } else {
        await api.updateProfile({ username: usernameDraft.trim(), bio: bioDraft });
      }
      await refreshProfile();
      setIsEditingProfile(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      const message =
        (err as { response?: { data?: { username?: string[] } } })?.response?.data?.username?.[0];
      setEditError(message || 'Could not save your profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setUsernameDraft(user.username);
    setBioDraft(user.bio ?? '');
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditError(null);
    setIsEditingProfile(false);
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
        <div className="relative">
          <Avatar name={user.username} src={avatarPreview ?? user.avatar} size={120} />
          {isEditingProfile && (
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Change profile picture"
              className="absolute inset-0 rounded-xl bg-ink/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          )}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
          />
        </div>

        {isEditingProfile ? (
          <div className="flex flex-col items-center gap-3 pt-3 w-full max-w-[672px]">
            {editError && (
              <p className="w-full text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {editError}
              </p>
            )}
            <input
              type="text"
              value={usernameDraft}
              onChange={(e) => setUsernameDraft(e.target.value)}
              placeholder="Username"
              className="w-full text-center border-b border-border-strong pb-2 font-['Inter'] font-bold text-2xl text-ink outline-none focus:border-accent"
            />
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              placeholder="Tell readers about yourself..."
              rows={3}
              className="w-full border border-border rounded p-3 font-['Inter'] text-base text-ink-muted outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile || !usernameDraft.trim()}
                className="bg-accent text-white text-sm font-semibold tracking-[0.7px] rounded-xl px-6 py-2 disabled:opacity-60"
              >
                {isSavingProfile ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSavingProfile}
                className="border border-accent text-accent text-sm font-semibold tracking-[0.7px] rounded-xl px-6 py-2 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-['Inter'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-ink pt-2 text-center">
              {user.username}
            </h1>
            <p className="font-['Inter'] text-lg text-ink-muted text-center max-w-[672px] pt-2">
              {user.bio || 'No bio yet.'}
            </p>
          </>
        )}

        {!isEditingProfile && (
          <div className="flex gap-6 pt-3">
            <span className="font-['Inter'] text-sm text-ink-muted">
              <strong className="text-ink">{followerCount}</strong> Followers
            </span>
            <span className="font-['Inter'] text-sm text-ink-muted">
              <strong className="text-ink">{followingCount}</strong> Following
            </span>
          </div>
        )}

        {!isEditingProfile && (
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="bg-accent text-white text-sm font-semibold tracking-[0.7px] rounded-xl px-6 py-3"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="border border-accent text-accent text-sm font-semibold tracking-[0.7px] rounded-xl px-6 py-3"
            >
              {shareStatus === 'copied' ? 'Link Copied!' : 'Share'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-ink-muted text-sm font-semibold tracking-[0.7px] px-6 py-3 underline"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pb-12 lg:pb-20">
        <div className="bg-white drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] rounded-lg flex-1 flex flex-col items-center justify-center p-6">
          <p className="font-['Inter'] font-bold text-[32px] text-accent">{reviews?.length ?? '—'}</p>
          <p className="font-['Inter'] font-semibold text-sm tracking-[1.4px] uppercase text-ink-muted">
            Reviews Shared
          </p>
        </div>
        <div className="bg-white drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] rounded-lg flex-1 flex flex-col items-center justify-center p-6">
          <p className="font-['Inter'] font-bold text-[32px] text-accent">{reviewedBookCount ?? '—'}</p>
          <p className="font-['Inter'] font-semibold text-sm tracking-[1.4px] uppercase text-ink-muted">
            Books Reviewed
          </p>
        </div>
      </div>

      <div className="max-w-[768px] mx-auto flex flex-col gap-8 lg:gap-12">
        <h2 className="font-['Inter'] font-semibold text-2xl text-ink border-b border-border pb-[17px]">
          My Sanctuary
        </h2>
          {reviews === null && <p className="font-['Inter'] text-ink-muted">Loading…</p>}
          {reviews?.length === 0 && (
            <p className="font-['Inter'] text-ink-muted">
              You haven't written any reviews yet —{' '}
              <Link to="/write" className="text-accent underline">
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
