'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = mode === 'login'
        ? await authApi.login(email, password)
        : await authApi.register(email, password, name);
      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-omega-accent to-omega-glow bg-clip-text text-transparent">
            OMEGA INFINITY
          </h1>
          <p className="text-white/40 mt-2">Enterprise AI Platform</p>
        </div>

        <div className="card">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-lg font-medium transition ${mode === 'login' ? 'bg-omega-accent text-white' : 'text-white/40'}`}>Login</button>
            <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-lg font-medium transition ${mode === 'register' ? 'bg-omega-accent text-white' : 'text-white/40'}`}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <input className="input" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            )}
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            {error && <p className="text-omega-danger text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-white/30 text-xs text-center mb-4">Or continue with</p>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1 text-sm">Google</button>
              <button className="btn-secondary flex-1 text-sm">GitHub</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
