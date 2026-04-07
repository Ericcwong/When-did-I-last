import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 px-4 py-3 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <h1 className="text-lg font-bold tracking-tight">
          When did I last<span className="text-emerald-400">...</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
