const LINKS = ['Community Guidelines', 'Discovery', 'Privacy Policy', 'Terms of Service'];

export function Footer() {
  return (
    <footer className="bg-[#f6f3f2] border-t border-[#bec8c9] pt-12 pb-12 lg:pt-20 lg:pb-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 flex gap-6 justify-center flex-wrap">
        <div className="flex-1 min-w-[200px] flex flex-col gap-3">
          <p className="font-['Playfair_Display'] font-bold text-2xl text-[#00464a]">SpineIt</p>
          <p className="font-['Inter'] text-sm text-[#3f4949]">© 2024 SpineIt. Your Digital Reading Nook.</p>
        </div>
        <div className="flex-1 min-w-[200px] flex flex-col gap-3">
          <p className="font-['Inter'] font-bold text-sm tracking-[0.7px] text-[#00464a]">Links</p>
          <nav className="flex flex-col gap-2">
            {LINKS.map((label) => (
              <span key={label} className="font-['Inter'] text-sm text-[#3f4949] underline opacity-90 cursor-default">
                {label}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
