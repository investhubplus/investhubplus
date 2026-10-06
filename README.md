# InvestHub+

Painel pessoal de investimentos hospedado no GitHub Pages, com dados no
Supabase e cotações via brapi.dev e PTAX do Banco Central.

## 🧱 Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Recharts
- **Backend**: Supabase (Postgres + Auth) — plano Free
- **Cotações**: brapi.dev v2 (Free) + PTAX/Bacen (público)
- **Hospedagem**: GitHub Pages
- **Deploy**: GitHub Actions

## 🚀 Publicação (passo a passo)

### 1. Criar o repositório

- Crie um repositório **público** no GitHub com o nome `investhubplus`
  (se mudar, atualize `REPO` em `vite.config.js`).

### 2. Configurar o Supabase

1. Crie um projeto em https://supabase.com (plano Free).
2. Vá em **SQL Editor → New query**, cole o conteúdo de `supabase/schema.sql`
   e clique em **Run**.
3. Vá em **Project Settings → API** e copie:
   - **Project URL** → vai virar `VITE_SUPABASE_URL`
   - **Publishable key** (ou `anon public`) → vai virar `VITE_SUPABASE_ANON_KEY`
4. Vá em **Authentication → Providers → Email** e desative
   "Confirm email" (para login direto, sem custo de envio de e-mail).
5. Vá em **Authentication → URL Configuration** e cadastre:
   - **Site URL**: `https://SEU_USUARIO.github.io/investhubplus/`
   - **Redirect URLs**: a mesma URL acima

### 3. Configurar os Secrets no GitHub

Em **Settings → Secrets and variables → Actions → New repository secret**,
crie os três:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Publishable key do Supabase |
| `VITE_BRAPI_TOKEN` | token do brapi.dev (ou vazio) |

### 4. Ativar o GitHub Pages

- **Settings → Pages → Source**: escolha **GitHub Actions**.
- **Settings → Actions → General → Workflow permissions**:
  marque **Read and write permissions**.

### 5. Preparar e publicar

Na sua máquina, dentro da pasta do projeto:

```bash
# Gera o package-lock.json (obrigatório para o npm ci no Actions)
npm install

# Publicação
git init
git add .
git commit -m "primeiro deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/investhubplus.git
git push -u origin main
```

O workflow roda sozinho. Em ~1 minuto o site estará em:

```
https://SEU_USUARIO.github.io/investhubplus/
```

## 🧪 Rodando localmente (opcional)

Só para desenvolvimento. **Não é necessário para publicar.**

```bash
cp .env.example .env.local
# edite o .env.local com seus valores
npm install
npm run dev
```

Abra `http://localhost:5173/` — mas lembre: **esse endereço só existe na sua
máquina**. O site público é o do GitHub Pages.

## 🆓 Gratuidade

- GitHub Pages: ilimitado para repositórios públicos
- GitHub Actions: ilimitado para repositórios públicos
- Supabase Free: 500 MB, 50k usuários/mês
- brapi.dev Free: 15.000 req/mês (ou 4 tickers sem token)
- PTAX/Bacen: público, sem cadastro

## ⚠️ Única manutenção

O Supabase Free pausa projetos após 7 dias sem uso. Abra o site pelo menos
uma vez por semana. Se pausar, clique em **Restore** no painel — nada é perdido.

## 🐛 Problemas comuns

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Página branca, 404 em `/assets/...` | `base` errado no `vite.config.js` | Ajustar `REPO` para o nome exato do repositório |
| CSS não carrega | Mesmo problema | Mesma solução |
| "There isn't a GitHub Pages site here" | Pages não ativado | Settings → Pages → Source: GitHub Actions |
| Workflow falha em `npm ci` | `package-lock.json` desatualizado | Rodar `npm install` e comitar o novo |
| Login Supabase dá erro | URL não autorizada | Supabase → Authentication → URL Configuration |
| "Failed to fetch" após semanas | Projeto pausado | Restore no painel do Supabase |
| Cotação não aparece | Token brapi inválido | Confira `VITE_BRAPI_TOKEN` no `.env.local` e nos Secrets |