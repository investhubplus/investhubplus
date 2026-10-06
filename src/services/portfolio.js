import { supabase } from '../lib/supabase';

export async function listHoldings(userId) {
  const { data, error } = await supabase
    .from('holdings')
    .select('*')
    .eq('user_id', userId)
    .order('ticker');
  if (error) throw error;
  return data ?? [];
}

/**
 * Adiciona ou mescla com ativo existente (mesmo ticker).
 * Recalcula preço médio ponderado quando já existe.
 */
export async function upsertHolding(userId, { ticker, quantity, avgPrice, type = 'acao' }) {
  const t = ticker.toUpperCase().trim();

  const { data: existing, error: errSel } = await supabase
    .from('holdings')
    .select('*')
    .eq('user_id', userId)
    .eq('ticker', t)
    .maybeSingle();
  if (errSel) throw errSel;

  if (existing) {
    const totalQtd = Number(existing.quantity) + Number(quantity);
    const novoMedio =
      (Number(existing.quantity) * Number(existing.avg_price) +
        Number(quantity) * Number(avgPrice)) / totalQtd;

    const { data, error } = await supabase
      .from('holdings')
      .update({ quantity: totalQtd, avg_price: novoMedio })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('holdings')
    .insert({
      user_id: userId,
      ticker: t,
      quantity,
      avg_price: avgPrice,
      type
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeHolding(id) {
  const { error } = await supabase.from('holdings').delete().eq('id', id);
  if (error) throw error;
}

export async function clearAllHoldings(userId) {
  const { error } = await supabase.from('holdings').delete().eq('user_id', userId);
  if (error) throw error;
}