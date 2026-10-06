import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!user) return <Login />;
  return children;
}