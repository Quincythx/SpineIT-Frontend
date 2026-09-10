import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function FollowButton({ username }: { username: string }) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    api.isFollowing(username).then((v) => {
      setIsFollowing(v);
      setIsLoading(false);
    });
  }, [user, username]);

  if (!user) {
    return (
      <Link
        to="/login"
        className="border-2 border-accent text-accent font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-6 py-3"
      >
        Log in to Follow
      </Link>
    );
  }

  const handleClick = async () => {
    setIsLoading(true);
    if (isFollowing) {
      await api.unfollowUser(username);
      setIsFollowing(false);
    } else {
      await api.followUser(username);
      setIsFollowing(true);
    }
    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-6 py-3 disabled:opacity-60 ${
        isFollowing ? 'border-2 border-accent text-accent' : 'bg-accent text-white'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
