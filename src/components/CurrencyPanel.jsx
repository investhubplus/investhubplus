import { DollarSign, Euro } from 'lucide-react';

function fmt(n) {
  return n?.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export default function CurrencyPanel({ usd, eur }) {
  const cards = [
    { label: 'Dólar (USD)', icon: DollarSign, data: usd, color: 'text-emerald-600' },
    { label: 'Euro (EUR)', icon: Euro, data: eur, color: 'text-blue-600' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map(({ label, icon: Icon, data, color }) => (
        <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </div>
          {data ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Compra</span>
                <span className="font-semibold">R$ {fmt(data.compra)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Venda</span>
                <span className="font-semibold">R$ {fmt(data.venda)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {data.boletim} — {new Date(data.dataHora).toLocaleString('pt-BR')}
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-400">Carregando…</p>
          )}
        </div>
      ))}
    </div>
  );
}