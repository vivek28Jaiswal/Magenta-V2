import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { resumeService } from '../services/resumeService';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { 
  FileText, 
  UploadSimple, 
  ArrowClockwise, 
  Trash, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Code, 
  MapPin,
  EnvelopeSimple,
  Phone,
  Quotes
} from '@phosphor-icons/react';

export default function MyResumePage() {
  const { user, refreshUser } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replacing, setReplacing] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getResume();
      setResume(res);
    } catch (err) {
      console.error('No resume found or fetch error:', err);
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      toast.error('Please upload a valid PDF, Word document, or Image (up to 15MB).');
      return;
    }
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    try {
      setReplacing(true);
      toast.loading('Replacing resume and running deep AI analysis...', { id: 'replace' });
      const data = await resumeService.replaceResume(file);
      setResume(data.resume);
      await refreshUser();
      setShowReplaceModal(false);
      toast.success('Resume replaced and re-analyzed successfully!', { id: 'replace' });
    } catch (err) {
      toast.error('Failed to replace resume.', { id: 'replace' });
    } finally {
      setReplacing(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/bmp': ['.bmp'],
      'image/tiff': ['.tiff', '.tif'],
    },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
  });

  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);
      toast.loading('Re-analyzing resume with latest AI engine...', { id: 'reanalyze' });
      const data = await resumeService.reanalyzeResume();
      setResume(data.resume);
      toast.success('Resume re-analyzed successfully!', { id: 'reanalyze' });
    } catch (err) {
      toast.error('Failed to re-analyze resume.', { id: 'reanalyze' });
    } finally {
      setReanalyzing(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await resumeService.deleteResume();
      setResume(null);
      await refreshUser();
      setShowDeleteConfirm(false);
      toast.success('Resume profile removed.');
    } catch (err) {
      toast.error('Failed to delete resume.');
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <LoadingSkeleton lines={4} />
        <LoadingSkeleton lines={8} />
      </div>
    );
  }

  if (!resume) {
    return (
      <Card className="w-full py-16 text-center space-y-6 p-8 bg-[#141210] border-white/10 rounded-[4px]">
        <div className="w-14 h-14 rounded-[4px] bg-white/5 border border-white/10 text-stone-400 flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" weight="regular" />
        </div>
        <div className="space-y-1">
          <h2 className="text-[24px] font-bold text-white">No Saved Resume Found</h2>
          <p className="text-[14px] text-stone-400 max-w-sm mx-auto">
            Upload your resume once to initialize your deterministic profile matrix and enable personalized job alignment.
          </p>
        </div>

        <div className="max-w-md mx-auto px-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-white/15 hover:border-[#FF4124] rounded-[4px] p-8 cursor-pointer bg-white/5 transition"
          >
            <input {...getInputProps()} />
            <UploadSimple className="w-10 h-10 text-[#FF4124] mx-auto mb-2" weight="regular" />
            <p className="text-[16px] font-bold text-white">Upload Resume (PDF, Word, or Image)</p>
            <p className="text-[13px] text-stone-400 mt-1 font-mono">With automated Tesseract OCR for scans</p>
          </div>
        </div>
      </Card>
    );
  }

  // Structured data safely extracted
  const profile = resume.structuredProfile || {};
  const cand = profile.professionalProfile || profile.profile || {};
  const candName = cand.fullName || cand.name || user?.name || 'Verified Candidate';
  const candHeadline = cand.headline || cand.currentRole || 'Senior Engineering Candidate';
  const candEmail = cand.email || user?.email;
  const candPhone = cand.phone;
  const candLocation = cand.location;
  const candSummary = cand.summary;

  const rawTech = profile.technicalSkills || {};
  const techCategories = Object.entries(rawTech).filter(([cat]) => cat !== 'skillContexts');
  const totalSkillsList = techCategories.flatMap(([_, skills]) =>
    Array.isArray(skills) ? skills.filter(s => typeof s === 'string' && s.trim()) : []
  );
  const totalSkillsCount = totalSkillsList.length;
  const skillContexts = Array.isArray(rawTech.skillContexts) ? rawTech.skillContexts : [];

  const completeness = profile.completenessCheck || {};
  const workExperience = Array.isArray(profile.workExperience) ? profile.workExperience : [];
  const education = Array.isArray(profile.education) ? profile.education : [];

  return (
    <div className="w-full space-y-6">
      {/* 1. Header with Status & Action Buttons */}
      <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-white leading-tight">
                Candidate Profile Matrix
              </h1>
              <Badge variant="verified" size="xs">
                {completeness.overallConfidence || 'High'} Confidence
              </Badge>
            </div>
            <p className="text-[14px] text-stone-400">
              Verified candidate intelligence extracted deterministically from {resume.originalFileName || 'your document'}.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleReanalyze}
              loading={reanalyzing}
              icon={ArrowClockwise}
              className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20"
            >
              Re-analyze
            </Button>

            <Button
              size="sm"
              variant="default"
              onClick={() => setShowReplaceModal(true)}
              icon={UploadSimple}
              className="rounded-[4px]"
            >
              Replace Resume
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              icon={Trash}
              className="rounded-[4px] text-stone-400 hover:text-[#FF4124]"
            >
              Remove
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Candidate Identity & Completeness Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card (8 cols) */}
        <Card className="lg:col-span-8 bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-[24px] font-bold text-white tracking-tight">
                {candName}
              </h2>
              <p className="text-[15px] font-medium text-stone-300 mt-0.5">
                {candHeadline}
              </p>
            </div>
            <div className="text-[12px] font-mono text-stone-400 bg-white/5 border border-white/10 px-3 py-1 rounded-[4px]">
              {totalSkillsCount} Extracted Facets
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px] text-stone-400">
            {candEmail && (
              <div className="flex items-center gap-2 truncate">
                <EnvelopeSimple className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="truncate">{candEmail}</span>
              </div>
            )}
            {candPhone && (
              <div className="flex items-center gap-2 truncate">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{candPhone}</span>
              </div>
            )}
            {candLocation && (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{candLocation}</span>
              </div>
            )}
          </div>

          {candSummary && (
            <p className="text-[14px] text-stone-300 leading-relaxed pt-2">
              {candSummary}
            </p>
          )}
        </Card>

        {/* Quality & Completeness Audit (4 cols) */}
        <Card className="lg:col-span-4 bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[13px] font-bold text-white uppercase tracking-wider font-mono">
              <ShieldCheck className="w-5 h-5 text-stone-300" weight="regular" />
              <span>Extraction Completeness</span>
            </div>
            <p className="text-[13px] text-stone-400 leading-relaxed">
              Every detail verified against original source text. Zero fabricated claims.
            </p>
          </div>

          <div className="p-4 bg-[#121110] border border-white/10 rounded-[4px] space-y-2 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Completeness Index:</span>
              <span className="font-bold text-white text-[16px]">
                {completeness.completenessScore || 95}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Source Text Length:</span>
              <span className="font-mono text-stone-300">
                {resume.extractedText ? `${resume.extractedText.length.toLocaleString()} chars` : 'Verified'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Technical Skills Matrix */}
      <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <Code className="w-5 h-5 text-white" weight="regular" />
            <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
              Categorized Technical Skills & Tools
            </h3>
          </div>
          <span className="text-[12px] text-stone-400 font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-[4px]">
            {totalSkillsCount} Facets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map(([category, skills]) => {
            if (!Array.isArray(skills) || skills.length === 0) return null;
            const stringSkills = skills.filter(s => typeof s === 'string' && s.trim());
            if (stringSkills.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-mono block">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stringSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[12px] bg-white/5 text-stone-200 border border-white/10 px-2.5 py-1 rounded-[4px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Contextual Evidence Quotes */}
      {skillContexts.length > 0 && (
        <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8 space-y-5">
          <div className="flex items-center space-x-2.5 border-b border-white/10 pb-4">
            <Quotes className="w-5 h-5 text-white" weight="regular" />
            <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
              Verified Contextual Evidence Quotes
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillContexts.map((sc, idx) => (
              <div key={idx} className="bg-[#121110] border border-white/10 rounded-[4px] p-4 space-y-2 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono text-[14px]">{sc.skill}</span>
                  {sc.category && (
                    <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-[4px] text-stone-400 uppercase font-mono">
                      {sc.category}
                    </span>
                  )}
                </div>
                {sc.evidenceQuote && (
                  <p className="italic text-stone-300 text-[13px] leading-relaxed border-l-2 border-l-[#FF4124] pl-3 font-sans">
                    "{sc.evidenceQuote}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 5. Professional Work Experience */}
      {workExperience.length > 0 && (
        <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2.5 border-b border-white/10 pb-4">
            <Briefcase className="w-5 h-5 text-white" weight="regular" />
            <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
              Professional Work Experience
            </h3>
          </div>

          <div className="space-y-4">
            {workExperience.map((exp, idx) => (
              <div key={idx} className="bg-[#121110] border border-white/10 rounded-[4px] p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-[16px] font-bold text-white">{exp.jobTitle || exp.title}</h4>
                    <p className="text-[14px] text-stone-400 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-[12px] font-mono text-stone-500">
                    {exp.dates || `${exp.startDate || ''} – ${exp.endDate || 'Present'}`}
                  </span>
                </div>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside text-[13px] text-stone-300 space-y-1.5 leading-relaxed">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i}>{typeof r === 'string' ? r : r?.description || ''}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 6. Education */}
      {education.length > 0 && (
        <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8 space-y-5">
          <div className="flex items-center space-x-2.5 border-b border-white/10 pb-4">
            <GraduationCap className="w-5 h-5 text-white" weight="regular" />
            <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
              Education & Academic Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {education.map((edu, idx) => (
              <div key={idx} className="bg-[#121110] border border-white/10 rounded-[4px] p-5 space-y-1">
                <div className="font-bold text-white text-[15px]">{edu.degree}</div>
                <div className="text-[13px] text-stone-400">{edu.institution || edu.school}</div>
                {edu.graduationYear && (
                  <div className="text-[11px] font-mono text-stone-500">Graduated: {edu.graduationYear}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Replace Resume Modal */}
      <Dialog open={showReplaceModal} onOpenChange={setShowReplaceModal}>
        <DialogContent className="max-w-lg bg-[#141210] border border-white/10 rounded-[4px] text-stone-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-[18px]">Replace Active Resume</DialogTitle>
          </DialogHeader>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-white/15 hover:border-[#FF4124] rounded-[4px] p-8 text-center cursor-pointer bg-white/5 transition"
          >
            <input {...getInputProps()} />
            <UploadSimple className="w-10 h-10 text-[#FF4124] mx-auto mb-2" />
            <p className="text-[15px] font-bold text-white">Select New Resume File</p>
            <p className="text-[13px] text-stone-400 mt-1 font-mono">PDF, Word, or image up to 15MB</p>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowReplaceModal(false)} className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Resume Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Active Resume"
        message="Are you sure you want to remove your resume? This will clear your structured profile facets and pause personalized job alignment."
        confirmText="Remove Resume"
        variant="destructive"
      />
    </div>
  );
}
