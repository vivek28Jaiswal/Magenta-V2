import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import toast from 'react-hot-toast';
import { 
  EnvelopeSimple, 
  LockSimple, 
  SignIn, 
  Sparkle,
  Eye,
  EyeSlash
} from '@phosphor-icons/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user?.name || 'Candidate'}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('vivek@example.com');
    setPassword('password123');
    toast.success('Demo credentials loaded');
  };

  return (
    <div className="space-y-6 text-stone-100">
      <div className="text-center space-y-1">
        <h2 className="text-[24px] font-bold text-white tracking-tight">
          Sign In
        </h2>
        <p className="text-[14px] text-stone-400">
          Access your verified resume matrix and clarity reports
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-bold text-stone-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeSimple className="w-5 h-5 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" weight="regular" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-stone-500 text-[14px] h-11 rounded-[4px]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[13px] font-bold text-stone-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => toast('Password reset instructions dispatched to your email.')}
              className="text-[12px] text-stone-400 hover:text-white underline cursor-pointer"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <LockSimple className="w-5 h-5 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" weight="regular" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-stone-500 text-[14px] h-11 rounded-[4px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={loading}
          icon={SignIn}
          className="w-full text-[15px] font-bold mt-2 rounded-[4px] shadow-lg"
        >
          Sign In
        </Button>
      </form>

      {/* Demo Credentials Quick Fill */}
      <div className="pt-2 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center space-x-2 text-[13px] text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-[4px] transition cursor-pointer"
        >
          <Sparkle className="w-4 h-4 text-[#FF4124]" weight="fill" />
          <span>Quick Fill Demo (vivek@example.com)</span>
        </button>
      </div>

      <div className="pt-2 text-center text-[14px] text-stone-400">
        <span>Don't have an account? </span>
        <Link to="/register" className="font-bold text-[#FF4124] underline hover:opacity-90 ml-1">
          Create an Account
        </Link>
      </div>
    </div>
  );
}
