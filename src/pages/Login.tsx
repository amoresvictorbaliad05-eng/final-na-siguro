import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, Loader2, AlertCircle, Info } from 'lucide-react';

const demoCredentials = {
  admin: { email: 'captain@barangay.gov.ph', password: 'admin123' },
  user: { email: 'pedro@email.com', password: 'user123' },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'user') => {
    const creds = demoCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-200">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the Barangay Bantay system
          </p>
        </div>

        {/* Backend connection info */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-emerald-900">Backend: Aiven PostgreSQL</p>
              <p className="text-xs text-emerald-700">
                Make sure the Node.js server is running on port 3001. 
                Run <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono">npm run server</code> to start.
              </p>
            </div>
          </div>
        </div>

        {/* Demo credentials info */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">Demo Accounts</p>
              <p className="text-xs text-blue-700">After running <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono">npm run db:seed</code></p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="block w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-left text-xs transition-colors hover:bg-blue-50"
                >
                  <span className="font-semibold text-blue-800">Admin:</span>{' '}
                  <span className="text-slate-600">captain@barangay.gov.ph / admin123</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('user')}
                  className="block w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-left text-xs transition-colors hover:bg-blue-50"
                >
                  <span className="font-semibold text-blue-800">Citizen:</span>{' '}
                  <span className="text-slate-600">pedro@email.com / user123</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
