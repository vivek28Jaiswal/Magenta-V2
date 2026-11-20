import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import LoadingSkeleton from '../components/LoadingSkeleton';
import JobDetailDrawer from '../components/JobDetailDrawer';
import DiscoveryPreferencesModal from '../components/DiscoveryPreferencesModal';
import ErrorState from '../components/ErrorState';
import toast from 'react-hot-toast';
import { 
  Sparkle, 
  MagnifyingGlass, 
  SlidersHorizontal, 
  MapPin, 
  Check,
  Lightning,
  Clock,
  ArrowRight,
  FileText
} from '@phosphor-icons/react';

export default function JobsDiscoveryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [hasResume, setHasResume] = useState(true);
  const [timeframe, setTimeframe] = useState('24h'); // '24h' | '3d'
  const [workMode, setWorkMode] = useState('all');
  const [fitFilter, setFitFilter] = useState('all'); // 'all' | 'strong'
  const [searchRole, setSearchRole] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Modals & Drawer State
  const [selectedJobForDrawer, setSelectedJobForDrawer] = useState(null);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setHasError(false);
      const data = await jobService.getRecommendations({
        timeframe,
        workMode: workMode !== 'all' ? workMode : undefined,
        fit: fitFilter !== 'all' ? fitFilter : undefined,
        role: searchRole.trim() || undefined,
        location: searchLocation.trim() || undefined,
      });

      if (data.hasResume === false) {
        setHasResume(false);
        setJobs([]);
      } else {
        setHasResume(true);
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error(err);
      setHasError(true);
      toast.error('Could not load jobs feed right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [timeframe, workMode, fitFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleSaveToggle = async (jobId) => {
    try {
      const currentJob = jobs.find(j => (j.id || j._id) === jobId);
      if (currentJob?.savedStatus) {
        await jobService.unsaveJob(jobId);
        setJobs(jobs.map(j => (j.id || j._id) === jobId ? { ...j, savedStatus: null } : j));
        toast.success('Removed from saved list');
      } else {
        await jobService.saveJob(jobId);
        setJobs(jobs.map(j => (j.id || j._id) === jobId ? { ...j, savedStatus: 'saved' } : j));
        toast.success('Saved to your pipeline');
      }
    } catch (err) {
      toast.error('Could not update saved job status.');
    }
  };

  const highFitCount = jobs.filter(j => (j.matchScore || 0) >= 90).length;

  return (
    <div className="w-full space-y-6">
      {/* 1. Playful Hero Header */}
      <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF4124] flex items-center gap-1 font-bold">
                <Sparkle className="w-3.5 h-3.5" weight="fill" />
                Jobs picked just for you
              </span>
            </div>

            <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-white leading-tight">
              Look what we found for you!
            </h1>

            <p className="text-[14px] text-stone-300 leading-relaxed">
              I checked out your profile and found a few jobs you might actually like. Honest matches only, no fake scores or keyword stuffing.
            </p>
          </div>

          {/* Timeframe Pill Switcher */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-[4px] text-[12px] font-mono">
              <button
                type="button"
                onClick={() => setTimeframe('24h')}
                className={`px-3 py-1.5 rounded-[4px] transition cursor-pointer ${
                  timeframe === '24h'
                    ? 'bg-white text-black font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Fresh (Last 24h)
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('3d')}
                className={`px-3 py-1.5 rounded-[4px] transition cursor-pointer ${
                  timeframe === '3d'
                    ? 'bg-white text-black font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Last 3 Days
              </button>
            </div>
          </div>
        </div>

        {/* Stats summary banner */}
        {hasResume && !loading && jobs.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[12px] font-mono text-stone-400">
            <div className="flex items-center gap-2 text-stone-300">
              <Check className="w-4 h-4 text-[#FF4124]" weight="bold" />
              <span>
                Found <strong className="text-white font-bold">{jobs.length}</strong> real openings ({highFitCount} with 90%+ match for your stack).
              </span>
            </div>

            <span className="text-stone-400">
              Targeted to Indian tech teams & remote hubs
            </span>
          </div>
        )}
      </Card>

      {/* 2. Search & Filter Bar */}
      <div className="bg-[#141210] border border-white/10 rounded-[4px] p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search by Role / Skill */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <MagnifyingGlass className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Filter by role or tech (e.g. React, Frontend, Fresher)..."
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="pl-9 text-[13px] bg-white/5 border-white/10 text-white rounded-[4px] focus-visible:border-white/25"
            />
          </div>

          <div className="relative sm:w-60">
            <MapPin className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="City or Remote..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="pl-9 text-[13px] bg-white/5 border-white/10 text-white rounded-[4px] focus-visible:border-white/25"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20 text-[13px]"
          >
            Search
          </Button>
        </form>

        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
          {/* Fit Filter */}
          <div className="flex items-center p-0.5 bg-white/5 border border-white/10 rounded-[4px] text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setFitFilter('all')}
              className={`px-2.5 py-1 rounded-[4px] transition cursor-pointer ${
                fitFilter === 'all'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              All Matches
            </button>
            <button
              type="button"
              onClick={() => setFitFilter('strong')}
              className={`px-2.5 py-1 rounded-[4px] transition cursor-pointer flex items-center gap-1 ${
                fitFilter === 'strong'
                  ? 'bg-[#FF4124] text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Check className="w-3 h-3" weight="bold" />
              90%+ Fit
            </button>
          </div>

          {/* Work Mode Switcher */}
          <div className="flex items-center p-0.5 bg-white/5 border border-white/10 rounded-[4px] text-[11px] font-mono">
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'remote', label: 'Remote' },
              { id: 'hybrid', label: 'Hybrid' },
              { id: 'in-office', label: 'Office' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setWorkMode(id)}
                className={`px-2.5 py-1 rounded-[4px] transition cursor-pointer ${
                  workMode === id
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Preferences Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPreferencesModalOpen(true)}
            icon={SlidersHorizontal}
            className="rounded-[4px] bg-white/5 border-white/10 text-stone-300 hover:text-white text-[12px]"
          >
            Tune radar
          </Button>
        </div>
      </div>

      {/* 3. Job Feed States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-64 rounded-[4px] bg-[#141210] border border-white/10" />
          ))}
        </div>
      ) : hasError ? (
        <ErrorState
          title="Could not load jobs feed"
          description="We had trouble talking to the server. Check your connection or try again."
          onRetry={fetchJobs}
        />
      ) : !hasResume ? (
        /* Friendly Empty State: User hasn't uploaded resume yet */
        <Card className="bg-[#141210] border-white/10 rounded-[4px] p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FF4124]/10 border border-[#FF4124]/30 text-[#FF4124] flex items-center justify-center mx-auto">
            <Sparkle className="w-6 h-6" weight="fill" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[20px] font-bold text-white tracking-tight">
              Your next opportunity might be here!
            </h3>
            <p className="text-[14px] text-stone-300 leading-relaxed">
              I need to see what you've built first! Drop your resume or paste your projects, and I'll find Indian internships, fresher openings, and junior roles that match what you actually know.
            </p>
          </div>

          <Button
            variant="default"
            size="md"
            onClick={() => navigate('/profile')}
            icon={FileText}
            className="rounded-[4px] bg-[#FF4124] text-white hover:bg-[#FF4124]/90 mx-auto"
          >
            Add Your Resume to Get Matched
          </Button>
        </Card>
      ) : jobs.length === 0 ? (
        /* Honest Empty State: No jobs in this window */
        <Card className="bg-[#141210] border-white/10 rounded-[4px] p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-stone-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" weight="regular" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[18px] font-bold text-white tracking-tight">
              Nothing matching right now
            </h3>
            <p className="text-[13px] text-stone-400 leading-relaxed font-mono">
              I checked out your profile, but honestly couldn't find enough high-fit openings in this window. Rather than showing you random listings that waste your time, try switching to the 3-day feed or tweaking your filters!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {timeframe === '24h' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setTimeframe('3d')}
                className="rounded-[4px] bg-[#FF4124] text-white hover:bg-[#FF4124]/90"
              >
                Check Last 3 Days
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setWorkMode('all');
                setFitFilter('all');
                setSearchRole('');
                setSearchLocation('');
              }}
              className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20"
            >
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : (
        /* Main 12-Column Responsive Jobs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard
              key={job.id || job._id}
              job={job}
              isSaved={job.savedStatus === 'saved'}
              onSaveToggle={handleSaveToggle}
              onOpenDetail={(target) => setSelectedJobForDrawer(target)}
            />
          ))}
        </div>
      )}

      {/* 4. Inspection Drawer for Detailed Role Breakdown */}
      <JobDetailDrawer
        job={selectedJobForDrawer}
        isOpen={Boolean(selectedJobForDrawer)}
        onClose={() => setSelectedJobForDrawer(null)}
        isSaved={selectedJobForDrawer?.savedStatus === 'saved'}
        onSaveToggle={handleSaveToggle}
      />

      {/* 5. Preferences Modal */}
      <DiscoveryPreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        onSave={async () => {
          await fetchJobs();
        }}
      />
    </div>
  );
}
