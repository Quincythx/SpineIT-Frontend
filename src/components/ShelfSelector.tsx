import { Check, ChevronDown } from 'lucide-react';
import { SHELVES } from '../utils/shelves';
import { useShelfStatus } from '../hooks/useShelfStatus';

export function ShelfSelector({ bookId }: { bookId: number }) {
  const { status, isLoading, setShelf } = useShelfStatus(bookId);

  const handleChange = (value: string) => {
    setShelf(value === 'none' ? null : (value as (typeof SHELVES)[number]));
  };

  return (
    <div className="relative w-full sm:w-auto">
      <select
        value={status ?? 'none'}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isLoading}
        className={`appearance-none w-full sm:w-auto pl-4 pr-10 py-3 rounded-xl font-['Inter'] font-semibold text-sm tracking-[0.7px] outline-none disabled:opacity-60 ${
          status ? 'bg-[#00464a] text-white' : 'border-2 border-[#00464a] text-[#00464a] bg-white'
        }`}
      >
        <option value="none">Add to Shelf</option>
        {SHELVES.map((shelf) => (
          <option key={shelf} value={shelf}>
            {shelf}
          </option>
        ))}
      </select>
      {status ? (
        <Check className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
      ) : (
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00464a]" />
      )}
    </div>
  );
}
