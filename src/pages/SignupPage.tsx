import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USE_MOCKS } from '../services/api';
import signupBg from '../assets/auth/signup-bg.jpg';

export function SignupPage() {
  const { sendVerificationCode, verifyCodeAndRegister } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'details' | 'code'>('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const username = fullName.trim().toLowerCase().replace(/\s+/g, '_');

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

  const handleCompleteSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await verifyCodeAndRegister({ email, code, username, password });
      navigate('/');
    } catch {
      setError('That code didn\'t match, or your details need a second look. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-stretch min-h-screen bg-[#fcf9f8]">
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img src={signupBg} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[rgba(0,70,74,0.1)] mix-blend-multiply" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-16">
        <form
          onSubmit={step === 'details' ? handleSendCode : handleCompleteSignup}
          className="flex flex-col items-center w-full max-w-[448px]"
        >
          <div className="flex items-center gap-2 pb-12">
            <BookOpen className="w-7 h-5 text-[#00464a]" />
            <span className="font-['Playfair_Display'] font-bold text-2xl text-[#00464a]">SpineIt</span>
          </div>

          <div className="flex flex-col gap-12 items-start w-full">
            <div className="flex flex-col gap-3 items-center w-full">
              <h1 className="font-['Playfair_Display'] font-bold text-[32px] leading-10 text-[#1c1b1b] text-center">
                {step === 'details' ? 'Join the Sanctuary' : 'Check Your Inbox'}
              </h1>
              <p className="font-['Inter'] text-base text-[#3f4949] text-center">
                {step === 'details'
                  ? 'Step into your digital reading nook.'
                  : `We sent a 6-digit code to ${email}.`}
              </p>
              {step === 'code' && USE_MOCKS && (
                <p className="font-['Inter'] text-xs text-[#6a4800] bg-[rgba(254,179,0,0.15)] border border-[rgba(254,179,0,0.4)] rounded px-3 py-2">
                  Demo mode — use code <strong>000000</strong>.
                </p>
              )}
            </div>

            {error && (
              <p className="w-full text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
            )}

            {step === 'details' ? (
              <div className="flex flex-col gap-6 items-start w-full">
                <div className="flex flex-col gap-1 items-start w-full">
                  <label htmlFor="fullName" className="font-['Inter'] font-medium text-xs text-[#3f4949]">
                    Full Name
                  </label>
                  <div className="relative w-full">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Austen"
                      className="w-full pl-12 pr-3 py-3.5 font-['Inter'] text-base text-[#1c1b1b] placeholder:text-[#6b7280] border border-[#e5e2e1] rounded outline-none focus:border-[#00464a]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 items-start w-full">
                  <label htmlFor="signupEmail" className="font-['Inter'] font-medium text-xs text-[#3f4949]">
                    Email Address
                  </label>
                  <div className="relative w-full">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-4 text-[#6b7280]" />
                    <input
                      id="signupEmail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@library.com"
                      className="w-full pl-12 pr-3 py-3.5 font-['Inter'] text-base text-[#1c1b1b] placeholder:text-[#6b7280] border border-[#e5e2e1] rounded outline-none focus:border-[#00464a]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 items-start w-full">
                  <label htmlFor="signupPassword" className="font-['Inter'] font-medium text-xs text-[#3f4949]">
                    Password
                  </label>
                  <div className="relative w-full">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-[21px] text-[#6b7280]" />
                    <input
                      id="signupPassword"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-3 py-3.5 font-['Inter'] text-base text-[#1c1b1b] placeholder:text-[#6b7280] border border-[#e5e2e1] rounded outline-none focus:border-[#00464a]"
                    />
                  </div>
                  <p className="pl-2 pt-1 font-['Inter'] font-medium text-xs text-[#6f7979]">
                    At least 8 characters, like a good short story.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 rounded bg-[#00464a] drop-shadow-[0px_4px_7px_rgba(0,70,74,0.3)] font-['Inter'] font-semibold text-sm text-center text-white tracking-[0.7px] disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending Code…' : 'Continue'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 items-start w-full">
                <div className="flex flex-col gap-1 items-start w-full">
                  <label htmlFor="signupCode" className="font-['Inter'] font-medium text-xs text-[#3f4949]">
                    Verification Code
                  </label>
                  <div className="relative w-full">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                    <input
                      id="signupCode"
                      type="text"
                      inputMode="numeric"
                      required
                      minLength={6}
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full pl-12 pr-3 py-3.5 font-['Inter'] text-base tracking-[0.3em] text-[#1c1b1b] placeholder:text-[#6b7280] placeholder:tracking-[0.3em] border border-[#e5e2e1] rounded outline-none focus:border-[#00464a]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 rounded bg-[#00464a] drop-shadow-[0px_4px_7px_rgba(0,70,74,0.3)] font-['Inter'] font-semibold text-sm text-center text-white tracking-[0.7px] disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating Account…' : 'Join the Sanctuary'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full font-['Inter'] text-sm text-[#00464a] underline text-center"
                >
                  Use a different email
                </button>
              </div>
            )}

            <div className="w-full border-t border-[#bec8c9] pt-6 text-center">
              <span className="font-['Inter'] text-sm text-[#3f4949]">Already have an account? </span>
              <Link to="/login" className="font-['Inter'] text-sm text-[#00464a] underline">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
