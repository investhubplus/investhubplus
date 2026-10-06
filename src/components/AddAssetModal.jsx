import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddAssetModal({ open, onClose, onAdd }) {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [err, setErr] = useState('');

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    const q = Number(quantity);
    const p = Number(avgPrice);
    if (!ticker.trim() || q <= 0 || p <= 0) {
      setErr('Preencha todos os campos com valores válidos.');
      return;
    }
    try {
      await onAdd({ ticker, quantity: q, avgPrice: p });
      setTicker(''); setQuantity(''); setAvgPrice(''); setErr('');
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao salvar.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-0 md:p-4">
      <form
        onSubmit={submit}
        className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-5 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Adicionar ativo</h2>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <label className="block mb-3">
          <span className="text-xs font-medium text-slate-600">Ticker</span>
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="PETR4"
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Ex.: PETR4, VALE3, ITSA4, BBAS3, B3SA3
          </p>
        </label>

        <label className="block mb-3">
          <span className="text-xs font-medium text-slate-600">Quantidade</span>
          <input
            type="number"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-xs font-medium text-slate-600">Preço médio (R$)</span>
          <input
            type="number"
            step="any"
            value={avgPrice}
            onChange={(e) => setAvgPrice(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </label>

        {err && <p className="text-xs text-red-600 mb-3">{err}</p>}

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition"
        >
          Adicionar à carteira
        </button>
      </form>
    </div>
  );
}