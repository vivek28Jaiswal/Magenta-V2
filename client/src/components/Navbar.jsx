import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { 
  User, 
  CaretDown, 
  Lightning, 
  BookmarkSimple, 
  Gear, 
  SignOut,
  Compass
} from '@phosphor-icons/react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const scrollToSection = (e, sectionId) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (sectionId === 'application-clarity') {
          setTimeout(() => {
            const ta = el.querySelector('textarea');
            if (ta) ta.focus();
          }, 350);
        }
      }
    }
  };

  const isClarityActive = location.pathname.startsWith('/application');
  const isJobsActive = location.pathname.startsWith('/jobs');

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0908]/90 backdrop-blur-md border-b border-white/10 transition">
      <div className="w-full px-4 sm:px-6 lg:px-[40px] pt-4 sm:pt-6 lg:pt-[32px] pb-4 grid grid-cols-12 gap-6 items-center">
        {/* Brand Left: Transparent Logo ONLY (Far Left) */}
        <div className="col-span-6 sm:col-span-3 lg:col-span-2 flex items-center">
          <Link to="/" className="flex items-center group py-0.5" title="Home">
            <img
              src="/LogoTransparent.png"
              alt="Logo"
              className="h-7 sm:h-8 w-auto object-contain transition group-hover:opacity-90"
            />
          </Link>
        </div>

        {/* Navigation Links (Middle / Center) - ONE UNIFIED HOMEPAGE HERO STYLE EVERYWHERE */}
        <nav className="hidden lg:flex col-span-7 items-center justify-center space-x-8 text-[14px] font-medium text-stone-300">
          <a
            href="/#how-it-works"
            onClick={(e) => scrollToSection(e, 'how-it-works')}
            className="hover:text-white transition"
          >
            How it Works
          </a>

          <Link
            to="/application"
            onClick={(e) => {
              if (location.pathname === '/') {
                scrollToSection(e, 'application-clarity');
              }
            }}
            className={`transition ${
              isClarityActive
                ? 'text-white font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Application Clarity
          </Link>

          <Link
            to="/jobs"
            className={`transition ${
              isJobsActive
                ? 'text-white font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Discover Jobs
          </Link>

          <a
            href="/#inspection-dossier"
            onClick={(e) => scrollToSection(e, 'inspection-dossier')}
            className="hover:text-white transition"
          >
            Evidence Policy
          </a>
        </nav>

        {/* Right Action: Minimal User Account or Sign In (Far Right) */}
        <div className="col-span-6 sm:col-span-9 lg:col-span-3 flex items-center justify-end space-x-3 text-[13px]">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1 text-stone-300 hover:text-white transition cursor-pointer select-none group"
                aria-expanded={dropdownOpen}
                title={user?.name || 'Account'}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 text-stone-200 group-hover:text-white flex items-center justify-center transition">
                  <User className="w-4 h-4" weight="bold" />
                </div>
                <span className="hidden sm:inline text-[13px] font-medium text-stone-300 group-hover:text-white transition max-w-[130px] truncate">
                  {user?.name || 'Account'}
                </span>
                <CaretDown
                  className={`w-3 h-3 text-stone-500 group-hover:text-stone-300 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                  weight="bold"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#141210] border border-white/15 rounded-[4px] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-[13px]">
                  <div className="px-4 py-2.5 border-b border-white/10 bg-white/5">
                    <p className="font-bold text-white tracking-tight truncate">
                      {user?.name || 'Verified Candidate'}
                    </p>
                    <p className="text-[11px] text-stone-400 truncate mt-0.5 font-mono">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <Lightning className="w-4 h-4 text-[#FF4124]" weight="fill" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/application"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <Lightning className="w-4 h-4 text-[#FF4124]" weight="fill" />
                      <span>Application Clarity Studio</span>
                    </Link>

                    <Link
                      to="/jobs"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <Compass className="w-4 h-4 text-stone-400" weight="regular" />
                      <span>Discover Jobs</span>
                    </Link>

                    <Link
                      to="/saved"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <BookmarkSimple className="w-4 h-4 text-stone-400" weight="regular" />
                      <span>Saved Jobs Pipeline</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <User className="w-4 h-4 text-stone-400" weight="regular" />
                      <span>Profile & Resume</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <Gear className="w-4 h-4 text-stone-400" weight="regular" />
                      <span>Settings & Privacy</span>
                    </Link>
                  </div>

                  <div className="border-t border-white/10 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer text-left font-medium"
                    >
                      <SignOut className="w-4 h-4 text-stone-400" weight="regular" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-stone-300 hover:text-white transition font-medium"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button
                  variant="default"
                  size="xs"
                  className="rounded-[4px] text-[13px] px-3.5 py-1.5 font-bold shadow-md"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
