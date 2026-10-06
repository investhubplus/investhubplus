const BASE = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';

function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${mm}-${dd}-${d.getFullYear()}`;
}

export async function fetchPtax(moeda = 'USD') {
  const hoje = new Date();
  const inicio = new Date();
  inicio.setDate(hoje.getDate() - 7);

  const url =
    `${BASE}/CotacaoMoedaPeriodo(moeda=@moeda,datalnicial=@datalnicial,` +
    `dataFinalCotacao=@dataFinalCotacao)?@moeda='${moeda}'` +
    `&@datalnicial='${formatDate(inicio)}'` +
    `&@dataFinalCotacao='${formatDate(hoje)}'` +
    `&$orderby=dataHoraCotacao desc&$top=1&$format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`PTAX erro ${res.status}`);
  const data = await res.json();
  const item = data.value?.[0];
  if (!item) return null;

  return {
    moeda,
    compra: item.cotacaoCompra,
    venda: item.cotacaoVenda,
    dataHora: item.dataHoraCotacao,
    boletim: item.tipoBoletim
  };
}

export async function fetchUsdEur() {
  const [usd, eur] = await Promise.all([
    fetchPtax('USD').catch(() => null),
    fetchPtax('EUR').catch(() => null)
  ]);
  return { usd, eur };
}