import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const redirectTo = searchParams.get('redirect') || '/containers';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, redirectTo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Bitte E-Mail eingeben.');
      return;
    }
    try {
      await login(email);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || 'Login fehlgeschlagen.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 border border-slate-200 rounded-2xl bg-white p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
          <p className="text-sm text-slate-600">Mock-Login: nur E-Mail, kein Passwort.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Login...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
