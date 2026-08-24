import type { Comment } from '../types/api';
import { Avatar } from './Avatar';
import { formatRelativeTime } from '../utils/formatRelativeTime';

export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3 items-start w-full">
      <Avatar name={comment.user} size={40} />
      <div className="flex-1 min-w-0 bg-white border border-[rgba(190,200,201,0.2)] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded p-6 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#1c1b1b]">{comment.user}</span>
          <span className="font-['Inter'] text-sm text-[#3f4949]">{formatRelativeTime(comment.created_at)}</span>
        </div>
        <p className="font-['Inter'] text-base text-[#1c1b1b]">{comment.text}</p>
      </div>
    </div>
  );
}
