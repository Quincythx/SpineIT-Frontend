import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, KeyRound, User, AtSign, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USE_MOCKS } from '../services/api';

type Step = 'email' | 'code' | 'name' | 'password';

function suggestUsername(fullName: string): string {
  return fullName.trim().toLowerCase().replace(/\s+/g, '_');
}

export function SignupPage() {
  const { sendVerificationCode, verifyCode, verifyCodeAndRegister } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    if (!usernameTouched) setUsername(suggestUsername(value));
  };

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await sendVerificationCode(email);
      setStep('code');
    } catch {
      setError('Could not send a verification code to that email. Please check it and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await verifyCode(email, code);
      setStep('name');
    } catch {
      setError('That code didn\'t match. Please check it and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueFromName = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Please choose a username.');
      return;
    }
    setStep('password');
  };

  const handleCompleteSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords don\'t match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await verifyCodeAndRegister({ email, code, username: username.trim(), password });
      navigate('/');
    } catch {
      setError('Could not create your account. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
    email: { title: 'Join SpineIt', subtitle: 'Where readers talk books.' },
    code: { title: 'Check Your Inbox', subtitle: `We sent a 6-digit code to ${email}.` },
    name: { title: 'What should we call you?', subtitle: 'This is how other readers will find you.' },
    password: { title: 'Secure your account', subtitle: 'At least 8 characters, like a good short story.' },
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <form
        onSubmit={
          step === 'email'
            ? handleSendCode
            : step === 'code'
              ? handleVerifyCode
              : step === 'name'
                ? handleContinueFromName
                : handleCompleteSignup
        }
        className="flex flex-col gap-8 items-center w-full max-w-[400px]"
      >
        <div className="flex flex-col gap-1 items-center w-full">
          <BookOpen className="w-9 h-9 text-accent" />
          <h1 className="font-['Inter'] font-bold text-2xl text-ink text-center pt-2">{STEP_COPY[step].title}</h1>
          <p className="font-['Inter'] text-sm text-ink-muted text-center">{STEP_COPY[step].subtitle}</p>
          {step === 'code' && USE_MOCKS && (
            <p className="font-['Inter'] text-xs text-[#6a4800] bg-[rgba(254,179,0,0.15)] border border-[rgba(254,179,0,0.4)] rounded px-3 py-2 mt-1">
              Demo mode — use code <strong>000000</strong>.
            </p>
          )}
        </div>

        {error && (
          <p className="w-full text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
        )}

        {step === 'email' && (
          <div className="flex flex-col gap-4 items-start w-full">
            <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
              <Mail className="w-4 h-4 text-ink-muted shrink-0" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@spineit.com"
                className="flex-1 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none bg-transparent min-w-0"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-accent font-['Inter'] font-bold text-sm text-center text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Sending Code…' : 'Continue'}
            </button>
          </div>
        )}

        {step === 'code' && (
          <div className="flex flex-col gap-4 items-start w-full">
            <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
              <KeyRound className="w-4 h-4 text-ink-muted shrink-0" />
              <input
                type="text"
                inputMode="numeric"
                required
                autoFocus
                minLength={6}
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="flex-1 font-['Inter'] text-base tracking-[0.3em] text-ink placeholder:text-ink-muted placeholder:tracking-[0.3em] outline-none bg-transparent min-w-0"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-accent font-['Inter'] font-bold text-sm text-center text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Verifying…' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full font-['Inter'] text-sm text-accent hover:underline text-center"
            >
              Use a different email
            </button>
          </div>
        )}

        {step === 'name' && (
          <div className="flex flex-col gap-4 items-start w-full">
            <div className="flex flex-col gap-1 items-start w-full">
              <label htmlFor="fullName" className="font-['Inter'] font-medium text-xs text-ink-muted">
                Full Name
              </label>
              <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
                <User className="w-4 h-4 text-ink-muted shrink-0" />
                <input
                  id="fullName"
                  type="text"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  placeholder="Jane Austen"
                  className="flex-1 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none bg-transparent min-w-0"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 items-start w-full">
              <label htmlFor="username" className="font-['Inter'] font-medium text-xs text-ink-muted">
                Username
              </label>
              <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
                <AtSign className="w-4 h-4 text-ink-muted shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameTouched(true);
                  }}
                  placeholder="jane_austen"
                  className="flex-1 font-['Inter'] text-base text-ink placeholder:text-ink-muted outline-none bg-transparent min-w-0"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-accent font-['Inter'] font-bold text-sm text-center text-white"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'password' && (
          <div className="flex flex-col gap-4 items-start w-full">
            <div className="flex flex-col gap-1 items-start w-full">
              <label htmlFor="signupPassword" className="font-['Inter'] font-medium text-xs text-ink-muted">
                Password
              </label>
              <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
                <Lock className="w-4 h-4 text-ink-muted shrink-0" />
                <input
                  id="signupPassword"
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
              <label htmlFor="confirmPassword" className="font-['Inter'] font-medium text-xs text-ink-muted">
                Confirm Password
              </label>
              <div className="flex items-center gap-2 border border-border-strong rounded px-3 py-3 w-full focus-within:border-accent">
                <Lock className="w-4 h-4 text-ink-muted shrink-0" />
                <input
                  id="confirmPassword"
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
              {isSubmitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </div>
        )}

        <p className="font-['Inter'] text-sm text-ink-muted text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
