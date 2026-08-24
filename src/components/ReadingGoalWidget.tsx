import { useState } from 'react';
import type { Review } from '../types/api';
import { useReadingGoal } from '../hooks/useReadingGoal';

export function ReadingGoalWidget({ username, reviews }: { username: string; reviews: Review[] }) {
  const { goal, setGoal } = useReadingGoal(username);
  const [draft, setDraft] = useState('12');

  const thisYear = new Date().getFullYear();
  const booksThisYear = new Set(
    reviews.filter((r) => new Date(r.created_at).getFullYear() === thisYear).map((r) => r.book.id)
  ).size;

  if (goal === null) {
    return (
      <div className="bg-[#f6f3f2] drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg p-6 flex flex-col gap-3">
        <h3 className="font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b]">Reading Goal</h3>
        <p className="font-['Inter'] text-sm text-[#3f4949]">
          Set a target for how many books you want to review this year.
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-20 border border-[#bec8c9] rounded px-3 py-2 font-['Inter'] text-sm text-[#1c1b1b] outline-none focus:border-[#00464a]"
          />
          <button
            type="button"
            onClick={() => setGoal(Number(draft) || 12)}
            className="bg-[#00464a] text-white font-['Inter'] font-semibold text-sm tracking-[0.7px] rounded-xl px-4 py-2"
          >
            Set Goal
          </button>
        </div>
      </div>
    );
  }

  const pct = Math.min(100, (booksThisYear / goal) * 100);

  return (
    <div className="bg-[#f6f3f2] drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b]">{thisYear} Goal</h3>
        <button
          type="button"
          onClick={() => setGoal(null)}
          className="font-['Inter'] text-xs text-[#3f4949] underline"
        >
          Edit
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-['Inter'] text-base text-[#1c1b1b]">Books Reviewed</span>
        <span className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#00464a]">
          {booksThisYear} / {goal} Books
        </span>
      </div>
      <div className="bg-[#e5e2e1] h-2 rounded-xl overflow-hidden">
        <div className="bg-[#7e5700] h-2 rounded-xl" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
