import { RefreshCw, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onRefresh, lastUpdate }) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-6 h-6 text-brand-600" />
          <h1 className="text-lg md:text-xl font-bold text-slate-800">
            InvestHub<span className="text-brand-600">+</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {lastUpdate && (
            <span className="hidden sm:block text-xs text-slate-500">
              Atualizado {lastUpdate.toLocaleTimeString('pt-BR')}
            </span>
          )}
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
            title="Atualizar cotações"
          >
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={signOut}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
            title={`Sair (${user?.email})`}
          >
            <LogOut className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}