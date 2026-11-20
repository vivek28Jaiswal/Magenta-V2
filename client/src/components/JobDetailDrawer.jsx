import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import {
  Buildings,
  MapPin,
  Clock,
  ArrowSquareOut,
  BookmarkSimple,
  Sparkle,
  Lightning,
  Check,
  Folder,
} from '@phosphor-icons/react';

export default function JobDetailDrawer({
  job,
  isOpen,
  onClose,
  isSaved = false,
  onSaveToggle,
}) {
  const navigate = useNavigate();

  if (!job) return null;

  const handleAnalyseWithClarity = () => {
    onClose();
    navigate('/application', {
      state: {
        prefill: {
          title: job.title,
          company: job.company,
          location: job.location,
          workMode: job.workMode,
          originalUrl: job.originalUrl,
          description: job.description,
        },
      },
    });
  };

  const matchScore = job.matchScore || 90;
  const headline = job.friendlyHeadline || (matchScore >= 90 ? "Hey, this one's looking like a good fit for you!" : "Okay, this one looks interesting!");
  const matchingSkills = job.relevance?.matchingSkills || job.skills?.slice(0, 4) || [];
  const missingSkills = job.relevance?.missingImportantSkills || [];
  const projectEvidence = job.relevance?.relevantExperienceEvidence || [];
  const whyPicked = job.whyPicked || "Your React skills? Check. Your frontend projects? Check. Your background matches almost everything this team is asking for.";
  const beforeYouApply = job.beforeYouApply || "One small thing to look at before applying: Make sure your GitHub links and portfolio demos are up to date.";

  const formatPublishedAt = (dateString) => {
    if (!dateString) return 'Recent';
    const pubDate = new Date(dateString);
    const diffMs = Date.now() - pubDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#0C0B0A] text-stone-100 flex flex-col h-full border-l border-white/10 p-0">
        {/* Top Header */}
        <SheetHeader className="p-6 pb-4 bg-[#141210] border-b border-white/10 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1 min-w-0 pr-4">
            <span className="text-[11px] font-mono text-[#FF4124] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Sparkle className="w-3.5 h-3.5" weight="fill" />
              {headline}
            </span>
            <SheetTitle className="text-[18px] sm:text-[20px] font-bold text-white truncate">
              {job.title}
            </SheetTitle>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onSaveToggle && (
              <Button
                variant={isSaved ? 'default' : 'secondary'}
                size="icon-sm"
                onClick={() => onSaveToggle(job.id || job._id)}
                title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
                className="rounded-[4px]"
              >
                <BookmarkSimple className="w-4 h-4" weight={isSaved ? 'fill' : 'regular'} />
              </Button>
            )}

            {job.originalUrl && (
              <a
                href={job.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="icon-sm" title="Open Original Posting" className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20">
                  <ArrowSquareOut className="w-4 h-4" weight="regular" />
                </Button>
              </a>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0C0B0A]">
          {/* Quick Overview Pill Card */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold bg-[#FF4124]/15 text-[#FF4124] border border-[#FF4124]/30 px-2.5 py-0.5 rounded-[4px] flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#FF4124]" weight="bold" />
                  {matchScore}% honest match
                </span>
                <Badge variant={job.workMode || 'remote'} size="xs">
                  {job.workMode || 'Remote'}
                </Badge>
                <span className="text-[11px] font-mono uppercase bg-white/5 border border-white/10 text-stone-300 px-2 py-0.5 rounded-[4px]">
                  {job.employmentType || 'full-time'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[13px] text-stone-400 pt-1">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <Buildings className="w-4 h-4 text-stone-400" weight="regular" />
                  {job.company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" weight="regular" />
                  {job.location || 'Remote India'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-stone-400">
                  <Clock className="w-3.5 h-3.5 text-stone-500" weight="regular" />
                  {formatPublishedAt(job.publishedAt)}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Section: Why we picked this for you */}
          <div className="bg-[#141210] border border-white/10 rounded-[4px] p-4 sm:p-5 space-y-2">
            <span className="text-[11px] font-mono text-[#FF4124] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5" weight="fill" />
              Why we picked this for you
            </span>
            <p className="text-[13px] text-stone-200 leading-relaxed">
              {whyPicked}
            </p>
          </div>

          {/* Section: Good news! They need skills you've already got */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px] font-mono text-stone-300 uppercase tracking-wider flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FF4124]" weight="bold" />
                Good news! They need skills you've already got
              </CardTitle>
            </CardHeader>
            <CardContent>
              {matchingSkills && matchingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {matchingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-[12px] font-mono bg-white/5 border border-white/10 text-stone-200 px-2.5 py-1 rounded-[4px] flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-[#FF4124]" weight="bold" />
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-stone-400">
                  They align with your core computer science foundation and problem-solving focus.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Section: A couple of things you might want to brush up on */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px] font-mono text-stone-300 uppercase tracking-wider flex items-center gap-2">
                <Lightning className="w-4 h-4 text-[#FF4124]" weight="regular" />
                A couple of things you might want to brush up on
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {missingSkills && missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-[12px] font-mono bg-white/5 border border-white/10 text-stone-400 px-2.5 py-1 rounded-[4px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="text-[13px] text-stone-300 leading-relaxed font-mono">
                {beforeYouApply}
              </p>
            </CardContent>
          </Card>

          {/* Section: Projects from your resume they'll care about */}
          {projectEvidence && projectEvidence.length > 0 && (
            <Card className="bg-[#141210] border-white/10 rounded-[4px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-[13px] font-mono text-stone-300 uppercase tracking-wider flex items-center gap-2">
                  <Folder className="w-4 h-4 text-stone-400" weight="regular" />
                  Projects from your resume they'll care about
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {projectEvidence.map((ev, index) => (
                  <div key={index} className="text-[13px] text-stone-300 bg-white/5 border border-white/10 rounded-[4px] p-2.5 font-mono">
                    {ev}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Full Job Description */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px] font-mono text-stone-300 uppercase tracking-wider">
                Full Role Description & Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[13px] text-stone-300 leading-relaxed whitespace-pre-line font-mono bg-white/5 border border-white/10 rounded-[4px] p-4 max-h-80 overflow-y-auto">
                {job.description || 'No extended description available for this role.'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer: Before you hit Apply... */}
        <div className="p-4 sm:p-5 bg-[#141210] border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-[12px] text-stone-400 font-mono">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <Lightning className="w-3.5 h-3.5 text-[#FF4124]" weight="fill" />
              Before you hit Apply...
            </span>
            <span>Check exact requirement evidence</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={handleAnalyseWithClarity}
              icon={Lightning}
              className="w-full sm:flex-1 rounded-[4px] bg-[#FF4124] text-white hover:bg-[#FF4124]/90"
            >
              Analyze with Application Clarity
            </Button>

            {job.originalUrl && (
              <a
                href={job.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ArrowSquareOut}
                  className="w-full rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20"
                >
                  Open Posting
                </Button>
              </a>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
