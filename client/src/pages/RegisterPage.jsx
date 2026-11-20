import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import toast from 'react-hot-toast';
import { 
  UserPlus, 
  User, 
  EnvelopeSimple, 
  LockSimple, 
  Eye, 
  EyeSlash 
} from '@phosphor-icons/react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('All fields are required.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      toast.success('Account created! Welcome to Magenta.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-stone-100">
      <div className="text-center space-y-1">
        <h2 className="text-[24px] font-bold text-white tracking-tight">
          Create Account
        </h2>
        <p className="text-[14px] text-stone-400">
          Deterministic career intelligence and application clarity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-bold text-stone-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" weight="regular" />
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Elena Rostova"
              className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-stone-500 text-[14px] h-11 rounded-[4px]"
            />
          </div>
        </div>

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
              placeholder="elena@example.com"
              className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-stone-500 text-[14px] h-11 rounded-[4px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-stone-300 mb-1.5">
            Password (min. 6 characters)
          </label>
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

          {/* Strength Indicator */}
          {password && (
            <div className="mt-2 flex items-center space-x-1.5">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`h-1.5 flex-1 rounded-[2px] transition-colors ${
                    strength >= bar
                      ? strength >= 3
                        ? 'bg-white'
                        : 'bg-[#FF4124]'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={loading}
          icon={UserPlus}
          className="w-full text-[15px] font-bold mt-2 rounded-[4px] shadow-lg"
        >
          Create Account
        </Button>
      </form>

      <div className="pt-2 text-center text-[14px] text-stone-400">
        <span>Already have an account? </span>
        <Link to="/login" className="font-bold text-[#FF4124] underline hover:opacity-90 ml-1">
          Sign In
        </Link>
      </div>
    </div>
  );
}
