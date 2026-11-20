import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import { resumeService } from '../services/resumeService';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/table';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { 
  Lightning, 
  CheckCircle, 
  FileText, 
  ArrowSquareOut, 
  Trash, 
  MagnifyingGlass, 
  ShieldCheck, 
  Check
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

export default function ApplicationClarityPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'history'
  const [inputMode, setInputMode] = useState('paste'); // 'paste' | 'url'
  const [jobDescription, setJobDescription] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [workMode, setWorkMode] = useState('remote');
  const [showOptional, setShowOptional] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  // History Tab state
  const [history, setHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  const [deleteReportId, setDeleteReportId] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resumeRes, historyRes] = await Promise.all([
          resumeService.getResume().catch(() => null),
          applicationService.getSavedReports().catch(() => []),
        ]);
        setResumeData(resumeRes);
        setHistory(historyRes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (location.state?.prefill) {
      const p = location.state.prefill;
      if (p.description) setJobDescription(p.description);
      if (p.originalUrl) {
        setUrlInput(p.originalUrl);
        setInputMode('url');
      }
      if (p.title) {
        setTitle(p.title);
        setShowOptional(true);
      }
      if (p.company) {
        setCompany(p.company);
        setShowOptional(true);
      }
      if (p.location) {
        setJobLocation(p.location);
        setShowOptional(true);
      }
      if (p.workMode) {
        setWorkMode(p.workMode);
        setShowOptional(true);
      }
      setActiveTab('studio');
    }
  }, [location.state]);

  const handleLoadLinearSample = () => {
    setInputMode('paste');
    setJobDescription(SAMPLE_LINEAR_JD);
    setTitle('Senior Frontend Engineer — Design Systems');
    setCompany('Linear');
    setJobLocation('Remote (US / EU)');
    toast.success('Loaded Linear Senior Frontend Engineer JD');
  };

  const handleExtractUrl = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a job posting URL first.');
      return;
    }

    try {
      setFetchingUrl(true);
      toast.loading('Reading job posting details from URL...', { id: 'extract-url' });
      const res = await applicationService.extractJobFromUrl(urlInput.trim());
      
      if (res.success && res.job) {
        setJobDescription(res.job.description);
        if (res.job.title) setTitle(res.job.title);
        if (res.job.company) setCompany(res.job.company);
        if (res.job.location) setJobLocation(res.job.location);
        setShowOptional(true);
        setInputMode('paste');
        toast.success('Job details loaded! Review text and hit Analyze.', { id: 'extract-url' });
      }
    } catch (err) {
      console.error(err);
      const isProtected = err.response?.data?.isProtected;
      const portal = err.response?.data?.portalName || 'This site';
      const msg = err.response?.data?.message || `${portal} requires login or blocks automated readers. Please copy and paste the job description text directly.`;
      
      toast.error(msg, { id: 'extract-url', duration: 6000 });
      setInputMode('paste');
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();

    let textToAnalyze = jobDescription;
    let originalUrl = undefined;

    if (inputMode === 'url') {
      if (!urlInput.trim()) {
        toast.error('Please enter a job posting URL.');
        return;
      }
      originalUrl = urlInput.trim();

      // If user hasn't extracted yet, extract first
      if (!jobDescription.trim() || jobDescription === urlInput) {
        try {
          setAnalyzing(true);
          toast.loading('Fetching job description from URL...', { id: 'clarity' });
          const res = await applicationService.extractJobFromUrl(originalUrl);
          if (res.success && res.job) {
            textToAnalyze = res.job.description;
            if (res.job.title && !title) setTitle(res.job.title);
            if (res.job.company && !company) setCompany(res.job.company);
            if (res.job.location && !jobLocation) setJobLocation(res.job.location);
            setJobDescription(res.job.description);
          }
        } catch (err) {
          const msg = err.response?.data?.message || 'Could not load job from URL. Please copy and paste the job description text directly.';
          toast.error(msg, { id: 'clarity', duration: 6000 });
          setInputMode('paste');
          setAnalyzing(false);
          return;
        }
      }
    }

    if (!textToAnalyze || textToAnalyze.trim().length < 50) {
      toast.error('Please provide a complete job description (at least 50 characters).');
      return;
    }

    try {
      setAnalyzing(true);
      toast.loading('Auditing job requirements against your verified resume matrix...', { id: 'clarity' });

      const payload = {
        jobDescription: textToAnalyze.trim(),
        title: title.trim() || undefined,
        company: company.trim() || undefined,
        location: jobLocation.trim() || undefined,
        workMode: workMode || undefined,
        originalUrl: originalUrl || undefined,
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

  const handleDeleteReport = async () => {
    if (!deleteReportId) return;
    try {
      await applicationService.deleteReport(deleteReportId);
      toast.success('Clarity report deleted.');
      setHistory(prev => prev.filter(item => (item._id || item.id) !== deleteReportId));
      setDeleteReportId(null);
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

  const filteredHistory = history.filter(item => {
    const query = historySearch.toLowerCase();
    const titleMatch = (item.jobDetails?.title || '').toLowerCase().includes(query);
    const companyMatch = (item.jobDetails?.company || '').toLowerCase().includes(query);
    return titleMatch || companyMatch;
  });

  const activeFileName = resumeData?.originalFileName || resumeData?.resume?.metadata?.originalFilename || 'Active Profile Matrix';
  const candidateName = resumeData?.structuredProfile?.professionalProfile?.fullName || resumeData?.structuredProfile?.profile?.name || user?.name || 'Verified Candidate';

  return (
    <div className="w-full space-y-6">
      {/* 1. Header with Active Resume Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-white leading-tight">
              Application Clarity Studio
            </h1>
            <Badge variant="brand" size="xs">
              Primary Workbench
            </Badge>
          </div>
          <p className="text-[14px] text-stone-400">
            Compare job expectations with your verified resume matrix. Discover what's relevant, what's missing, and what needs recruiter clarification.
          </p>
        </div>

        {/* Tab Switcher: Studio vs Saved Reports */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-[4px] font-semibold transition cursor-pointer text-[13px] ${
              activeTab === 'studio'
                ? 'bg-white text-black'
                : 'bg-white/5 border border-white/10 text-stone-400 hover:text-white'
            }`}
          >
            <Lightning className={`w-4 h-4 ${activeTab === 'studio' ? 'text-black' : 'text-[#FF4124]'}`} weight="fill" />
            <span>Studio Console</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-[4px] font-semibold transition cursor-pointer text-[13px] ${
              activeTab === 'history'
                ? 'bg-white text-black'
                : 'bg-white/5 border border-white/10 text-stone-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-stone-400" weight="regular" />
            <span>Saved Reports ({history.length})</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: STUDIO CONSOLE (1:1 Match with Homepage Console Design) */}
      {activeTab === 'studio' && (
        <div className="space-y-4">
          <div className="w-full bg-[#121110] rounded-[4px] border border-white/15 shadow-2xl text-left transition focus-within:border-white/25 overflow-hidden">
            {/* Console Header: Tabs + Sample JD + Metadata Toggle */}
            <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-[12px]">
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1.5 rounded-[4px] font-medium transition cursor-pointer text-[12px] ${
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
                  className={`px-3 py-1.5 rounded-[4px] font-medium transition cursor-pointer text-[12px] ${
                    inputMode === 'url'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Import URL
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleLoadLinearSample}
                  className="inline-flex items-center space-x-1.5 text-[12px] text-[#FF4124] hover:text-[#ff5a42] font-semibold transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" weight="bold" />
                  <span>Linear Sample</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowOptional(!showOptional)}
                  className="text-[12px] text-stone-400 hover:text-white transition cursor-pointer font-medium"
                >
                  {showOptional ? 'Hide Role Details' : '+ Add Role Title, Company & Location'}
                </button>
              </div>
            </div>

            {/* Optional Metadata Drawer */}
            {showOptional && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white/[0.02] border-b border-white/10 text-[13px]">
                <div>
                  <label className="block text-[12px] font-semibold text-stone-400 mb-1">
                    Job Title
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Architect"
                    className="bg-white/5 border-white/10 text-white rounded-[4px] text-[13px] h-9"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-stone-400 mb-1">
                    Company Name
                  </label>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Linear, Figma, Vercel"
                    className="bg-white/5 border-white/10 text-white rounded-[4px] text-[13px] h-9"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-stone-400 mb-1">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Remote, San Francisco"
                    className="bg-white/5 border-white/10 text-white rounded-[4px] text-[13px] h-9"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-stone-400 mb-1">
                    Work Arrangement
                  </label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white/5 text-white border border-white/10 rounded-[4px] focus:outline-none focus:border-white/25 text-[13px] h-9 font-medium cursor-pointer"
                  >
                    <option value="remote" className="bg-[#141210] text-white">Remote</option>
                    <option value="hybrid" className="bg-[#141210] text-white">Hybrid</option>
                    <option value="on-site" className="bg-[#141210] text-white">On-site</option>
                  </select>
                </div>
              </div>
            )}

            {/* Input Body */}
            <div className="p-4 sm:p-5 min-h-[160px] flex flex-col justify-start">
              {inputMode === 'paste' ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pb-1">
                    <span>Target Job Description</span>
                    <span>{jobDescription.length.toLocaleString()} characters</span>
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    placeholder="Paste the complete job description text here (including responsibilities, qualifications, tech stack, and background requirements)..."
                    className="w-full text-[14px] text-stone-100 placeholder:text-stone-500 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none leading-relaxed font-sans"
                  />
                </div>
              ) : (
                <div className="py-3 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>Job Posting Link</span>
                    <span>Supports Lever, Greenhouse, Workday, direct careers sites</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleExtractUrl();
                        }
                      }}
                      placeholder="e.g. https://jobs.lever.co/linear/... or https://www.naukri.com/..."
                      className="flex-1 text-[13px] px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-[4px] focus:border-[#FF4124] focus:outline-none placeholder:text-stone-500 font-mono"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleExtractUrl}
                      loading={fetchingUrl}
                      className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20 whitespace-nowrap text-[12px] h-10 px-4"
                    >
                      {fetchingUrl ? 'Reading URL...' : 'Extract & Load JD'}
                    </Button>
                  </div>
                  <p className="text-[12px] text-stone-400 leading-relaxed">
                    Paste any public link. For protected sites like Naukri or LinkedIn that require logins, our extractor will prompt you to paste the text directly.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="px-4 py-3 bg-white/[0.03] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px]">
              {/* Active Resume Indicator */}
              <div className="flex items-center space-x-2 text-[12px] text-stone-400 truncate">
                <span className="w-2 h-2 rounded-[2px] bg-[#FF4124] shrink-0 animate-pulse" />
                <span className="text-stone-300 font-semibold">{candidateName}:</span>
                <span className="truncate max-w-[200px] sm:max-w-[300px] text-stone-400 font-mono">
                  {activeFileName}
                </span>
                <Link
                  to="/profile"
                  className="text-[#FF4124] hover:underline font-semibold text-[11px] ml-0.5"
                >
                  Switch
                </Link>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="default"
                  size="default"
                  onClick={handleAnalyze}
                  loading={analyzing}
                  icon={Lightning}
                  iconPosition="right"
                  className="font-bold shadow-lg rounded-[4px] text-[13px] px-5 py-2 w-full sm:w-auto"
                >
                  {analyzing ? 'Synthesizing Diagnostic...' : 'Analyze with Application Clarity'}
                </Button>
              </div>
            </div>
          </div>

          {/* Understated Trust Elements */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[12px] text-stone-400 font-mono pt-2">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#141210] border border-white/10 rounded-[4px]">
              <Check className="w-3.5 h-3.5 text-stone-300" weight="bold" />
              <span>Evidence-based</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#141210] border border-white/10 rounded-[4px]">
              <Check className="w-3.5 h-3.5 text-stone-300" weight="bold" />
              <span>Zero fake scores</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#141210] border border-white/10 rounded-[4px]">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-300" weight="bold" />
              <span>Private & confidential</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: SAVED CLARITY REPORTS */}
      {activeTab === 'history' && (
        <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8 space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlass className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Filter by company or role..."
                className="pl-10 bg-white/5 border-white/10 text-white rounded-[4px] text-[14px]"
              />
            </div>
            <span className="text-[12px] text-stone-400 font-mono">
              Showing {filteredHistory.length} of {history.length} saved diagnostic reports
            </span>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center space-y-3 text-stone-400">
              <div className="w-12 h-12 rounded-[4px] bg-white/5 border border-white/10 text-stone-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" weight="regular" />
              </div>
              <p className="text-[14px]">
                {historySearch ? 'No saved reports match your search query.' : 'No application clarity reports saved yet.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableHead className="text-stone-300 font-bold text-[13px]">Role & Company</TableHead>
                  <TableHead className="text-stone-300 font-bold text-[13px]">Analysis Date</TableHead>
                  <TableHead className="text-stone-300 font-bold text-[13px]">Verified Claims</TableHead>
                  <TableHead className="text-stone-300 font-bold text-[13px]">Contradictions</TableHead>
                  <TableHead className="text-right text-stone-300 font-bold text-[13px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((report) => {
                  const repId = report._id || report.id;
                  const verifiedCount = (report.results?.requirementBreakdown || []).filter(
                    (r) => r.evidenceStatus === 'evidence-found'
                  ).length;
                  const totalReqs = (report.results?.requirementBreakdown || []).length;
                  const contradictionCount = (report.results?.contradictions || []).length;

                  return (
                    <TableRow key={repId} className="border-b border-white/10 hover:bg-white/5 transition">
                      <TableCell className="font-semibold text-white">
                        <div className="font-bold text-[15px]">{report.jobDetails?.title || 'Engineering Application'}</div>
                        <div className="text-[12px] text-stone-400">{report.jobDetails?.company || 'Company'}</div>
                      </TableCell>
                      <TableCell className="font-mono text-[12px] text-stone-400">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="verified" size="xs">
                          {verifiedCount}/{totalReqs} Verified
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {contradictionCount > 0 ? (
                          <Badge variant="contradiction" size="xs">
                            {contradictionCount} Flagged
                          </Badge>
                        ) : (
                          <span className="text-[12px] text-stone-500 font-mono">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/application/${repId}`}>
                          <Button variant="secondary" size="xs" icon={ArrowSquareOut} iconPosition="right" className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20">
                            View Report
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteReportId(repId)}
                          title="Delete report"
                          className="rounded-[4px]"
                        >
                          <Trash className="w-4 h-4 text-stone-400 hover:text-[#FF4124]" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteReportId)}
        onClose={() => setDeleteReportId(null)}
        onConfirm={handleDeleteReport}
        title="Delete Saved Clarity Report"
        message="Are you sure you want to remove this diagnostic report? This will remove the audit and screening notes."
        confirmText="Delete Report"
        variant="destructive"
      />
    </div>
  );
}
