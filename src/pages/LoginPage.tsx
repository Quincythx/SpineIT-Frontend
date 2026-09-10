import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USE_MOCKS } from '../services/api';
import loginBg from '../assets/auth/login-bg.jpg';

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
    <div className="flex items-stretch min-h-screen bg-bg">
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img src={loginBg} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-accent/20 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-end p-16 bg-gradient-to-t from-accent/80 to-transparent">
          <h2 className="font-['Inter'] font-bold text-5xl leading-[56px] text-white tracking-[-0.96px]">
            Your Literary Sanctuary
            <br />
            Awaits
          </h2>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-16">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 sm:gap-12 items-center w-full max-w-[448px]">
          <div className="flex flex-col gap-1 items-center w-full">
            <BookOpen className="w-11 h-8 text-accent" />
            <h1 className="font-['Inter'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[56px] text-accent tracking-[-0.96px] pt-2">
              Welcome Back
            </h1>
            <p className="font-['Inter'] text-lg text-ink-muted">Return to your digital reading nook.</p>
          </div>

          {USE_MOCKS && (
            <p className="w-full text-sm text-[#6a4800] bg-[rgba(254,179,0,0.15)] border border-[rgba(254,179,0,0.4)] rounded px-3 py-2">
              Demo mode — try <strong>jane@spineit.com</strong> (any password), or sign up fresh below.
            </p>
          )}

          {error && (
            <p className="w-full text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          <div className="flex flex-col gap-6 items-start w-full">
            <div className="flex flex-col gap-1 items-start w-full">
              <label htmlFor="email" className="font-['Inter'] font-medium text-xs text-ink-muted">
                Email Address
              </label>
              <div className="flex items-center gap-2 border-b border-border-strong pb-[5px] w-full">
                <Mail className="w-4 h-4 text-border-strong" />
                <input
                  id="email"
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="reader@spineit.com"
                  className="flex-1 font-['Inter'] text-base text-ink placeholder:text-border-strong outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start w-full">
              <div className="flex items-center justify-between w-full">
                <label htmlFor="password" className="font-['Inter'] font-medium text-xs text-ink-muted">
                  Password
                </label>
                <span className="font-['Inter'] font-medium text-xs text-accent">Forgot Password?</span>
              </div>
              <div className="flex items-center gap-2 border-b border-border-strong pb-[5px] w-full">
                <Lock className="w-4 h-4 text-border-strong" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 font-['Inter'] text-base text-ink placeholder:text-border-strong outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-border-strong"
                >
                  {showPassword ? <EyeOff className="w-[22px] h-[15px]" /> : <Eye className="w-[22px] h-[15px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded bg-accent drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] font-['Inter'] font-semibold text-sm text-center text-white tracking-[0.7px] disabled:opacity-60"
            >
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
          </div>

          <div className="w-full border-t border-border pt-6 text-center">
            <span className="font-['Inter'] text-base text-ink-muted">New here? </span>
            <Link to="/signup" className="font-['Inter'] text-base text-accent underline decoration-accent/30">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
