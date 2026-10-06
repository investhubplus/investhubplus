import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { usePortfolio } from './hooks/usePortfolio';
import { useQuotes } from './hooks/useQuotes';

function Shell() {
  const [page, setPage] = useState('dashboard');
  const { items } = usePortfolio();
  const { refresh, lastUpdate } = useQuotes(items.map((i) => i.ticker));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onRefresh={refresh} lastUpdate={lastUpdate} />
      <div className="flex flex-1">
        <Sidebar page={page} setPage={setPage} />
        <main className="flex-1 min-w-0">
          {page === 'dashboard' ? <Dashboard /> : <Settings />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Shell />
      </ProtectedRoute>
    </AuthProvider>
  );
}