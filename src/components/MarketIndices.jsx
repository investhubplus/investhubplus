import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketIndices({ ibov }) {
  if (!ibov) return null;
  const up = ibov.changePercent >= 0;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500">Ibovespa</p>
        <p className="text-lg font-semibold text-slate-800">
          {ibov.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${
        up ? 'text-emerald-600' : 'text-red-600'
      }`}>
        {up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {ibov.changePercent.toFixed(2)}%
      </div>
    </div>
  );
}