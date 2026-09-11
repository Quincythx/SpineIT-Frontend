import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Lock, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get('uid') ?? '';
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords don\'t match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.confirmPasswordReset({ uid, token, new_password: password });
      navigate('/login');
    } catch {
      setError('This reset link is invalid or has expired. Please request a new one.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!uid || !token) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="flex flex-col gap-4 items-center w-full max-w-[400px] text-center">
          <BookOpen className="w-9 h-9 text-accent" />
          <h1 className="font-['Inter'] font-bold text-2xl text-ink">Invalid reset link</h1>
          <p className="font-['Inter'] text-sm text-ink-muted">
            This link is missing some information. Please request a new password reset.
          </p>
          <Link
            to="/forgot-password"
            className="w-full py-3 rounded-full bg-accent font-['Inter'] font-bold text-sm text-center text-white"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center w-full max-w-[400px]">
        <div className="flex flex-col gap-1 items-center w-full">
          <BookOpen className="w-9 h-9 text-accent" />
          <h1 className="font-['Inter'] font-bold text-2xl text-ink text-center pt-2">Choose a new password</h1>
          <p className="font-['Inter'] text-sm text-ink-muted text-center">At least 8 characters.</p>
        </div>

        {error && (
          <p className="w-full text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
        )}

        <div className="flex flex-col gap-4 items-start w-full">
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="newPassword" className="font-['Inter'] font-medium text-xs text-ink-muted">
              New Password
            </label>
            <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
              <Lock className="w-4 h-4 text-ink-muted shrink-0" />
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                minLength={8}
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
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="confirmNewPassword" className="font-['Inter'] font-medium text-xs text-ink-muted">
              Confirm New Password
            </label>
            <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
              <Lock className="w-4 h-4 text-ink-muted shrink-0" />
              <input
                id="confirmNewPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none bg-transparent min-w-0"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-accent font-['Inter'] font-bold text-sm text-center text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
