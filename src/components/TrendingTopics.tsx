import { ArrowRight } from 'lucide-react';

// Placeholder content until the backend exposes a topics/tags endpoint.
export function TrendingTopics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <div className="sm:col-span-2 lg:row-span-2 bg-[#f6f3f2] shadow-[0px_4px_20px_0px_rgba(0,96,100,0.05)] rounded-lg p-6 flex flex-col justify-center gap-2">
        <span className="bg-[rgba(126,87,0,0.2)] text-[#6a4800] text-xs font-medium px-3 py-1 rounded-xl w-fit">
          #DarkAcademia
        </span>
        <h3 className="font-['Playfair_Display'] font-bold text-2xl sm:text-[32px] leading-8 sm:leading-10 text-[#1c1b1b]">
          Secrets &amp; Shadows
        </h3>
        <p className="font-['Inter'] text-base text-[#3f4949]">
          Dive into the atmospheric world of ancient libraries, hidden societies, and mysterious tragedies.
        </p>
      </div>

      <div className="bg-[#f6f3f2] drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg px-4 pt-[17px] pb-4 flex flex-col gap-2">
        <span className="bg-[rgba(126,87,0,0.2)] text-[#6a4800] text-xs font-medium px-3 py-1 rounded-xl w-fit">
          #SummerReads
        </span>
        <p className="font-['Inter'] font-medium text-sm text-[#1c1b1b]">Breezy escapes and sun-drenched romances.</p>
      </div>

      <div className="bg-[#f6f3f2] drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg px-4 pt-[17px] pb-4 flex flex-col gap-2">
        <span className="bg-[rgba(126,87,0,0.2)] text-[#6a4800] text-xs font-medium px-3 py-1 rounded-xl w-fit">
          #HistoricalFiction
        </span>
        <p className="font-['Inter'] font-medium text-sm text-[#1c1b1b]">Time travel through the pages of history.</p>
      </div>

      <button
        type="button"
        className="bg-[#00464a] drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg p-4 flex items-center justify-between h-[72px]"
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
