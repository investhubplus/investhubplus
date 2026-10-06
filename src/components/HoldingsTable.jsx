import { Trash2 } from 'lucide-react';
import { brl } from '../utils/format';

export default function HoldingsTable({ items, quotes, onRemove }) {
  if (!items.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        Nenhum ativo cadastrado. Clique em <strong>+ Adicionar ativo</strong> para começar.
      </div>
    );
  }

  const rows = items.map((it) => {
    const q = quotes[it.ticker] || {};
    const preco = q.price ?? Number(it.avg_price);
    const valor = preco * Number(it.quantity);
    const custo = Number(it.avg_price) * Number(it.quantity);
    const pl = valor - custo;
    const plPct = custo ? (pl / custo) * 100 : 0;
    return { it, q, preco, valor, pl, plPct };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="hidden md:table w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-3">Ativo</th>
            <th className="text-right px-4 py-3">Qtd</th>
            <th className="text-right px-4 py-3">Preço médio</th>
            <th className="text-right px-4 py-3">Preço atual</th>
            <th className="text-right px-4 py-3">Valor</th>
            <th className="text-right px-4 py-3">P&L</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ it, q, preco, valor, pl, plPct }) => (
            <tr key={it.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-semibold text-slate-800">{it.ticker}</div>
                <div className="text-xs text-slate-500 truncate max-w-[180px]">
                  {q.name || '—'}
                </div>
              </td>
              <td className="px-4 py-3 text-right">{Number(it.quantity)}</td>
              <td className="px-4 py-3 text-right">{brl(it.avg_price)}</td>
              <td className="px-4 py-3 text-right">{brl(preco)}</td>
              <td className="px-4 py-3 text-right font-medium">{brl(valor)}</td>
              <td className={`px-4 py-3 text-right font-medium ${
                pl >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {brl(pl)}<br />
                <span className="text-xs">{plPct.toFixed(2)}%</span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onRemove(it.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="md:hidden divide-y divide-slate-100">
        {rows.map(({ it, q, preco, valor, pl, plPct }) => (
          <li key={it.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-slate-800">{it.ticker}</div>
                <div className="text-xs text-slate-500 truncate max-w-[180px]">
                  {q.name || '—'}
                </div>
              </div>
              <button
                onClick={() => onRemove(it.id)}
                className="p-1.5 rounded hover:bg-red-50 text-slate-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-slate-500">Qtd:</span> {Number(it.quantity)}</div>
              <div className="text-right">
                <span className="text-slate-500">Atual:</span> {brl(preco)}
              </div>
              <div><span className="text-slate-500">Médio:</span> {brl(it.avg_price)}</div>
              <div className="text-right font-medium">{brl(valor)}</div>
            </div>
            <div className={`mt-2 text-sm font-medium ${
              pl >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {pl >= 0 ? '▲' : '▼'} {brl(pl)} ({plPct.toFixed(2)}%)
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}