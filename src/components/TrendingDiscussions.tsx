// Placeholder content until the backend exposes a discussions endpoint.
const PLACEHOLDER_DISCUSSIONS = [
  { id: 1, title: 'The unreliable narrator in modern fiction', replies: 45 },
  { id: 2, title: 'Best translations of Dostoevsky?', replies: 112 },
];

export function TrendingDiscussions() {
  return (
    <div className="bg-white drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] rounded-lg p-6 flex flex-col gap-6 w-full">
      <h3 className="font-['Inter'] font-semibold text-2xl leading-8 text-ink">
        Trending Discussions
      </h3>
      <div className="flex flex-col gap-3">
        {PLACEHOLDER_DISCUSSIONS.map((item, i) => (
          <div key={item.id} className={i > 0 ? 'border-t border-border pt-3 flex flex-col gap-1' : 'flex flex-col gap-1'}>
            <h4 className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-ink">{item.title}</h4>
            <p className="font-['Inter'] text-sm text-ink-muted">{item.replies} replies</p>
          </div>
        ))}
      </div>
    </div>
  );
}
