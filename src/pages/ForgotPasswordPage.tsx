import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail } from 'lucide-react';
import { api } from '../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await api.requestPasswordReset(email);
      setSent(true);
    } catch {
      setError('Could not find an account with that email. Please check it and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="flex flex-col gap-8 items-center w-full max-w-[400px]">
        <div className="flex flex-col gap-1 items-center w-full">
          <BookOpen className="w-9 h-9 text-accent" />
          <h1 className="font-['Inter'] font-bold text-2xl text-ink text-center pt-2">Reset your password</h1>
          <p className="font-['Inter'] text-sm text-ink-muted text-center">
            {sent
              ? `If an account exists for ${email}, we've sent a link to reset your password.`
              : 'Enter your email and we\'ll send you a link to reset it.'}
          </p>
        </div>

        {sent ? (
          <Link
            to="/login"
            className="w-full py-3 rounded-full bg-accent font-['Inter'] font-bold text-sm text-center text-white"
          >
            Back to Log In
          </Link>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-start w-full">
            {error && (
              <p className="w-full text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
            )}
            <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
              <Mail className="w-4 h-4 text-ink-muted shrink-0" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@spineit.com"
                className="flex-1 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none bg-transparent min-w-0"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-accent font-['Inter'] font-bold text-sm text-center text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="font-['Inter'] text-sm text-ink-muted text-center">
          Remembered your password?{' '}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
