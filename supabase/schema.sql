-- =====================================================
-- Tabela de posições (holdings)
-- =====================================================
create table if not exists public.holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  quantity numeric(18, 6) not null check (quantity > 0),
  avg_price numeric(18, 6) not null check (avg_price >= 0),
  type text not null default 'acao',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ticker)
);

create index if not exists holdings_user_id_idx on public.holdings(user_id);

-- =====================================================
-- RLS — protege os dados por usuário
-- =====================================================
alter table public.holdings enable row level security;

drop policy if exists "Usuário lê os próprios ativos" on public.holdings;
create policy "Usuário lê os próprios ativos"
  on public.holdings for select
  using (auth.uid() = user_id);

drop policy if exists "Usuário insere os próprios ativos" on public.holdings;
create policy "Usuário insere os próprios ativos"
  on public.holdings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuário atualiza os próprios ativos" on public.holdings;
create policy "Usuário atualiza os próprios ativos"
  on public.holdings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Usuário deleta os próprios ativos" on public.holdings;
create policy "Usuário deleta os próprios ativos"
  on public.holdings for delete
  using (auth.uid() = user_id);

-- =====================================================
-- Trigger: mantém updated_at sincronizado
-- =====================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_holdings_updated_at on public.holdings;
create trigger trg_holdings_updated_at
  before update on public.holdings
  for each row execute function public.touch_updated_at();