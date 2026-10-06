import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { clearAllHoldings } from '../services/portfolio';

export default function Settings() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  async function apagarCarteira() {
    if (!confirm('Apagar TODOS os ativos da carteira? Essa ação não pode ser desfeita.')) return;
    setLoading(true);
    try {
      await clearAllHoldings(user.id);
      alert('Carteira apagada.');
    } catch (e) {
      alert('Erro: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Configurações</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-sm text-slate-600">
        <p>
          <strong className="text-slate-800">Conta:</strong> {user?.email}
        </p>
        <p>
          <strong className="text-slate-800">Armazenamento:</strong> Supabase (plano gratuito).
        </p>
        <p>
          <strong className="text-slate-800">Cotações:</strong> brapi.dev — plano gratuito
          cobre PETR4, VALE3, MGLU3, ITUB4 sem token.
        </p>
        <p>
          <strong className="text-slate-800">Câmbio:</strong> PTAX do Banco Central do
          Brasil (público e gratuito).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <button
          onClick={apagarCarteira}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60"
        >
          Apagar carteira
        </button>
        <button
          onClick={signOut}
          className="ml-2 px-4 py-2 rounded-lg bg-slate-200 text-slate-800 text-sm font-medium hover:bg-slate-300"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}