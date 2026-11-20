import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Buildings, 
  MapPin, 
  Clock, 
  BookmarkSimple, 
  Lightning,
  Check,
  Sparkle
} from '@phosphor-icons/react';

export default function JobCard({
  job,
  onSaveToggle,
  isSaved,
  onOpenDetail,
}) {
  const navigate = useNavigate();

  const formatPublishedAt = (dateString) => {
    if (!dateString) return 'Recently';
    const pubDate = new Date(dateString);
    const diffMs = Date.now() - pubDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const handleAnalyseWithClarity = (e) => {
    e.stopPropagation();
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

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(job);
    }
  };

  const matchScore = job.matchScore || 90;
  const headline = job.friendlyHeadline || (matchScore >= 90 ? "Hey, this one's looking like a good fit for you!" : "Okay, this one looks interesting!");
  const matchingSkills = job.relevance?.matchingSkills || job.skills?.slice(0, 3) || [];
  const whyPicked = job.whyPicked || "Your React skills? Check. Your frontend projects? Check. Your background matches almost everything this team is asking for.";
  const beforeYouApply = job.beforeYouApply || "One small thing to look at before applying: Make sure your GitHub links and portfolio demos are up to date.";

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#141210] text-stone-100 border border-white/10 rounded-[4px] p-5 hover:border-white/20 hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
    >
      <div className="space-y-3.5">
        {/* Friendly Top Shoutout */}
        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
          <span className="text-[11px] font-mono font-medium text-stone-300 flex items-center gap-1.5 truncate">
            <Sparkle className="w-3.5 h-3.5 text-[#FF4124] shrink-0" weight="fill" />
            <span className="truncate">{headline}</span>
          </span>

          <span className="text-[11px] font-mono font-bold bg-white/10 text-white border border-white/15 px-2 py-0.5 rounded-[4px] shrink-0 flex items-center gap-1">
            <Check className="w-3 h-3 text-[#FF4124]" weight="bold" />
            {matchScore}% match
          </span>
        </div>

        {/* Company & Role Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center space-x-2 text-[12px] text-stone-400">
              <span className="font-semibold text-stone-200 flex items-center gap-1.5 truncate">
                <Buildings className="w-3.5 h-3.5 text-stone-400 shrink-0" weight="regular" />
                {job.company}
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1 truncate font-mono text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" weight="regular" />
                {job.location || 'Remote India'}
              </span>
            </div>

            <h3 className="text-[16px] font-bold text-white tracking-tight leading-snug group-hover:text-[#FF4124] transition-colors truncate">
              {job.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSaveToggle) onSaveToggle(job.id || job._id);
            }}
            className={`p-1.5 rounded-[4px] border transition shrink-0 cursor-pointer ${
              isSaved
                ? 'bg-white/20 text-white border-white/40'
                : 'bg-white/5 border-white/10 text-stone-400 hover:text-white hover:bg-white/10'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <BookmarkSimple className="w-4 h-4" weight={isSaved ? 'fill' : 'regular'} />
          </button>
        </div>

        {/* Work Mode & Seniority Tag */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={job.workMode || 'remote'} size="xs">
            {job.workMode || 'Remote'}
          </Badge>
          <span className="text-[11px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-stone-300 px-2 py-0.5 rounded-[4px]">
            {job.employmentType || 'full-time'}
          </span>
        </div>

        {/* Why we picked this for you */}
        <div className="bg-[#1A1816] border border-white/10 rounded-[4px] p-3 text-[12px] text-stone-300 space-y-1 leading-relaxed">
          <span className="font-mono font-bold text-[10px] text-[#FF4124] uppercase tracking-wider block">
            Why we picked this for you
          </span>
          <p className="line-clamp-2 text-stone-300">
            {whyPicked}
          </p>
        </div>

        {/* Good news! They need skills you've already got */}
        {matchingSkills && matchingSkills.length > 0 && (
          <div className="space-y-1.5 pt-0.5">
            <span className="text-[11px] font-mono text-stone-400 block">
              Good news! They need skills you've already got:
            </span>
            <div className="flex flex-wrap gap-1">
              {matchingSkills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="text-[11px] font-mono bg-white/5 text-stone-200 border border-white/10 px-2 py-0.5 rounded-[4px] flex items-center gap-1"
                >
                  <Check className="w-2.5 h-2.5 text-[#FF4124]" weight="bold" />
                  {skill}
                </span>
              ))}
              {matchingSkills.length > 3 && (
                <span className="text-[11px] font-mono text-stone-500 self-center">
                  +{matchingSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* One small thing to look at before applying */}
        <div className="text-[11px] text-stone-400 font-mono pt-0.5 leading-relaxed line-clamp-2">
          {beforeYouApply}
        </div>
      </div>

      {/* Card Footer: Recency & Check Clarity Action */}
      <div className="pt-3.5 mt-3.5 border-t border-white/10 flex items-center justify-between text-[12px]">
        <span className="font-mono text-stone-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" weight="regular" />
          {formatPublishedAt(job.publishedAt)}
        </span>

        <Button
          variant="secondary"
          size="xs"
          onClick={handleAnalyseWithClarity}
          icon={Lightning}
          className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-[4px]"
        >
          Check Clarity
        </Button>
      </div>
    </div>
  );
}
