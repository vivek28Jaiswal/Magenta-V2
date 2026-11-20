import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Buildings, 
  MapPin, 
  Copy, 
  Check, 
  Sparkle, 
  ShieldCheck, 
  ChatCircleText,
  WarningOctagon
} from '@phosphor-icons/react';

export default function ApplicationReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all | mandatory | preferred | unclear | evidence-found | partial-evidence | not-found
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getAnalysisById(id);
        setReport(data);
      } catch (err) {
        console.error('Failed to load application clarity report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleCopyQuestion = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIndex(idx);
    toast.success('Question copied to clipboard!');
    setTimeout(() => setCopiedQuestionIndex(null), 2500);
  };

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <LoadingSkeleton lines={4} />
        <LoadingSkeleton lines={8} />
      </div>
    );
  }

  if (!report) {
    return (
      <Card className="w-full py-16 text-center space-y-4 bg-[#141210] border-white/10 rounded-[4px]">
        <WarningOctagon className="w-12 h-12 text-[#FF4124] mx-auto" weight="regular" />
        <h2 className="text-[20px] font-bold text-white">Report Not Found</h2>
        <p className="text-[14px] text-stone-400">
          This Application Clarity report could not be found or has expired.
        </p>
        <Link to="/application">
          <Button variant="default" size="sm" className="rounded-[4px]">Go to Application Clarity</Button>
        </Link>
      </Card>
    );
  }

  const {
    jobDetails = {},
    overview = {},
    mandatoryRequirements = [],
    preferredRequirements = [],
    unclearRequirements = [],
    contradictions = [],
    recruiterQuestions = [],
  } = report;

  const allReqs = [
    ...mandatoryRequirements,
    ...preferredRequirements,
    ...unclearRequirements,
  ];

  const filteredReqs = allReqs.filter((req) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'mandatory') return req.employerClassification === 'Mandatory';
    if (activeFilter === 'preferred') return req.employerClassification === 'Preferred';
    if (activeFilter === 'unclear') return req.employerClassification === 'Unclear';
    if (activeFilter === 'evidence-found') return req.resumeStatus === 'Evidence Found';
    if (activeFilter === 'partial-evidence') return req.resumeStatus === 'Partial Evidence';
    if (activeFilter === 'not-found') return req.resumeStatus === 'Not Found in Resume';
    return true;
  });

  const verifiedClaimsCount = allReqs.filter(r => r.resumeStatus === 'Evidence Found').length;
  const partialClaimsCount = allReqs.filter(r => r.resumeStatus === 'Partial Evidence').length;
  const missingClaimsCount = allReqs.filter(r => r.resumeStatus === 'Not Found in Resume').length;

  return (
    <div className="w-full space-y-6">
      {/* 1. Back Navigation & Verification Badge */}
      <div className="flex items-center justify-between">
        <Link
          to="/application"
          className="inline-flex items-center text-[13px] font-semibold text-stone-400 hover:text-white transition gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" weight="bold" />
          <span>Back to Application Clarity Studio</span>
        </Link>

        <span className="text-[11px] font-mono text-stone-400 bg-white/5 border border-white/10 px-3 py-1 rounded-[4px]">
          Deterministic Engine • ID: {id?.slice(-8)}
        </span>
      </div>

      {/* 2. Master Diagnostic Header Card */}
      <Card className="bg-[#141210] border-white/10 rounded-[4px]">
        <CardHeader className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 text-[12px] text-stone-400 font-mono mb-1">
                <Sparkle className="w-3.5 h-3.5 text-[#FF4124]" weight="fill" />
                <span className="text-white font-semibold">Diagnostic Report</span>
                <span>•</span>
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-white leading-tight">
                {jobDetails.title || overview.title || 'Position Analysis'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-[14px] text-stone-400 pt-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Buildings className="w-4 h-4 text-stone-400" weight="regular" />
                  {jobDetails.company || overview.company || 'Employer'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" weight="regular" />
                  {jobDetails.location || overview.location || 'Remote'}
                </span>
                {jobDetails.workMode && (
                  <>
                    <span>•</span>
                    <Badge variant={jobDetails.workMode} size="xs">{jobDetails.workMode.toUpperCase()}</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="px-3.5 py-1.5 rounded-[4px] bg-white/10 border border-white/20 text-white text-[13px] font-bold flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-[11px] uppercase font-mono tracking-wider text-stone-300">Verified:</span>
                <span>{verifiedClaimsCount} of {allReqs.length} Reqs</span>
              </div>
              {contradictions.length > 0 && (
                <div className="px-3.5 py-1.5 rounded-[4px] bg-[#FF4124]/15 border border-[#FF4124]/30 text-[#FF4124] text-[13px] font-bold flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4124]" />
                  <span className="text-[11px] uppercase font-mono tracking-wider">Contradictions:</span>
                  <span>{contradictions.length} Flagged</span>
                </div>
              )}
            </div>
          </div>

          {overview.summary && (
            <p className="text-[14px] text-stone-300 border-t border-white/10 pt-4 leading-relaxed">
              {overview.summary}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* 3. Deterministic Guarantee Banner */}
      <div className="bg-[#141210] border border-white/10 rounded-[4px] p-4 sm:p-5 text-[14px] flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" weight="regular" />
        <div className="space-y-0.5">
          <p className="font-semibold text-white">Transparent, Deterministic Evidence</p>
          <p className="text-stone-400 leading-relaxed text-[13px]">
            Magenta rejects arbitrary ATS pass/fail percentages. Every qualification is linked to verbatim citations from your resume. "Not Found" indicates unstated experience in your text, not lack of technical capability.
          </p>
        </div>
      </div>

      {/* 4. Contradictions Section */}
      {contradictions && contradictions.length > 0 && (
        <div className="bg-[#FF4124]/5 border border-[#FF4124]/20 rounded-[4px] p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#FF4124] font-bold text-[13px] uppercase tracking-wider font-mono">
            <WarningOctagon className="w-4 h-4" weight="regular" />
            <span>Contradictions & Conflicting Statements in Job Specification ({contradictions.length})</span>
          </div>
          <div className="space-y-3">
            {contradictions.map((c, i) => (
              <div key={i} className="bg-[#141210] border border-[#FF4124]/30 rounded-[4px] p-4 text-[14px] space-y-2">
                <div className="font-bold text-white text-[15px]">{c.title || `Contradiction #${i + 1}`}</div>
                <p className="text-stone-300 leading-relaxed">{c.explanation || c.description}</p>
                {c.clauses && (
                  <div className="bg-[#0C0B0A] border border-white/10 rounded-[4px] p-3 text-[12px] font-mono text-stone-400 mt-2">
                    {c.clauses}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Requirement & Evidence Audit with Interactive Filter Pills */}
      <Card className="bg-[#141210] border-white/10 rounded-[4px]">
        <CardHeader className="pb-4 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <CardTitle className="text-[14px] font-bold uppercase tracking-wider font-mono text-white">
                Requirement & Evidence Mapping
              </CardTitle>
              <p className="text-[13px] text-stone-400 mt-0.5">
                Every job expectation cross-referenced against your verified resume text
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-[13px]">
              {[
                { id: 'all', label: `All (${allReqs.length})` },
                { id: 'mandatory', label: 'Mandatory' },
                { id: 'preferred', label: 'Preferred' },
                { id: 'evidence-found', label: `Verified (${verifiedClaimsCount})` },
                { id: 'partial-evidence', label: `Partial (${partialClaimsCount})` },
                { id: 'not-found', label: `Not Found (${missingClaimsCount})` },
              ].map(({ id: filterId, label }) => (
                <button
                  key={filterId}
                  type="button"
                  onClick={() => setActiveFilter(filterId)}
                  className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition cursor-pointer ${
                    activeFilter === filterId
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/5 border border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6 sm:px-8 pb-8 pt-0">
          {filteredReqs.map((req, idx) => (
            <div
              key={idx}
              className="bg-[#121110] border border-white/10 rounded-[4px] p-4 sm:p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={req.employerClassification || 'mandatory'} size="xs">
                    {req.employerClassification || 'Requirement'}
                  </Badge>
                  <Badge
                    variant={
                      req.resumeStatus === 'Evidence Found'
                        ? 'verified'
                        : req.resumeStatus === 'Partial Evidence'
                        ? 'partial'
                        : 'missing'
                    }
                    size="xs"
                  >
                    {req.resumeStatus || 'Pending'}
                  </Badge>
                </div>
                {req.sectionReference && (
                  <span className="text-[11px] font-mono text-stone-500">
                    {req.sectionReference}
                  </span>
                )}
              </div>

              <h3 className="text-[15px] font-bold text-white tracking-tight">
                {req.requirementText || req.title}
              </h3>

              {/* Verbatim Citation Box */}
              {req.verbatimCitation ? (
                <div className="bg-[#0C0B0A] border border-white/10 border-l-2 border-l-[#FF4124] rounded-[4px] p-3.5 text-[13px] space-y-1">
                  <div className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                    Verbatim Resume Citation ({req.citationLocation || 'Resume Text'}):
                  </div>
                  <p className="italic text-stone-200 leading-relaxed font-sans">
                    "{req.verbatimCitation}"
                  </p>
                </div>
              ) : req.evaluationGap ? (
                <div className="bg-[#0C0B0A] border border-white/10 rounded-[4px] p-3.5 text-[13px] space-y-1">
                  <div className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                    Evaluation & Gap Notes:
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    {req.evaluationGap}
                  </p>
                </div>
              ) : null}

              {req.explanation && !req.evaluationGap && (
                <p className="text-[13px] text-stone-400 leading-relaxed">
                  {req.explanation}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 6. Recruiter Screening Clarification Questions */}
      {recruiterQuestions && recruiterQuestions.length > 0 && (
        <Card className="bg-[#141210] border-white/10 rounded-[4px]">
          <CardHeader className="pb-3 border-b border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChatCircleText className="w-5 h-5 text-[#FF4124]" weight="regular" />
                <CardTitle className="text-[18px] font-bold text-white">
                  Recruiter Screening Clarification Questions
                </CardTitle>
              </div>
              <span className="text-[12px] text-stone-400 font-mono hidden sm:block">
                Tactical questions for your initial recruiter call
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-6 sm:p-8 pt-4">
            <p className="text-[14px] text-stone-400">
              Use these precise, high-context questions during recruiter calls to clarify ambiguities and position yourself as a discerning candidate.
            </p>

            <div className="space-y-3 pt-2">
              {recruiterQuestions.map((q, idx) => {
                const questionText = typeof q === 'string' ? q : q.question || q.text;
                const rationale = typeof q === 'object' ? q.rationale || q.context : null;
                const isCopied = copiedQuestionIndex === idx;

                return (
                  <div
                    key={idx}
                    className="bg-[#121110] border border-white/10 rounded-[4px] p-4 space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[14px] font-semibold text-white leading-relaxed">
                        "{questionText}"
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyQuestion(questionText, idx)}
                        className="inline-flex items-center space-x-1.5 text-[11px] font-mono font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-[4px] transition shrink-0 cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-white" weight="bold" /> : <Copy className="w-3.5 h-3.5 text-stone-300" weight="regular" />}
                        <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>
                    {rationale && (
                      <p className="text-[12px] text-stone-400 italic">
                        Why to ask: {rationale}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
