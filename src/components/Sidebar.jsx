import { LayoutDashboard, Settings, TrendingUp } from 'lucide-react';

const ITEMS = [
  { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
  { id: 'settings', label: 'Config', icon: Settings }
];

export default function Sidebar({ page, setPage }) {
  return (
    <>
      <aside className="hidden md:flex md:flex-col w-56 border-r border-slate-200 bg-white px-3 py-4">
        <div className="flex items-center gap-2 px-2 pb-4 mb-4 border-b border-slate-100">
          <TrendingUp className="w-5 h-5 text-brand-600" />
          <span className="font-semibold text-slate-700">Navegação</span>
        </div>
        <nav className="flex flex-col gap-1">
          {ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                page === id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs ${
              page === id ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}