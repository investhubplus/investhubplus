// src/services/brapi.js
// Integração com a brapi v2 — https://brapi.dev/docs.mdx

const TOKEN = import.meta.env.VITE_BRAPI_TOKEN || '';
const BASE = 'https://brapi.dev/api/v2/stocks/quote';

/**
 * Erro tipado para falhas da brapi.
 * Carrega o status HTTP e, quando aplicável, o Retry-After (429).
 */
export class BrapiError extends Error {
  constructor(message, status, retryAfter) {
    super(message);
    this.name = 'BrapiError';
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

/**
 * Extrai um resumo seguro do corpo de erro da brapi.
 */
async function readError(res) {
  let detail = '';
  try {
    const text = await res.text();
    try {
      const j = JSON.parse(text);
      detail = j.message || j.error || text;
    } catch {
      detail = text;
    }
  } catch {
    /* ignora */
  }
  const retryAfter = res.headers.get('Retry-After');
  return {
    status: res.status,
    retryAfter: retryAfter ? Number(retryAfter) : undefined,
    detail: String(detail).slice(0, 300)
  };
}

/**
 * Busca cotações na brapi v2.
 *
 * @param {string[]} symbols Lista de tickers (ex.: ['PETR4', 'VALE3'])
 * @returns {Promise<Record<string, {
 *   symbol: string,
 *   name: string,
 *   price: number,
 *   change: number,
 *   changePercent: number,
 *   previousClose: number,
 *   currency: string
 * }>>} Mapa ticker -> cotação normalizada
 * @throws {BrapiError} em respostas não-2xx
 */
export async function fetchQuotes(symbols) {
  const clean = symbols
    .map((s) => String(s).trim().toUpperCase())
    .filter(Boolean);

  if (clean.length === 0) return {};

  const url = `${BASE}?symbols=${encodeURIComponent(clean.join(','))}`;

  const headers = { Accept: 'application/json' };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const { status, retryAfter, detail } = await readError(res);
    let msg = `brapi retornou ${status}`;
    if (status === 401) msg = 'Chave da brapi ausente ou inválida';
    else if (status === 403) msg = 'Plano da brapi não cobre estes dados';
    else if (status === 429) msg = 'Cota da brapi esgotada — aguarde e tente de novo';
    else if (detail) msg = `${msg}: ${detail}`;
    throw new BrapiError(msg, status, retryAfter);
  }

  const json = await res.json();

  // v2: results[] traz um item por ticker; dados em results[].data
  const map = {};
  for (const r of json.results ?? []) {
    const d = r.data ?? {};
    map[r.symbol] = {
      symbol: r.symbol,
      name: d.shortName || d.longName || r.symbol,
      price: d.regularMarketPrice ?? 0,
      change: d.regularMarketChange ?? 0,
      changePercent: d.regularMarketChangePercent ?? 0,
      previousClose: d.regularMarketPreviousClose ?? 0,
      currency: d.currency || 'BRL'
    };
  }
  return map;
}

/** Atalho para o Ibovespa (^BVSP). Falha silenciosa. */
export async function fetchIbovespa() {
  try {
    const map = await fetchQuotes(['^BVSP']);
    return map['^BVSP'] || null;
  } catch {
    return null;
  }
}