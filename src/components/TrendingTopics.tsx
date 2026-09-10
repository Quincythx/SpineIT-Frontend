import { ArrowRight } from 'lucide-react';

// Placeholder content until the backend exposes a topics/tags endpoint.
export function TrendingTopics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <div className="sm:col-span-2 lg:row-span-2 bg-bg-hover shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] rounded-lg p-6 flex flex-col justify-center gap-2">
        <span className="bg-accent/20 text-accent-hover text-xs font-medium px-3 py-1 rounded-xl w-fit">
          #DarkAcademia
        </span>
        <h3 className="font-['Inter'] font-bold text-2xl sm:text-[32px] leading-8 sm:leading-10 text-ink">
          Secrets &amp; Shadows
        </h3>
        <p className="font-['Inter'] text-base text-ink-muted">
          Dive into the atmospheric world of ancient libraries, hidden societies, and mysterious tragedies.
        </p>
      </div>

      <div className="bg-bg-hover drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] rounded-lg px-4 pt-[17px] pb-4 flex flex-col gap-2">
        <span className="bg-accent/20 text-accent-hover text-xs font-medium px-3 py-1 rounded-xl w-fit">
          #SummerReads
        </span>
        <p className="font-['Inter'] font-medium text-sm text-ink">Breezy escapes and sun-drenched romances.</p>
      </div>

      <div className="bg-bg-hover drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] rounded-lg px-4 pt-[17px] pb-4 flex flex-col gap-2">
        <span className="bg-accent/20 text-accent-hover text-xs font-medium px-3 py-1 rounded-xl w-fit">
          #HistoricalFiction
        </span>
        <p className="font-['Inter'] font-medium text-sm text-ink">Time travel through the pages of history.</p>
      </div>

      <button
        type="button"
        className="bg-accent drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] rounded-lg p-4 flex items-center justify-between h-[72px]"
      >
        <div className="text-left">
          <p className="font-['Inter'] font-semibold text-sm text-white tracking-[0.7px]">Explore More</p>
          <p className="font-['Inter'] text-sm text-white/80">Discover 50+ topics</p>
        </div>
        <ArrowRight className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
