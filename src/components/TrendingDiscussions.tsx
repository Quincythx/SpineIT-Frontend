// Placeholder content until the backend exposes a discussions endpoint.
const PLACEHOLDER_DISCUSSIONS = [
  { id: 1, title: 'The unreliable narrator in modern fiction', replies: 45 },
  { id: 2, title: 'Best translations of Dostoevsky?', replies: 112 },
];

export function TrendingDiscussions() {
  return (
    <div className="bg-white drop-shadow-[0px_4px_10px_rgba(0,96,100,0.05)] rounded-lg p-6 flex flex-col gap-6 w-full">
      <h3 className="font-['Playfair_Display'] font-semibold text-2xl leading-8 text-[#1c1b1b]">
        Trending Discussions
      </h3>
      <div className="flex flex-col gap-3">
        {PLACEHOLDER_DISCUSSIONS.map((item, i) => (
          <div key={item.id} className={i > 0 ? 'border-t border-[#e5e2e1] pt-3 flex flex-col gap-1' : 'flex flex-col gap-1'}>
            <h4 className="font-['Inter'] font-semibold text-sm tracking-[0.7px] text-[#1c1b1b]">{item.title}</h4>
            <p className="font-['Inter'] text-sm text-[#3f4949]">{item.replies} replies</p>
          </div>
        ))}
      </div>
    </div>
  );
}
