import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USE_MOCKS } from '../services/api';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ username, password });
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center w-full max-w-[400px]">
        <Link to="/" className="flex flex-col gap-1 items-center w-full">
          <BookOpen className="w-9 h-9 text-accent" />
          <h1 className="font-['Inter'] font-bold text-2xl text-ink pt-2">Log in to SpineIt</h1>
        </Link>

        {USE_MOCKS && (
          <p className="w-full text-sm text-[#6a4800] bg-[rgba(254,179,0,0.15)] border border-[rgba(254,179,0,0.4)] rounded px-3 py-2">
            Demo mode — try <strong>jane@spineit.com</strong> (any password), or sign up fresh below.
          </p>
        )}

        {error && (
          <p className="w-full text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
        )}

        <div className="flex flex-col gap-4 items-start w-full">
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="email" className="font-['Inter'] font-medium text-xs text-ink-muted">
              Email Address
            </label>
            <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
              <Mail className="w-4 h-4 text-ink-muted shrink-0" />
              <input
                id="email"
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="reader@spineit.com"
                className="flex-1 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none bg-transparent min-w-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 items-start w-full">
            <div className="flex items-center justify-between w-full">
              <label htmlFor="password" className="font-['Inter'] font-medium text-xs text-ink-muted">
                Password
              </label>
              <Link to="/forgot-password" className="font-['Inter'] font-medium text-xs text-accent hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
              <Lock className="w-4 h-4 text-ink-muted shrink-0" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none bg-transparent min-w-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-ink-muted shrink-0"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-accent font-['Inter'] font-bold text-sm text-center text-white disabled:opacity-60 mt-2"
          >
            {isSubmitting ? 'Logging In…' : 'Log In'}
          </button>
        </div>

        <p className="font-['Inter'] text-sm text-ink-muted text-center">
          New to SpineIt?{' '}
          <Link to="/signup" className="text-accent font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
