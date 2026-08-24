import type { Review } from '../types/api';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ReadingStats({ reviews }: { reviews: Review[] }) {
  const genreCounts = new Map<string, number>();
  for (const r of reviews) {
    const genre = r.book.genre ?? 'Uncategorized';
    genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
  }
  const topGenres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxGenreCount = Math.max(1, ...topGenres.map(([, count]) => count));

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()] };
  });
  const monthCounts = months.map(({ key, label }) => {
    const count = reviews.filter((r) => {
      const d = new Date(r.created_at);
      return `${d.getFullYear()}-${d.getMonth()}` === key;
    }).length;
    return { label, count };
  });
  const maxMonthCount = Math.max(1, ...monthCounts.map((m) => m.count));

  if (reviews.length === 0) {
    return (
      <div className="bg-[#f6f3f2] drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg p-6 flex flex-col gap-2">
        <h3 className="font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b]">Reading Stats</h3>
        <p className="font-['Inter'] text-sm text-[#3f4949]">Write a review to start seeing your stats.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f3f2] drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg p-6 flex flex-col gap-6">
      <h3 className="font-['Playfair_Display'] font-semibold text-2xl text-[#1c1b1b]">Reading Stats</h3>

      <div className="flex flex-col gap-2">
        <p className="font-['Inter'] font-semibold text-xs tracking-[1.4px] uppercase text-[#3f4949]">Top Genres</p>
        {topGenres.map(([genre, count]) => (
          <div key={genre} className="flex items-center gap-2">
            <span className="font-['Inter'] text-xs text-[#3f4949] w-24 shrink-0 truncate">{genre}</span>
            <div className="flex-1 bg-[#e5e2e1] h-2 rounded-xl overflow-hidden">
              <div className="bg-[#00464a] h-2 rounded-xl" style={{ width: `${(count / maxGenreCount) * 100}%` }} />
            </div>
            <span className="font-['Inter'] text-xs text-[#3f4949] w-4 text-right">{count}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-['Inter'] font-semibold text-xs tracking-[1.4px] uppercase text-[#3f4949]">
          Reviews per Month
        </p>
        <div className="flex items-end gap-2 h-20">
          {monthCounts.map(({ label, count }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div
                className="w-full bg-[#7e5700] rounded-t"
                style={{ height: `${Math.max(4, (count / maxMonthCount) * 100)}%` }}
              />
              <span className="font-['Inter'] text-[10px] text-[#3f4949]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
