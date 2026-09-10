const PALETTE = ['#8C1D40', '#0F1419', '#6E1732', '#536471', '#3D1024'];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({
  name,
  src,
  size = 40,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-xl object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <div
      className="rounded-xl flex items-center justify-center shrink-0 text-white font-['Inter'] font-semibold"
      style={{ width: size, height: size, backgroundColor: colorFor(name), fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
