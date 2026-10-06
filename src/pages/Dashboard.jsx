import { useMemo, useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useQuotes } from '../hooks/useQuotes';
import { fetchIbovespa } from '../services/brapi';
import { fetchUsdEur } from '../services/ptax';

import SummaryCards from '../components/SummaryCards';
import HoldingsTable from '../components/HoldingsTable';
import AllocationChart from '../components/AllocationChart';
import CurrencyPanel from '../components/CurrencyPanel';
import MarketIndices from '../components/MarketIndices';
import AddAssetModal from '../components/AddAssetModal';

export default function Dashboard() {
  const { items, add, remove } = usePortfolio();
  const tickers = items.map((i) => i.ticker);
  const { quotes, refresh } = useQuotes(tickers);

  const [ibov, setIbov] = useState(null);
  const [fx, setFx] = useState({ usd: null, eur: null });
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchIbovespa().then(setIbov);
    fetchUsdEur().then(setFx);
  }, []);

  const totals = useMemo(() => {
    let totalValue = 0, totalCost = 0, dayChange = 0;
    items.forEach((it) => {
      const q = quotes[it.ticker];
      const preco = q?.price ?? Number(it.avg_price);
      totalValue += preco * Number(it.quantity);
      totalCost += Number(it.avg_price) * Number(it.quantity);
      if (q?.change) dayChange += q.change * Number(it.quantity);
    });
    const profit = totalValue - totalCost;
    const profitPct = totalCost ? (profit / totalCost) * 100 : 0;
    return { totalValue, totalCost, profit, profitPct, dayChange };
  }, [items, quotes]);

  function handleRefresh() {
    refresh();
    fetchIbovespa().then(setIbov);
    fetchUsdEur().then(setFx);
  }

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Painel</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100"
          >
            Atualizar
          </button>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
          >
            <Plus className="w-4 h-4" /> Adicionar ativo
          </button>
        </div>
      </div>

      <SummaryCards totals={totals} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <HoldingsTable items={items} quotes={quotes} onRemove={remove} />
        </div>
        <div className="space-y-4">
          <MarketIndices ibov={ibov} />
          <CurrencyPanel usd={fx.usd} eur={fx.eur} />
          <AllocationChart items={items} quotes={quotes} />
        </div>
      </div>

      <AddAssetModal open={modal} onClose={() => setModal(false)} onAdd={add} />
    </div>
  );
}