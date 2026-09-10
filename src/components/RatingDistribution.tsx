import { Star } from 'lucide-react';

export function RatingDistribution({ ratings }: { ratings: number[] }) {
  const total = ratings.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ratings.filter((r) => Math.round(r) === star).length);
  const average = total ? ratings.reduce((sum, r) => sum + r, 0) / total : 0;

  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start w-full">
      <div className="flex flex-col items-center shrink-0">
        <span className="font-['Inter'] font-bold text-5xl text-accent">{average.toFixed(1)}</span>
        <div className="flex gap-0.5 pt-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <Star key={v} className={`w-4 h-4 ${v <= Math.round(average) ? 'fill-accent text-accent' : 'text-border'}`} />
          ))}
        </div>
        <span className="font-['Inter'] text-sm text-ink-muted pt-1">
          {total} {total === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 w-full">
        {[5, 4, 3, 2, 1].map((star, i) => {
          const count = counts[i];
          const pct = total ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="font-['Inter'] text-xs text-ink-muted w-3 text-right">{star}</span>
              <Star className="w-3 h-3 fill-accent text-accent shrink-0" />
              <div className="flex-1 bg-border h-2 rounded-xl overflow-hidden">
                <div className="bg-accent h-2 rounded-xl" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-['Inter'] text-xs text-ink-muted w-6 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
