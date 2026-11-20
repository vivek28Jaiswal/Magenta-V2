import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ConfirmModal from '../components/ConfirmModal';
import JobDetailDrawer from '../components/JobDetailDrawer';
import toast from 'react-hot-toast';
import { 
  BookmarkSimple, 
  Buildings, 
  MapPin, 
  Trash, 
  Lightning,
  MagnifyingGlass,
} from '@phosphor-icons/react';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [selectedJobForDrawer, setSelectedJobForDrawer] = useState(null);
  const navigate = useNavigate();

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getSavedJobs();
      setSavedJobs(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await jobService.updateApplicationStatus(jobId, newStatus);
      setSavedJobs(savedJobs.map(item => 
        (item.jobId?._id === jobId || item.jobId?.id === jobId)
          ? { ...item, applicationStatus: newStatus }
          : item
      ));
      toast.success(`Application status updated to ${newStatus}`);
    } catch (e) {
      toast.error('Could not update application status.');
    }
  };

  const handleConfirmUnsave = async () => {
    if (!deleteJobId) return;
    try {
      await jobService.unsaveJob(deleteJobId);
      setSavedJobs(savedJobs.filter(item => (item.jobId?._id !== deleteJobId && item.jobId?.id !== deleteJobId)));
      toast.success('Job removed from saved list');
      setDeleteJobId(null);
    } catch (e) {
      toast.error('Could not remove job.');
    }
  };

  const handleAnalyzeWithClarity = (job) => {
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

  const filteredJobs = savedJobs.filter((item) => {
    const job = item.jobId;
    if (!job) return false;
    const matchesQuery = 
      (job.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.applicationStatus === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-white leading-tight">
                Saved Jobs & Pipeline
              </h1>
              <Badge variant="brand" size="xs">
                {savedJobs.length} Tracked
              </Badge>
            </div>
            <p className="text-[14px] text-stone-400">
              Manage saved opportunities, track application statuses, and run clarity diagnostics.
            </p>
          </div>

          <Link to="/jobs">
            <Button variant="secondary" size="sm" className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20">
              Discover More Opportunities
            </Button>
          </Link>
        </div>
      </Card>

      {/* 2. Filter Bar */}
      <Card className="bg-[#141210] border-white/10 rounded-[4px] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <MagnifyingGlass className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved jobs..."
              className="pl-9 bg-white/5 border-white/10 text-white rounded-[4px] text-[14px] focus-visible:border-white/25"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-[13px] w-full sm:w-auto">
            {['all', 'saved', 'applied', 'interviewing', 'offered', 'rejected'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-[4px] capitalize transition cursor-pointer text-[12px] font-medium ${
                  statusFilter === status
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/5 border border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 3. Saved Jobs Grid */}
      {loading ? (
        <div className="space-y-4">
          <Card className="p-6 bg-[#141210] border-white/10 rounded-[4px]"><LoadingSkeleton lines={3} /></Card>
          <Card className="p-6 bg-[#141210] border-white/10 rounded-[4px]"><LoadingSkeleton lines={3} /></Card>
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-[#141210] border-white/10 rounded-[4px]">
          <div className="w-12 h-12 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-stone-400">
            <BookmarkSimple className="w-6 h-6" weight="regular" />
          </div>
          <h3 className="text-[18px] font-bold text-white">
            {searchQuery || statusFilter !== 'all' ? 'No Matching Saved Jobs' : 'No Saved Jobs Yet'}
          </h3>
          <p className="text-[14px] text-stone-400 max-w-md mx-auto">
            Bookmark high-fit roles from your personalized discovery feed to organize your application process.
          </p>
          <Link to="/jobs">
            <Button variant="default" size="sm" className="rounded-[4px]">
              Explore Job Recommendations
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((item) => {
            const job = item.jobId;
            if (!job) return null;
            const jId = job._id || job.id;

            return (
              <Card
                key={item._id}
                className="bg-[#141210] border border-white/10 rounded-[4px] p-5 sm:p-6 transition hover:border-white/25 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h2 
                      onClick={() => setSelectedJobForDrawer(job)}
                      className="text-[18px] font-bold text-white hover:text-stone-300 transition cursor-pointer"
                    >
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-[13px] text-stone-400">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Buildings className="w-4 h-4 text-stone-400" weight="regular" />
                        {job.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" weight="regular" />
                        {job.location || 'Remote'}
                      </span>
                      <span>•</span>
                      <Badge variant={job.workMode || 'remote'} size="xs">
                        {job.workMode || 'Remote'}
                      </Badge>
                    </div>
                  </div>

                  {/* Application Status Dropdown */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[12px] text-stone-400 font-mono">Stage:</span>
                    <select
                      value={item.applicationStatus || 'saved'}
                      onChange={(e) => handleStatusChange(jId, e.target.value)}
                      className="text-[13px] font-medium px-3 py-1.5 border border-white/10 rounded-[4px] bg-[#121110] text-white capitalize cursor-pointer h-9 focus:outline-none focus:border-white/25"
                    >
                      <option value="saved" className="bg-[#141210] text-white">Saved</option>
                      <option value="applied" className="bg-[#141210] text-white">Applied</option>
                      <option value="interviewing" className="bg-[#141210] text-white">Interviewing</option>
                      <option value="offered" className="bg-[#141210] text-white">Offered</option>
                      <option value="rejected" className="bg-[#141210] text-white">Passed / Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[13px]">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="default"
                      size="xs"
                      icon={Lightning}
                      onClick={() => handleAnalyzeWithClarity(job)}
                      className="rounded-[4px]"
                    >
                      Audit with Clarity
                    </Button>

                    <button
                      type="button"
                      onClick={() => setSelectedJobForDrawer(job)}
                      className="text-[13px] text-stone-400 hover:text-white font-medium transition cursor-pointer"
                    >
                      View Full Specs
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteJobId(jId)}
                    className="inline-flex items-center space-x-1 text-[13px] text-stone-400 hover:text-[#FF4124] transition cursor-pointer"
                  >
                    <Trash className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Drawer */}
      <JobDetailDrawer
        job={selectedJobForDrawer}
        isOpen={Boolean(selectedJobForDrawer)}
        isSaved={true}
        onSaveToggle={() => {}}
        onClose={() => setSelectedJobForDrawer(null)}
      />

      {/* Unsave Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteJobId)}
        onClose={() => setDeleteJobId(null)}
        onConfirm={handleConfirmUnsave}
        title="Remove Saved Job"
        message="Are you sure you want to remove this job from your saved tracking pipeline?"
        confirmText="Remove Job"
        variant="destructive"
      />
    </div>
  );
}
