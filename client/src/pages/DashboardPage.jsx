import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import { resumeService } from '../services/resumeService';
import { jobService } from '../services/jobService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/table';
import LoadingSkeleton from '../components/LoadingSkeleton';
import JobDetailDrawer from '../components/JobDetailDrawer';
import toast from 'react-hot-toast';
import { 
  Sparkle, 
  Lightning, 
  FileText, 
  Compass, 
  ArrowRight, 
  ArrowSquareOut, 
  CheckCircle, 
  WarningCircle, 
  ShieldCheck, 
  BookmarkSimple,
  Clock,
  Briefcase
} from '@phosphor-icons/react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [quickJdText, setQuickJdText] = useState('');
  const [selectedJobForDrawer, setSelectedJobForDrawer] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [resume, analyses, jobsData] = await Promise.all([
          resumeService.getResume().catch(() => null),
          applicationService.getSavedReports().catch(() => []),
          jobService.getJobs({ limit: 4, timeframe: '24h' }).catch(() => ({ jobs: [] })),
        ]);

        setResumeData(resume);
        setRecentAnalyses(analyses || []);
        setRecommendedJobs(jobsData.jobs?.slice(0, 4) || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const candidateProfile = resumeData?.structuredProfile?.professionalProfile || resumeData?.structuredProfile?.profile || {};
  const candidateName = candidateProfile.fullName || candidateProfile.name || user?.name || 'Verified Candidate';
  const candidateHeadline = candidateProfile.headline || candidateProfile.currentRole || 'Active Engineering Profile';

  const rawTech = resumeData?.structuredProfile?.technicalSkills || {};
  const allSkills = Object.entries(rawTech)
    .filter(([cat]) => cat !== 'skillContexts')
    .flatMap(([_, skills]) => (Array.isArray(skills) ? skills : []))
    .filter(s => typeof s === 'string' && s.trim());

  const totalSkillsCount = allSkills.length;

  const handleQuickAnalyze = (e) => {
    e.preventDefault();
    if (!quickJdText.trim()) return;
    navigate('/application', {
      state: {
        prefill: {
          description: quickJdText.trim(),
        },
      },
    });
  };

  return (
    <div className="w-full space-y-8 text-stone-100">
      {/* 1. TOP WELCOME & METRICS STRIP */}
      <Card className="p-6 sm:p-8 bg-[#141210] border-white/10 rounded-[4px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-white">
                Good day, {user?.name?.split(' ')[0] || 'Candidate'}
              </h1>
              <Badge variant="verified" pill size="xs">
                Deterministic Mode Active
              </Badge>
            </div>
            <p className="text-[14px] text-stone-400">
              Verified career intelligence workbench. Zero fabricated match percentages.
            </p>
          </div>

          {/* Quick Stat Indicators */}
          <div className="flex flex-wrap items-center gap-3 text-[14px]">
            <div className="bg-white/5 border border-white/10 rounded-[4px] px-4 py-2.5 space-y-0.5">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Active Resume</span>
              <div className="font-bold text-white truncate max-w-[160px] font-mono text-[13px]">
                {resumeData?.originalFileName || resumeData?.metadata?.originalFilename || 'Resume Matrix Active'}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[4px] px-4 py-2.5 space-y-0.5">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Extracted Facets</span>
              <div className="font-bold text-white font-mono text-[13px]">
                {totalSkillsCount} Skills & Tools
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[4px] px-4 py-2.5 space-y-0.5">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Clarity Audits</span>
              <div className="font-bold text-white font-mono text-[13px]">
                {recentAnalyses.length} Run
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. MAIN 2-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Quick Studio & Recent Reports */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {/* Quick Clarity Studio Launcher */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-white/10 text-white flex items-center justify-center">
                  <Lightning className="w-4 h-4 text-[#FF4124]" weight="fill" />
                </div>
                <div>
                  <CardTitle className="text-[17px] sm:text-[18px] font-bold text-white">
                    Instant Application Clarity
                  </CardTitle>
                  <CardDescription className="text-[13px] text-stone-400">
                    Drop in any job description to cross-reference against your resume matrix
                  </CardDescription>
                </div>
              </div>
              <Link to="/application">
                <Button variant="ghost" size="xs" className="text-stone-300 hover:text-white rounded-[4px]">
                  Full Studio →
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <form onSubmit={handleQuickAnalyze} className="space-y-3">
                <Textarea
                  value={quickJdText}
                  onChange={(e) => setQuickJdText(e.target.value)}
                  rows={4}
                  placeholder="Paste a job description to audit mandatory requirements and uncover hidden contradictions..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-stone-500 text-[14px] rounded-[4px] p-3.5 focus:border-white/25 leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono text-stone-500">
                    {quickJdText.length} characters
                  </span>
                  <Button
                    type="submit"
                    variant="default"
                    size="default"
                    disabled={!quickJdText.trim()}
                    icon={Lightning}
                    className="font-bold rounded-[4px]"
                  >
                    Analyze with Clarity
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent Clarity Reports Table */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#FF4124]" weight="regular" />
                <CardTitle className="text-[17px] sm:text-[18px] font-bold text-white">
                  Recent Application Clarity Reports
                </CardTitle>
              </div>
              <Link to="/application" className="text-[13px] font-semibold text-[#FF4124] hover:underline font-mono">
                View All ({recentAnalyses.length})
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="p-6">
                  <LoadingSkeleton lines={3} />
                </div>
              ) : recentAnalyses.length === 0 ? (
                <div className="py-8 text-center space-y-3 p-6 text-stone-400">
                  <p className="text-[14px]">
                    You haven't run any application clarity analyses yet.
                  </p>
                  <Link to="/application">
                    <Button variant="default" size="xs" className="rounded-[4px]">
                      Run Your First Analysis
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10 hover:bg-transparent">
                      <TableHead className="text-stone-400 font-bold text-[12px]">Role & Company</TableHead>
                      <TableHead className="text-stone-400 font-bold text-[12px]">Verified Claims</TableHead>
                      <TableHead className="text-stone-400 font-bold text-[12px]">Contradictions</TableHead>
                      <TableHead className="text-right text-stone-400 font-bold text-[12px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAnalyses.slice(0, 5).map((item) => {
                      const repId = item._id || item.id;
                      const verifiedCount = (item.results?.requirementBreakdown || []).filter(
                        (r) => r.evidenceStatus === 'evidence-found'
                      ).length;
                      const totalReqs = (item.results?.requirementBreakdown || []).length;
                      const contradictionCount = (item.results?.contradictions || []).length;

                      return (
                        <TableRow key={repId} className="border-b border-white/10 hover:bg-white/5 transition">
                          <TableCell className="font-semibold text-white">
                            <div className="truncate max-w-[200px] text-[14px]">{item.jobDetails?.title || 'Job Application'}</div>
                            <div className="text-[12px] text-stone-400 font-normal">{item.jobDetails?.company || 'Company'}</div>
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
                          <TableCell className="text-right">
                            <Link to={`/application/${repId}`}>
                              <Button variant="secondary" size="xs" icon={ArrowSquareOut} iconPosition="right" className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-[4px]">
                                View Report
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Resume Matrix Status & Recommended Jobs */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          {/* Active Resume Matrix Preview */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#FF4124]" weight="regular" />
                <CardTitle className="text-[17px] sm:text-[18px] font-bold text-white">
                  Resume Evidence Matrix
                </CardTitle>
              </div>
              <Link to="/profile" className="text-[13px] font-bold text-[#FF4124] hover:underline font-mono">
                Inspect Matrix →
              </Link>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              {loading ? (
                <LoadingSkeleton lines={2} />
              ) : resumeData ? (
                <div className="space-y-4 text-stone-100">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-[4px] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-[15px]">
                        {candidateName}
                      </div>
                      <div className="text-[13px] text-stone-400">
                        {candidateHeadline}
                      </div>
                    </div>
                    <Badge variant="verified" size="xs">
                      {resumeData.structuredProfile?.completenessCheck?.overallConfidence || 'High'} Confidence
                    </Badge>
                  </div>

                  {/* Extracted Core Skills Snippet */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                      Verified Core Stacks:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {allSkills.length > 0 ? (
                        allSkills.slice(0, 8).map((skill, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono bg-white/5 text-stone-300 px-2 py-0.5 rounded-[4px] border border-white/10"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[13px] text-stone-500">Analysis complete.</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3 text-stone-400">
                  <p className="text-[14px]">No resume uploaded yet.</p>
                  <Link to="/onboarding">
                    <Button variant="default" size="sm" className="rounded-[4px]">Upload Resume</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top 24h Aligned Opportunities */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#FF4124]" weight="regular" />
                <CardTitle className="text-[17px] sm:text-[18px] font-bold text-white">
                  Aligned Opportunities (24h)
                </CardTitle>
              </div>
              <Link to="/jobs" className="text-[13px] font-bold text-[#FF4124] hover:underline font-mono">
                Explore Feed →
              </Link>
            </CardHeader>

            <CardContent className="pt-5 space-y-3">
              {loading ? (
                <LoadingSkeleton lines={4} />
              ) : recommendedJobs.length === 0 ? (
                <p className="text-[13px] text-stone-500 py-4 text-center">
                  No recent matched postings. Check back shortly.
                </p>
              ) : (
                <div className="space-y-3">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job.id || job._id}
                      onClick={() => setSelectedJobForDrawer(job)}
                      className="p-4 bg-white/5 hover:bg-white/10 hover:border-white/20 border border-white/10 rounded-[4px] transition cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-[15px] font-bold text-white truncate hover:text-[#FF4124] transition-colors">
                            {job.title}
                          </h4>
                          <div className="text-[13px] text-stone-400 truncate">
                            {job.company} • {job.location || 'Remote'}
                          </div>
                        </div>
                        <Badge variant={job.workMode || 'remote'} size="xs">
                          {job.workMode || 'Remote'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Drawer */}
      <JobDetailDrawer
        job={selectedJobForDrawer}
        isOpen={Boolean(selectedJobForDrawer)}
        onClose={() => setSelectedJobForDrawer(null)}
      />
    </div>
  );
}
