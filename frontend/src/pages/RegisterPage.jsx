import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/Button.jsx';
import { InputField } from '../components/FormField.jsx';

export default function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      await login({ email: form.email, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ backgroundColor: '#0e0e10' }}>
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-2xl shadow-violet-900/60">
            <svg viewBox="0 0 20 20" fill="white" className="h-5 w-5">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[#e2e2e8] tracking-tight">Create an account</h1>
            <p className="mt-0.5 text-sm text-[#50506a]">Start managing your tasks today</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#1e1e28] bg-[#13131a] p-7 shadow-2xl shadow-black/50">
          {error && (
            <div className="mb-5 rounded-lg border border-rose-500/20 bg-rose-500/8 px-3 py-2.5 text-sm text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              id="reg-name"
              label="Full name"
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              onChange={set('name')}
              required
              autoFocus
              autoComplete="name"
            />
            <InputField
              id="reg-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
            <InputField
              id="reg-password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="new-password"
              minLength={8}
            />
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full !mt-5">
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-[#50506a]">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
