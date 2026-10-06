import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { brl } from '../utils/format';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AllocationChart({ items, quotes }) {
  const data = items.map((it, i) => {
    const preco = quotes[it.ticker]?.price ?? Number(it.avg_price);
    return {
      name: it.ticker,
      value: preco * Number(it.quantity),
      color: COLORS[i % COLORS.length]
    };
  }).filter((d) => d.value > 0);

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 h-64 flex items-center justify-center text-slate-400 text-sm">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Alocação</h3>
      <div className="h-56">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip formatter={(v) => brl(v)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 space-y-1 text-xs">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="text-slate-500">{brl(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}