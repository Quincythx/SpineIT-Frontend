import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Heart, MessageCircle, Bookmark, Share2, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import type { Review, Comment } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { CommentItem } from '../components/CommentItem';
import { UserLink } from '../components/UserLink';
import { FollowButton } from '../components/FollowButton';

export function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const reviewId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [review, setReview] = useState<Review | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    api
      .getReview(reviewId)
      .then((r) => {
        setReview(r);
        setLikeCount(r.like_count);
      })
      .catch(() => setNotFound(true));
    api.getComments(reviewId).then(setComments).catch(() => setComments([]));
  }, [reviewId]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikeCount((c) => c + 1);
    try {
      await api.addLike(reviewId);
    } catch {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  const handleSave = async () => {
    if (saved) return;
    setSaved(true);
    try {
      await api.addBookmark(reviewId);
    } catch {
      setSaved(false);
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsPosting(true);
    try {
      const comment = await api.createComment(reviewId, commentText.trim());
      setComments((prev) => [comment, ...(prev ?? [])]);
      setCommentText('');
    } finally {
      setIsPosting(false);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-[672px] mx-auto px-4 sm:px-6 lg:px-16 py-24 text-center">
        <p className="font-['Inter'] text-[#3f4949]">
          This review couldn't be found.{' '}
          <Link to="/" className="text-[#00464a] underline">
            Back to feed
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="sticky top-0 bg-[#fcf9f8] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between h-16 px-6 z-10">
        <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="text-[#1c1b1b] p-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Link to="/" className="font-['Playfair_Display'] font-semibold text-2xl text-[#00464a] tracking-[-0.6px]">
          SpineIt
        </Link>
        <button type="button" onClick={handleShare} aria-label="Share" className="text-[#1c1b1b] p-2 rounded-xl">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-[1152px] mx-auto px-4 sm:px-6 lg:px-16 py-6 flex flex-col gap-6">
        {!review && <p className="font-['Inter'] text-[#3f4949]">Loading…</p>}

        {review && (
          <div className="flex items-center justify-between">
            <UserLink username={review.user} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#e5e2e1] flex items-center justify-center font-['Inter'] font-semibold text-[#3f4949]">
                {review.user.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#1c1b1b]">{review.user}</p>
                <p className="font-['Inter'] text-sm text-[#3f4949]">Reviewer</p>
              </div>
            </UserLink>
            {user?.username !== review.user && <FollowButton username={review.user} />}
          </div>
        )}

        {review && (
          <article className="bg-white drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg p-6 sm:p-12 flex flex-col gap-8 sm:gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-12">
              <Link to={`/books/${review.book.slug}`} className="sm:col-span-5">
                {review.book.cover_image ? (
                  <img
                    src={review.book.cover_image}
                    alt={review.book.title}
                    className="w-full max-w-[240px] sm:max-w-[300px] mx-auto sm:mx-0 aspect-[2/3] object-cover rounded-r shadow-[0px_4px_20px_0px_rgba(0,96,100,0.05)]"
                  />
                ) : (
                  <div className="w-full max-w-[240px] sm:max-w-[300px] mx-auto sm:mx-0 aspect-[2/3] bg-[#f6f3f2] rounded-r flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-[#3f4949]" />
                  </div>
                )}
              </Link>
              <div className="sm:col-span-7 flex flex-col justify-center gap-3 text-center sm:text-left items-center sm:items-start">
                {review.book.genre && (
                  <span className="bg-[rgba(126,87,0,0.1)] border border-[rgba(126,87,0,0.2)] text-[#7e5700] text-xs font-medium px-3 py-1 rounded-xl w-fit">
                    {review.book.genre}
                  </span>
                )}
                <Link to={`/books/${review.book.slug}`}>
                  <h1 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-[#1c1b1b] tracking-[-0.96px]">
                    {review.book.title}
                  </h1>
                </Link>
                <p className="font-['Inter'] italic text-lg text-[#3f4949]">by {review.book.author}</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <Star
                        key={v}
                        className={`w-5 h-5 ${v <= review.rating ? 'fill-[#7e5700] text-[#7e5700]' : 'text-[#e5e2e1]'}`}
                      />
                    ))}
                  </div>
                  <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#1c1b1b]">
                    {review.rating.toFixed(1)}/5
                  </span>
                  <span className="text-[#3f4949]">•</span>
                  <span className="font-['Inter'] text-sm text-[#3f4949]">{review.user}'s Rating</span>
                </div>
              </div>
            </div>

            <p className="font-['Inter'] text-lg text-[#1c1b1b] leading-[29px] whitespace-pre-line">
              {review.review_text}
            </p>

            <div className="border-t border-[rgba(190,200,201,0.3)] pt-6 flex items-center justify-between">
              <div className="flex gap-6 items-center">
                <button
                  type="button"
                  onClick={handleLike}
                  aria-pressed={liked}
                  aria-label="Like this review"
                  className="flex items-center gap-2 text-[#3f4949]"
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-[#00464a] text-[#00464a]' : ''}`} />
                  <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px]">{likeCount}</span>
                </button>
                <span className="flex items-center gap-2 text-[#3f4949]">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px]">{comments?.length ?? 0}</span>
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <button type="button" onClick={handleSave} disabled={saved} className="text-[#3f4949] disabled:text-[#00464a]">
                  <Bookmark className={`w-4 h-[18px] ${saved ? 'fill-current' : ''}`} />
                </button>
                <button type="button" onClick={handleShare} className="text-[#3f4949] font-['Inter'] text-xs">
                  {shareStatus === 'copied' ? 'Copied!' : <Share2 className="w-[18px] h-5" />}
                </button>
              </div>
            </div>
          </article>
        )}

        <section className="max-w-[768px] flex flex-col gap-6 pt-6">
          <h2 className="font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b]">
            Discussion ({comments?.length ?? 0})
          </h2>

          {user ? (
            <form onSubmit={handlePostComment} className="bg-white drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded p-6 flex gap-3 items-start">
              <div className="w-10 h-10 rounded-xl bg-[rgba(0,70,74,0.1)] flex items-center justify-center shrink-0 font-['Inter'] font-semibold text-[#00464a]">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your thoughts to the discussion..."
                  className="w-full border border-[#bec8c9] px-3 py-2 font-['Inter'] text-base text-[#1c1b1b] placeholder:text-[#6b7280] outline-none focus:border-[#00464a]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isPosting || !commentText.trim()}
                    className="bg-[#00464a] text-white font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-4 py-1.5 disabled:opacity-60"
                  >
                    {isPosting ? 'Posting…' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <p className="font-['Inter'] text-[#3f4949]">
              <Link to="/login" className="text-[#00464a] underline">
                Log in
              </Link>{' '}
              to join the discussion.
            </p>
          )}

          <div className="flex flex-col gap-6">
            {comments === null && <p className="font-['Inter'] text-[#3f4949]">Loading comments…</p>}
            {comments?.length === 0 && (
              <p className="font-['Inter'] text-[#3f4949]">No comments yet — be the first to weigh in.</p>
            )}
            {comments?.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
