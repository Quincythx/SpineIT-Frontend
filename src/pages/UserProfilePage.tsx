import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { socialApi } from '../services/socialApi';
import type { Review, User } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import { FollowButton } from '../components/FollowButton';
import { ProfileReviewCard } from '../components/ProfileReviewCard';

export function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (!username) return;
    socialApi
      .getUserByUsername(username)
      .then(setProfileUser)
      .catch(() => setNotFound(true));
    api
      .getReviews()
      .then((res) => setReviews(res.results.filter((r) => r.user === username)))
      .catch(() => setReviews([]));
    socialApi.getFollowerCount(username).then(setFollowerCount);
    socialApi.getFollowingCount(username).then(setFollowingCount);
  }, [username]);

  if (currentUser && username === currentUser.username) {
    return <Navigate to="/profile" replace />;
  }

  if (notFound) {
    return (
      <div className="max-w-[672px] mx-auto px-4 sm:px-6 lg:px-16 py-24 text-center">
        <p className="font-['Inter'] text-[#3f4949]">
          This reader couldn't be found.{' '}
          <Link to="/" className="text-[#00464a] underline">
            Back to feed
          </Link>
        </p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-12">
        <p className="font-['Inter'] text-[#3f4949]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-8 lg:py-12">
      <div className="flex flex-col items-center pb-8 lg:pb-12">
        <Avatar name={profileUser.username} src={profileUser.avatar} size={120} />
        <h1 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-[#1c1b1b] pt-2 text-center">
          {profileUser.username}
        </h1>
        <p className="font-['Inter'] text-lg text-[#3f4949] text-center max-w-[672px] pt-2">
          {profileUser.bio || 'No bio yet.'}
        </p>

        <div className="flex gap-6 pt-4">
          <span className="font-['Inter'] text-sm text-[#3f4949]">
            <strong className="text-[#1c1b1b]">{followerCount}</strong> Followers
          </span>
          <span className="font-['Inter'] text-sm text-[#3f4949]">
            <strong className="text-[#1c1b1b]">{followingCount}</strong> Following
          </span>
        </div>

        <div className="pt-4">
          <FollowButton username={profileUser.username} />
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-[860px] mx-auto">
        <h2 className="font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b] border-b border-[#e5e2e1] pb-[17px]">
          {profileUser.username}'s Reviews
        </h2>
        {reviews === null && <p className="font-['Inter'] text-[#3f4949]">Loading…</p>}
        {reviews?.length === 0 && <p className="font-['Inter'] text-[#3f4949]">No reviews yet.</p>}
        {reviews?.map((review) => (
          <ProfileReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
