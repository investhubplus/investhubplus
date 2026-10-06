import { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const fn = mode === 'login' ? signIn : signUp;
      const { error } = await fn(email, password);
      if (error) throw error;
      if (mode === 'signup') {
        setMsg('Conta criada! Você já pode entrar.');
      }
    } catch (e) {
      setMsg(e.message || 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="w-6 h-6 text-brand-600" />
          <h1 className="text-lg font-bold text-slate-800">
            InvestHub<span className="text-brand-600">+</span>
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          {mode === 'login'
            ? 'Acesse seu painel de investimentos.'
            : 'Cadastre-se para começar a acompanhar seus ativos.'}
        </p>

        <label className="block mb-3">
          <span className="text-xs font-medium text-slate-600">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-xs font-medium text-slate-600">Senha</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </label>

        {msg && <p className="text-xs text-slate-600 mb-3">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(''); }}
          className="w-full mt-3 text-xs text-brand-600 hover:underline"
        >
          {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </button>
      </form>
    </div>
  );
}