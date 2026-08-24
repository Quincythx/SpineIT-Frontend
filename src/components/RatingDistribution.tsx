import { Star } from 'lucide-react';

export function RatingDistribution({ ratings }: { ratings: number[] }) {
  const total = ratings.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ratings.filter((r) => Math.round(r) === star).length);
  const average = total ? ratings.reduce((sum, r) => sum + r, 0) / total : 0;

  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start w-full">
      <div className="flex flex-col items-center shrink-0">
        <span className="font-['Playfair_Display'] font-bold text-5xl text-[#00464a]">{average.toFixed(1)}</span>
        <div className="flex gap-0.5 pt-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <Star key={v} className={`w-4 h-4 ${v <= Math.round(average) ? 'fill-[#7e5700] text-[#7e5700]' : 'text-[#e5e2e1]'}`} />
          ))}
        </div>
        <span className="font-['Inter'] text-sm text-[#3f4949] pt-1">
          {total} {total === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 w-full">
        {[5, 4, 3, 2, 1].map((star, i) => {
          const count = counts[i];
          const pct = total ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="font-['Inter'] text-xs text-[#3f4949] w-3 text-right">{star}</span>
              <Star className="w-3 h-3 fill-[#7e5700] text-[#7e5700] shrink-0" />
              <div className="flex-1 bg-[#e5e2e1] h-2 rounded-xl overflow-hidden">
                <div className="bg-[#7e5700] h-2 rounded-xl" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-['Inter'] text-xs text-[#3f4949] w-6 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
