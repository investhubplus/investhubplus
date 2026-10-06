import { brl } from '../utils/format';

export default function SummaryCards({ totals }) {
  const { totalValue, totalCost, profit, profitPct, dayChange } = totals;

  const cards = [
    { label: 'Valor total', value: brl(totalValue), color: 'text-slate-800' },
    { label: 'Custo total', value: brl(totalCost), color: 'text-slate-500' },
    {
      label: 'Lucro/Prejuízo',
      value: `${brl(profit)} (${profitPct.toFixed(2)}%)`,
      color: profit >= 0 ? 'text-emerald-600' : 'text-red-600'
    },
    {
      label: 'Variação do dia',
      value: brl(dayChange),
      color: dayChange >= 0 ? 'text-emerald-600' : 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">{c.label}</p>
          <p className={`text-base md:text-lg font-semibold ${c.color} break-words`}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}