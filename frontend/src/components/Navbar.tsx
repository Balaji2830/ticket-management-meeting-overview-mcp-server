export function Navbar() {
  return (
    <header className="glass-strong sticky top-0 z-20 mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-6xl items-center justify-between rounded-2xl px-5 py-3 sm:w-[calc(100%-3rem)]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-sm">
          🎫
        </span>
        <span className="font-semibold text-white">Ticket & Meeting Overview</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-white/60">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        Balaji
      </div>
    </header>
  );
}
