import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { resumeService } from '../services/resumeService';
import { applicationService } from '../services/applicationService';
import { Button } from '../components/ui/button';
import BayerDitherBackground from '../components/BayerDitherBackground';
import toast from 'react-hot-toast';
import {
  Sparkle,
  CheckCircle,
  Warning,
  FileText,
  UploadSimple,
  ArrowRight,
  ShieldCheck,
  Percent,
  Check,
  Copy,
  ArrowSquareOut,
  BookmarkSimple,
  Lightning,
  User,
  CaretDown,
  SignOut,
  Gear
} from '@phosphor-icons/react';

const SAMPLE_LINEAR_JD = `Role: Senior Frontend Engineer — Design Systems
Company: Linear
Location: Remote (US / EU)

About Linear:
Linear is the issue tracking tool built for high-performance software teams. We build software that is fast, intuitive, and beautiful. We believe professional tools should be as finely crafted as the products they build.

The Role:
We are seeking an exceptional Senior Frontend Engineer to lead our Design Systems architecture. You will define core primitives, micro-interactions, layout engines, and cross-platform component libraries powering Linear's web and desktop applications.

Key Responsibilities:
- Design, scale, and maintain our enterprise design system and frontend presentation architectures in React and TypeScript.
- Architect high-performance UI rendering pipelines with low-level 2D Canvas and WebAssembly.
- Individual contributor position requiring 100% hands-on code output with no managerial burden.
- Direct line management, OKR ownership, and quarterly performance reviews for 6 junior engineers.
- Collaborate with product designers and core engine engineers to eliminate latency and deliver sub-50ms interaction response times.

Requirements & Qualifications:
- 10+ years designing enterprise presentation architectures in React & TypeScript.
- Production experience with WebAssembly or low-level 2D Canvas rendering.
- Deep expertise in accessibility (WCAG AAA), keyboard navigation workflows, and render-tree profiling.
- Track record of shipping high-density, performance-critical user interfaces.`;

const MARQUEE_BRANDS = [
  'LINEAR',
  'FIGMA',
  'VERCEL',
  'STRIPE',
  'NOTION',
  'SUPABASE',
  'OPENAI',
  'RAYCAST',
  'GITHUB',
  'SCALE AI'
];

const SAMPLE_JOBS = [

  {
    id: 'figma-1',
    company: 'Figma',
    logo: 'F',
    logoBg: 'bg-white/10 text-white border border-white/15',
    title: 'Staff Design Engineer',
    location: 'Remote',
    alignment: 'Strong overlap on Canvas rendering, design tokens, and state synchronization.',
    tags: ['Design Systems', 'TypeScript', 'WebGL'],
    time: '2d ago',
    prefill: {
      title: 'Staff Design Engineer',
      company: 'Figma',
      location: 'Remote',
      workMode: 'remote',
      description: `Role: Staff Design Engineer\nCompany: Figma\nLocation: Remote\n\nWe are looking for a Staff Design Engineer to bridge design and engineering on Figma's core editor. You will push the boundaries of WebGL rendering, design token architecture, and real-time multiplayer Canvas synchronization.\n\nRequirements:\n- 8+ years experience in frontend engineering and design systems\n- Advanced TypeScript and Canvas/WebGL rendering pipelines\n- Deep understanding of state synchronization in collaborative applications.`
    }
  },
  {
    id: 'vercel-1',
    company: 'Vercel',
    logo: '▲',
    logoBg: 'bg-white/10 text-white border border-white/15',
    title: 'Senior Frontend Architect',
    location: 'Remote',
    alignment: 'Verified Next.js app-router and streaming SSR citations align with Edge criteria.',
    tags: ['Next.js', 'Edge SSR', 'Turbopack'],
    time: '8h ago',
    prefill: {
      title: 'Senior Frontend Architect',
      company: 'Vercel',
      location: 'Remote',
      workMode: 'remote',
      description: `Role: Senior Frontend Architect\nCompany: Vercel\nLocation: Remote\n\nAs a Senior Frontend Architect at Vercel, you will guide the evolution of Next.js primitives and edge streaming architectures across enterprise workloads.\n\nRequirements:\n- 10+ years engineering high-traffic web architectures\n- Proven leadership in Next.js, React Server Components, and Edge Runtime.`
    }
  },
  {
    id: 'stripe-1',
    company: 'Stripe',
    logo: 'S',
    logoBg: 'bg-white/10 text-white border border-white/15',
    title: 'Staff Systems Engineer',
    location: 'Remote',
    alignment: 'Verified multi-tenant architecture aligns with core compliance engine.',
    tags: ['React', 'Distributed Systems', 'Security'],
    time: 'Just now',
    prefill: {
      title: 'Staff Product Systems Engineer',
      company: 'Stripe',
      location: 'Remote',
      workMode: 'remote',
      description: `Role: Staff Product Systems Engineer\nCompany: Stripe\nLocation: Remote\n\nStripe powers internet commerce. We need an experienced Staff Engineer to scale global dashboard microfrontends handling billions in monthly transactions.\n\nRequirements:\n- 9+ years web platform engineering\n- Deep experience with strict multi-tenant security and zero-downtime deployments.`
    }
  }
];

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [inputMode, setInputMode] = useState('paste'); // 'paste' | 'url'
  const [jobInput, setJobInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [activeResumeName, setActiveResumeName] = useState('Elena_Rostova_StaffEng_2025.pdf');
  const [copiedScript, setCopiedScript] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToClarity = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('application-clarity');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const ta = el.querySelector('textarea');
        if (ta) ta.focus();
      }, 350);
    }
  };

  useEffect(() => {
    if (window.location.hash === '#application-clarity') {
      setTimeout(() => scrollToClarity(), 200);
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchCandidateResume = async () => {
      if (isAuthenticated) {
        try {
          const res = await resumeService.getLatestResume();
          if (res?.resume?.metadata?.originalFilename) {
            setActiveResumeName(res.resume.metadata.originalFilename);
          }
        } catch (e) {
          // Keep default fallback
        }
      }
    };
    fetchCandidateResume();
  }, [isAuthenticated]);

  const handleLoadLinearSample = () => {
    setInputMode('paste');
    setJobInput(SAMPLE_LINEAR_JD);
    toast.success('Loaded Linear Senior Frontend Engineer JD');
  };

  const handleInspectSample = () => {
    const el = document.getElementById('inspection-dossier');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalyse = async () => {
    let textToAnalyze = jobInput;
    let originalUrl = undefined;

    if (inputMode === 'url') {
      if (!urlInput.trim()) {
        toast.error('Please enter a job posting URL.');
        return;
      }
      originalUrl = urlInput.trim();

      if (!jobInput.trim()) {
        try {
          setAnalyzing(true);
          toast.loading('Fetching job description from URL...', { id: 'clarity' });
          const res = await applicationService.extractJobFromUrl(originalUrl);
          if (res.success && res.job) {
            textToAnalyze = res.job.description;
            setJobInput(res.job.description);
          }
        } catch (err) {
          const msg = err.response?.data?.message || 'Could not load job from URL. Please copy and paste the job description text directly.';
          toast.error(msg, { id: 'clarity', duration: 6000 });
          setInputMode('paste');
          setAnalyzing(false);
          return;
        }
      } else {
        textToAnalyze = jobInput;
      }
    }

    if (!textToAnalyze || textToAnalyze.trim().length < 50) {
      toast.error('Please provide a complete job description (at least 50 characters).');
      return;
    }

    if (!isAuthenticated) {
      sessionStorage.setItem('pending_jd', textToAnalyze);
      toast('Please sign in to analyze with your verified resume matrix.');
      navigate('/login', { state: { from: '/' } });
      return;
    }

    try {
      setAnalyzing(true);
      toast.loading('Auditing job requirements against your verified resume matrix...', { id: 'clarity' });

      const payload = {
        jobDescription: textToAnalyze.trim(),
        originalUrl: originalUrl || (inputMode === 'url' ? urlInput : undefined),
      };

      const result = await applicationService.analyzeApplication(payload);
      toast.success('Clarity diagnostic audit complete!', { id: 'clarity' });
      navigate(`/application/${result._id || result.id}`);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to complete clarity analysis. Please retry.';
      toast.error(errMsg, { id: 'clarity', duration: 5000 });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyScript = () => {
    const script = `I noticed the role is framed as an individual contributor with 100% hands-on code output, but also specifies direct line management of 6 engineers. Could you clarify whether this position carries direct people management responsibilities?`;
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    toast.success('Question copied to clipboard');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const toggleBookmark = (id) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast('Job removed from saved');
      } else {
        next.add(id);
        toast.success('Job saved');
      }
      return next;
    });
  };

  const handleCheckClarityJob = (job) => {
    navigate('/application', {
      state: {
        prefill: job.prefill
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-stone-100 font-['PP_Neue_Montreal',_'General_Sans',_sans-serif] antialiased selection:bg-[#FF4124]/30 selection:text-white">
      {/* =========================================================================
          1. IMMERSIVE FULL-SCREEN CINEMATIC HERO SECTION (12-Column Grid Aligned)
          Full-width, 40px desktop padding, 24px gutter, wide JD input span
         ========================================================================= */}
      <section id="application-clarity" className="relative min-h-[calc(100vh-88px)] flex flex-col justify-between overflow-hidden bg-[#0A0908] text-white scroll-mt-20">
        {/* Interactive Bayer Dithering WebGL Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <BayerDitherBackground
            color="#E05A38"
            pixelSize={4}
            shape="square"
            className="opacity-80"
          />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0908] via-[#0A0908]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/85 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#0A0908]/20 to-[#0C0B0A]/80 pointer-events-none" />
        </div>

        {/* Hero Central Grid Content: 12-Column Grid with intentional column spans */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-[40px] pt-12 sm:pt-16 pb-12 flex-1 flex flex-col justify-center">
          <div className="w-full grid grid-cols-12 gap-6 items-center">
            {/* Headline and Supporting Text: Deliberately positioned in columns 2 to 11 */}
            <div className="col-span-12 lg:col-start-2 lg:col-span-10 xl:col-start-3 xl:col-span-8 text-center flex flex-col items-center">
              <h1 className="text-[38px] sm:text-[54px] md:text-[66px] font-bold tracking-tight text-white leading-[1.02] sm:leading-[1.0]">
                Understand the job <br className="hidden sm:inline" />
                before you apply.
              </h1>

              <p className="mt-4 text-[16px] sm:text-[18px] text-stone-300 font-normal leading-snug max-w-2xl">
                Compare job expectations with your resume. Discover what's relevant, what's missing and what needs clarification.
              </p>
            </div>

            {/* Central Interactive Console: Prominent Wide Grid Span across 10-12 columns */}
            <div className="col-span-12 lg:col-start-2 lg:col-span-10 xl:col-start-2 xl:col-span-10 mt-2">
              <div className="w-full bg-[#121110]/95 backdrop-blur-2xl rounded-[4px] border border-white/15 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] text-left transition focus-within:border-white/25 overflow-hidden">
                {/* Input Header Tabs */}
                <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-[12px]">
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setInputMode('paste')}
                      className={`px-3.5 py-1.5 rounded-[4px] font-medium transition cursor-pointer text-[12px] ${
                        inputMode === 'paste'
                          ? 'bg-white/15 text-white font-semibold'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Paste JD
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('url')}
                      className={`px-3.5 py-1.5 rounded-[4px] font-medium transition cursor-pointer text-[12px] ${
                        inputMode === 'url'
                          ? 'bg-white/15 text-white font-semibold'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Import URL
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleLoadLinearSample}
                    className="inline-flex items-center space-x-1.5 text-[12px] text-[#FF4124] hover:text-[#ff5a42] font-semibold transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" weight="bold" />
                    <span>Linear Sample</span>
                  </button>
                </div>

                {/* Input Body: Fixed consistent height (135px) for zero tab jump */}
                <div className="p-4 sm:p-5 h-[135px] flex flex-col justify-start">
                  {inputMode === 'paste' ? (
                    <textarea
                      value={jobInput}
                      onChange={(e) => setJobInput(e.target.value)}
                      placeholder="Paste a job description here..."
                      className="w-full h-full text-[15px] sm:text-[16px] text-stone-100 placeholder:text-stone-500 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none leading-relaxed font-sans"
                    />
                  ) : (
                    <div className="h-full flex flex-col justify-center space-y-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAnalyse();
                          }
                        }}
                        placeholder="e.g. https://jobs.lever.co/linear/... or direct job link"
                        className="w-full text-[13px] px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-[4px] focus:border-[#FF4124] focus:outline-none placeholder:text-stone-500 font-mono"
                      />
                      <p className="text-[11px] text-stone-400">
                        Paste any public posting URL. For login-protected sites (Naukri, LinkedIn), paste the text directly into Paste JD.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Controls Bar Inside Input Box */}
                <div className="px-4 py-3 bg-white/[0.03] border-t border-white/10 flex items-center justify-between gap-3 text-[13px]">
                  {/* Left: Active Resume Indicator */}
                  <div className="flex items-center space-x-2 text-[12px] text-stone-400 truncate">
                    <span className="w-2 h-2 rounded-[2px] bg-[#FF4124] shrink-0 animate-pulse" />
                    <span className="truncate max-w-[200px] sm:max-w-[320px] text-stone-300 font-mono">
                      {activeResumeName}
                    </span>
                    <Link
                      to="/profile"
                      className="text-[#FF4124] hover:underline font-semibold text-[11px] ml-0.5"
                    >
                      Switch
                    </Link>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2.5 shrink-0">
                    <Button
                      variant="default"
                      size="default"
                      onClick={handleAnalyse}
                      loading={analyzing}
                      icon={Lightning}
                      iconPosition="right"
                      className="font-bold shadow-lg rounded-[4px] text-[13px] px-5 py-2"
                    >
                      {analyzing ? 'Auditing Matrix...' : 'Analyse with Magenta'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Understated Trust Elements: Small Rectangular Boxes (4px rounded) aligned to grid */}
            <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex flex-wrap items-center justify-center gap-2.5 text-[12px] text-stone-300 font-mono">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#141210]/90 border border-white/10 rounded-[4px] shadow-xs">
                <Check className="w-3.5 h-3.5 text-stone-300" weight="bold" />
                <span>Evidence-based</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#141210]/90 border border-white/10 rounded-[4px] shadow-xs">
                <Check className="w-3.5 h-3.5 text-stone-300" weight="bold" />
                <span>Zero fake scores</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#141210]/90 border border-white/10 rounded-[4px] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-300" weight="bold" />
                <span>Private & confidential</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infinite Moving Marquee Logo Strip across bottom horizon */}
        <div className="relative z-10 w-full py-6 border-t border-white/5 bg-[#0A0908]/75 backdrop-blur-xs overflow-hidden">
          {/* Subtle gradient edge masks for smooth cinematic fade-in/fade-out */}
          <div className="absolute left-0 inset-y-0 w-24 sm:w-36 bg-gradient-to-r from-[#0A0908] via-[#0A0908]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-24 sm:w-36 bg-gradient-to-l from-[#0A0908] via-[#0A0908]/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="flex animate-marquee items-center select-none">
            {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, idx) => (
              <div
                key={`${brand}-${idx}`}
                className="flex items-center space-x-6 sm:space-x-8 px-6 sm:px-8 shrink-0"
              >
                <span className="text-stone-400 hover:text-white text-[12px] sm:text-[13px] font-semibold tracking-widest uppercase font-mono opacity-50 hover:opacity-100 transition cursor-default">
                  {brand}
                </span>
                <span className="text-stone-700 select-none text-[8px]">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. BELOW-THE-FOLD SECTIONS (All aligned to 12-column grid, 40px padding)
         ========================================================================= */}
      <main className="bg-[#0C0B0A] text-stone-100">
        {/* 2A. VALUE PILLARS: WHY APPLICATION CLARITY MATTERS */}
        <section className="w-full px-4 sm:px-6 lg:px-[40px] py-20 border-t border-white/10">
          <div className="w-full grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-start-3 lg:col-span-8 text-center mb-10 space-y-2">
              <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight leading-tight">
                Clarity before commitment.
              </h2>
              <p className="text-[15px] sm:text-[16px] text-stone-400 max-w-md mx-auto leading-snug">
                Understand real expectations before you invest interview time.
              </p>
            </div>

            {/* Pillar 1: 4 columns */}
            <div className="col-span-12 md:col-span-4 bg-[#141210] rounded-[4px] p-6 border border-white/10 shadow-sm space-y-3 hover:border-white/20 transition">
              <div className="w-9 h-9 rounded-[4px] bg-white/5 text-stone-200 border border-white/15 flex items-center justify-center">
                <FileText className="w-4 h-4 text-stone-300" weight="regular" />
              </div>
              <h3 className="text-[17px] font-bold text-white tracking-tight">
                Verbatim Evidence
              </h3>
              <p className="text-[14px] text-stone-400 leading-relaxed">
                Every match links directly to actual bullet points in your resume. No fabricated skills.
              </p>
            </div>

            {/* Pillar 2: 4 columns */}
            <div className="col-span-12 md:col-span-4 bg-[#141210] rounded-[4px] p-6 border border-white/10 shadow-sm space-y-3 hover:border-white/20 transition">
              <div className="w-9 h-9 rounded-[4px] bg-white/5 text-stone-200 border border-white/15 flex items-center justify-center">
                <Percent className="w-4 h-4 text-stone-300" weight="bold" />
              </div>
              <h3 className="text-[17px] font-bold text-white tracking-tight">
                Zero Pseudo Scores
              </h3>
              <p className="text-[14px] text-stone-400 leading-relaxed">
                Clear evidence audits instead of meaningless 82% match probabilities.
              </p>
            </div>

            {/* Pillar 3: 4 columns */}
            <div className="col-span-12 md:col-span-4 bg-[#141210] rounded-[4px] p-6 border border-white/10 shadow-sm space-y-3 hover:border-white/20 transition">
              <div className="w-9 h-9 rounded-[4px] bg-[#FF4124]/10 text-[#FF4124] border border-[#FF4124]/25 flex items-center justify-center">
                <Warning className="w-4 h-4 text-[#FF4124]" weight="regular" />
              </div>
              <h3 className="text-[17px] font-bold text-white tracking-tight">
                Expose Contradictions
              </h3>
              <p className="text-[14px] text-stone-400 leading-relaxed">
                Spot conflicting demands—like IC roles requiring 6 direct reports—before your first call.
              </p>
            </div>
          </div>
        </section>

        {/* 2B. SYSTEM METHODOLOGY: HOW MAGENTA WORKS */}
        <section id="how-it-works" className="w-full px-4 sm:px-6 lg:px-[40px] py-20 border-t border-white/10 scroll-mt-20">
          <div className="w-full grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-start-3 lg:col-span-8 text-center mb-10 space-y-2">
              <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight leading-tight">
                Three steps to complete clarity.
              </h2>
              <p className="text-[15px] sm:text-[16px] text-stone-400 max-w-md mx-auto leading-snug">
                Verifiable evidence without guesswork.
              </p>
            </div>

            {/* Step 1: 4 columns */}
            <div className="col-span-12 md:col-span-4 bg-[#141210] rounded-[4px] p-6 border border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-white/20 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono font-bold text-stone-400">
                    01
                  </span>
                  <UploadSimple className="w-4 h-4 text-stone-400" weight="regular" />
                </div>
                <h3 className="text-[17px] font-bold text-white tracking-tight">
                  Upload Resume
                </h3>
                <p className="text-[14px] text-stone-400 leading-relaxed">
                  Upload your CV once. Magenta converts your experience into a verified evidence matrix.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center text-[13px] font-medium text-stone-300">
                <Check className="w-3.5 h-3.5 text-[#FF4124] mr-2 shrink-0" weight="bold" />
                <span>Extracts 40+ engineering facets</span>
              </div>
            </div>

            {/* Step 2: 4 columns */}
            <div className="col-span-12 md:col-span-4 bg-[#141210] rounded-[4px] p-6 border border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-white/20 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono font-bold text-stone-400">
                    02
                  </span>
                  <FileText className="w-4 h-4 text-stone-400" weight="regular" />
                </div>
                <h3 className="text-[17px] font-bold text-white tracking-tight">
                  Drop Any Job Description
                </h3>
                <p className="text-[14px] text-stone-400 leading-relaxed">
                  Paste any job listing. We separate core requirements from decorative bullet points.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center text-[13px] font-medium text-stone-300">
                <Check className="w-3.5 h-3.5 text-[#FF4124] mr-2 shrink-0" weight="bold" />
                <span>Parses explicit & implicit needs</span>
              </div>
            </div>

            {/* Step 3: 4 columns */}
            <div className="col-span-12 md:col-span-4 bg-[#141210] rounded-[4px] p-6 border border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-white/20 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono font-bold text-stone-400">
                    03
                  </span>
                  <Sparkle className="w-4 h-4 text-[#FF4124]" weight="fill" />
                </div>
                <h3 className="text-[17px] font-bold text-white tracking-tight">
                  Clarity Diagnostic
                </h3>
                <p className="text-[14px] text-stone-400 leading-relaxed">
                  Get exact verification quotes, audit gaps, and strategic screening questions.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center text-[13px] font-medium text-stone-300">
                <Check className="w-3.5 h-3.5 text-[#FF4124] mr-2 shrink-0" weight="bold" />
                <span>Screening script included</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2C. INSPECTION DOSSIER: REALISTIC PREVIEW (12-Column Master Showcase) */}
        <section id="inspection-dossier" className="w-full px-4 sm:px-6 lg:px-[40px] py-20 border-t border-white/10 scroll-mt-20">
          <div className="w-full grid grid-cols-12 gap-6">
            <div className="col-span-12 mb-2 space-y-1">
              <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight leading-tight">
                See what you get before you apply.
              </h2>
              <p className="text-[15px] sm:text-[16px] text-stone-400 leading-snug">
                Real diagnostic preview for Senior Frontend Engineer @ Linear.
              </p>
            </div>

            {/* Master Showcase Card: Spans full 12 columns */}
            <div className="col-span-12 bg-[#141210] border border-white/10 rounded-[4px] p-6 sm:p-8 shadow-xl space-y-6">
              {/* Header Row: Perfectly Centered Vertical Alignments */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-4">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-[4px] bg-white/10 border border-white/15 text-white flex items-center justify-center font-bold text-[15px] shrink-0">
                    L
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[17px] font-bold text-white tracking-tight leading-tight">
                        Senior Frontend Engineer — Design Systems
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-white/5 border border-white/10 text-stone-400">
                        Direct
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-white/5 border border-white/10 text-stone-400">
                        Remote ($210k)
                      </span>
                    </div>
                    <p className="text-[13px] text-stone-400 mt-1">
                      Candidate Profile: <span className="text-stone-300 font-medium">Elena Rostova</span> • Verified Experience
                    </p>
                  </div>
                </div>

                {/* Status Chips: Clean, Aligned, 4px rounded */}
                <div className="flex items-center space-x-2.5 text-[12px] font-mono shrink-0">
                  <span className="flex items-center text-stone-200 bg-white/5 border border-white/15 px-2.5 py-1 rounded-[4px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mr-2" />
                    VERIFIED: 11 of 14
                  </span>
                  <span className="flex items-center text-[#FF4124] bg-[#FF4124]/10 border border-[#FF4124]/30 px-2.5 py-1 rounded-[4px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4124] mr-2" />
                    CONTRADICTIONS: 1 Flagged
                  </span>
                </div>
              </div>

              {/* 2-Column Inspection Grid (Pixel-Perfect Bento Alignment) */}
              <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* Left Column (7 cols): Audit Items */}
                <div className="col-span-12 lg:col-span-7 min-w-0 flex flex-col">
                  {/* Column Header Bar */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 pb-1 font-mono uppercase tracking-wider h-5 mb-4">
                    <span>Requirement & Evidence Audit</span>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span className="flex items-center text-stone-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mr-1.5" />
                        Verified
                      </span>
                      <span className="flex items-center text-stone-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-500 mr-1.5" />
                        Partial
                      </span>
                      <span className="flex items-center text-[#FF4124]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4124] mr-1.5" />
                        Conflict
                      </span>
                    </div>
                  </div>

                  {/* 3 Audit Cards Stack */}
                  <div className="flex flex-col gap-4 flex-1">
                    {/* Audit Item 1: Verified */}
                    <div className="bg-[#1A1816] border border-white/10 rounded-[4px] p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-[4px] bg-white/10 text-stone-200 border border-white/20">
                          VERIFIED
                        </span>
                        <span className="text-[11px] font-mono text-stone-500">JD §1.2</span>
                      </div>
                      <div className="text-[14px] font-bold text-white break-words">
                        10+ years designing enterprise presentation architectures in React & TypeScript
                      </div>
                      <div className="bg-[#121110] border-l-2 border-stone-400 border border-white/5 rounded-[4px] p-3 text-[13px] text-stone-300 italic leading-relaxed break-words">
                        "Lead engineer for Salesforce Lightning Core spanning React, React Native, and Next.js applications, serving 4M engineers."
                      </div>
                    </div>

                    {/* Audit Item 2: Partial Evidence */}
                    <div className="bg-[#1A1816] border border-white/10 rounded-[4px] p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-[4px] bg-white/5 text-stone-400 border border-white/10">
                          PARTIAL EVIDENCE
                        </span>
                        <span className="text-[11px] font-mono text-stone-500">JD §2.4</span>
                      </div>
                      <div className="text-[14px] font-bold text-white break-words">
                        Production experience with WebAssembly or low-level 2D/Canvas rendering
                      </div>
                      <div className="bg-[#121110] border-l-2 border-stone-600 border border-white/5 rounded-[4px] p-3 text-[13px] text-stone-400 leading-relaxed break-words">
                        Resume documents Canvas SVG tooling and WebGL shaders, but lacks explicit Rust/Wasm citations.
                      </div>
                    </div>

                    {/* Audit Item 3: Contradiction */}
                    <div className="bg-[#1A1816] border border-[#FF4124]/40 rounded-[4px] p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-[4px] bg-[#FF4124]/10 text-[#FF4124] border border-[#FF4124]/30">
                          CONTRADICTION
                        </span>
                        <span className="text-[11px] font-mono text-stone-500">JD §1.1 vs §3.4</span>
                      </div>
                      <div className="text-[14px] font-bold text-white break-words">
                        Conflicting IC vs Management Requirement
                      </div>
                      <div className="bg-[#121110] border-l-2 border-[#FF4124] border border-white/5 rounded-[4px] p-3 text-[13px] text-stone-300 leading-relaxed break-words">
                        Listing states: <em>"100% hands-on code with no managerial burden"</em>, but Section 4 requires <em>"Direct line management of 6 junior engineers."</em>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (5 cols): Recruiter Screening Script (Bento Aligned) */}
                <div className="col-span-12 lg:col-span-5 min-w-0 flex flex-col">
                  {/* Matching Column Header Bar */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 pb-1 font-mono uppercase tracking-wider h-5 mb-4">
                    <span>Strategic Inquiry Protocol</span>
                    <span className="text-stone-500 font-mono text-[11px]">Direct Resolution</span>
                  </div>

                  {/* Right Cards Stack: Flexes to fill and match left column perfectly */}
                  <div className="flex flex-col gap-4 flex-1">
                    {/* Bento Card 1: Screening Question Box */}
                    <div className="bg-[#1A1816] border border-white/10 rounded-[4px] p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 font-mono">
                          <FileText className="w-4 h-4 text-[#FF4124]" weight="bold" />
                          <span>Screening Question</span>
                        </span>
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={handleCopyScript}
                          icon={copiedScript ? Check : Copy}
                          className="h-7 px-2.5 text-[12px] font-mono bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-[4px] shrink-0"
                        >
                          {copiedScript ? 'COPIED' : 'COPY'}
                        </Button>
                      </div>

                      <div className="bg-[#121110] border-l-2 border-[#FF4124] border border-white/5 rounded-[4px] p-4 text-[13px] text-stone-200 leading-relaxed italic break-words flex-1 flex items-center">
                        "I noticed the role is framed as an individual contributor with 100% hands-on code output, but also specifies direct line management of 6 engineers. Could you clarify whether this position carries direct people management responsibilities?"
                      </div>

                      <p className="text-[12px] text-stone-400">
                        Clarify this upfront to avoid spending interview time on misaligned positions.
                      </p>
                    </div>

                    {/* Bento Card 2: Analysis Integrity Checks */}
                    <div className="bg-[#1A1816] border border-white/10 rounded-[4px] p-5 space-y-3 shrink-0">
                      <div className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                        Analysis Integrity Checks
                      </div>
                      <ul className="space-y-2 text-[13px] text-stone-300">
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-stone-300 shrink-0" weight="bold" />
                          <span>Zero keyword stuffing or fake probability</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-stone-300 shrink-0" weight="bold" />
                          <span>Direct verbatim evidence cited from resume</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-stone-300 shrink-0" weight="bold" />
                          <span>Cross-referenced against verified CV</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2D. PERSONALIZED JOB DISCOVERY SHOWCASE (12-Column Grid Aligned) */}
        <section className="w-full px-4 sm:px-6 lg:px-[40px] py-20 border-t border-white/10">
          <div className="w-full grid grid-cols-12 gap-6">
            <div className="col-span-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
              <div>
                <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight">
                  Roles matched to verified evidence.
                </h2>
                <p className="text-[15px] sm:text-[16px] text-stone-400 mt-1">
                  Curated opportunities where your background matches requirements.
                </p>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center space-x-1.5 text-[13px] font-bold text-[#FF4124] hover:underline transition font-mono shrink-0"
              >
                <span>Explore All</span>
                <ArrowRight className="w-3.5 h-3.5" weight="bold" />
              </Link>
            </div>

            {/* 3 Job Cards: Each spans 4 columns on md+ */}
            {SAMPLE_JOBS.map((job) => {
              const isBookmarked = savedJobs.has(job.id);
              return (
                <div
                  key={job.id}
                  className="col-span-12 md:col-span-4 bg-[#141210] border border-white/10 rounded-[4px] p-6 shadow-sm flex flex-col justify-between hover:border-white/20 hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-[4px] ${job.logoBg} flex items-center justify-center font-bold text-[15px] shadow-xs`}>
                          {job.logo}
                        </div>
                        <div>
                          <h4 className="text-[16px] font-bold text-white tracking-tight leading-snug">
                            {job.title}
                          </h4>
                          <div className="text-[13px] text-stone-400">
                            {job.company} • {job.location}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(job.id)}
                        className="text-stone-400 hover:text-white transition p-1 cursor-pointer"
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
                      >
                        <BookmarkSimple className="w-5 h-5" weight={isBookmarked ? 'fill' : 'regular'} />
                      </button>
                    </div>

                    {/* Alignment Note: Clean, without bulky label */}
                    <div className="bg-[#1A1816] border border-white/10 rounded-[4px] p-3">
                      <p className="text-[13px] text-stone-300 leading-relaxed">
                        {job.alignment}
                      </p>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono bg-white/5 text-stone-300 px-2 py-0.5 rounded-[4px] border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[14px]">
                    <span className="text-[12px] text-stone-400 font-mono">
                      {job.time}
                    </span>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleCheckClarityJob(job)}
                      icon={ArrowSquareOut}
                      iconPosition="right"
                      className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-[4px]"
                    >
                      Check Clarity
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Explore Button: Full grid span */}
            <div className="col-span-12 text-center mt-6">
              <Link to="/jobs">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-[4px]"
                >
                  Explore all 240+ matched postings
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 2E. FINAL PRE-SUBMISSION CTA (12-Column Grid Aligned) */}
        <section className="w-full px-4 sm:px-6 lg:px-[40px] py-20 border-t border-white/10">
          <div className="w-full grid grid-cols-12 gap-6">
            <div className="col-span-12 bg-gradient-to-b from-[#181614] to-[#121110] border border-white/15 rounded-[4px] p-8 sm:p-14 shadow-2xl text-center space-y-4">
              <h2 className="text-[32px] sm:text-[40px] font-bold text-white tracking-tight leading-tight">
                Apply with clarity.
              </h2>

              <p className="text-[15px] sm:text-[16px] text-stone-300 max-w-md mx-auto leading-relaxed">
                Know where you stand before interviewers ask.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <Link to="/register">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full sm:w-auto font-bold shadow-lg rounded-[4px]"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={handleInspectSample}
                  className="text-[14px] text-stone-300 hover:text-white font-medium px-5 py-3 rounded-[4px] hover:bg-white/10 transition cursor-pointer"
                >
                  Explore How it Works
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-5 text-[12px] text-stone-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" weight="bold" />
                  <span>Private by default</span>
                </span>
                <span>•</span>
                <span>No credit card required</span>
                <span>•</span>
                <span>Instant deterministic audit</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          3. BESPOKE MINIMAL 4-COLUMN FOOTER (12-Column Grid Aligned)
          Desktop: 40px outer padding. Equal column distribution on 12-column grid.
         ========================================================================= */}
      <footer className="w-full border-t border-white/10 bg-[#0A0908] py-16 px-4 sm:px-6 lg:px-[40px] text-stone-300">
        <div className="w-full grid grid-cols-12 gap-6 sm:gap-8 text-[14px]">
          {/* Col 1: Brand Mark ONLY (5 cols on md+) */}
          <div className="col-span-12 md:col-span-5 space-y-3">
            <Link to="/" className="inline-block" title="Home">
              <img
                src="/LogoTransparent.png"
                alt="Logo"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-stone-400 leading-relaxed max-w-sm">
              Objective diagnostics and deterministic career intelligence for high-stakes engineering applications.
            </p>
          </div>

          {/* Col 2: Product (2 cols on md+) */}
          <div className="col-span-6 sm:col-span-4 md:col-span-2 space-y-3">
            <div className="font-mono text-[12px] font-bold text-white uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2 text-[13px] text-stone-400">
              <li>
                <a href="#how-it-works" className="hover:text-white transition">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/application" className="hover:text-white transition">
                  Application Clarity
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition">
                  Discover Jobs
                </Link>
              </li>
              <li>
                <a href="#inspection-dossier" className="hover:text-white transition">
                  Evidence Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Company (2 cols on md+) */}
          <div className="col-span-6 sm:col-span-4 md:col-span-2 space-y-3">
            <div className="font-mono text-[12px] font-bold text-white uppercase tracking-wider">
              Company
            </div>
            <ul className="space-y-2 text-[13px] text-stone-400">
              <li>
                <a href="#how-it-works" className="hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <span className="text-stone-600 cursor-not-allowed">
                  Careers
                </span>
              </li>
              <li>
                <span className="text-stone-600 cursor-not-allowed">
                  Editorial
                </span>
              </li>
              <li>
                <a href="mailto:contact@magenta.careers" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal (3 cols on md+) */}
          <div className="col-span-12 sm:col-span-4 md:col-span-3 space-y-3">
            <div className="font-mono text-[12px] font-bold text-white uppercase tracking-wider">
              Legal
            </div>
            <ul className="space-y-2 text-[13px] text-stone-400">
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Security Architecture
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Subprocessors
                </span>
              </li>
            </ul>
          </div>

          {/* Bottom Copyright & Certification (12 cols) */}
          <div className="col-span-12 pt-8 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-stone-400 font-mono">
            <div>
              © 2025 All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-stone-300 bg-white/5 px-3 py-1 rounded-[4px] border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-300" weight="regular" />
              <span>100% Deterministic Engine</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
