import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { resumeService } from '../services/resumeService';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Textarea } from '../components/ui/textarea';
import toast from 'react-hot-toast';
import { 
  Sparkle, 
  UploadSimple, 
  CheckCircle, 
  WarningCircle, 
  ArrowRight, 
  ShieldCheck, 
  FilePdf,
  FileDoc,
  Image as ImageIcon,
  SpinnerGap
} from '@phosphor-icons/react';

export default function OnboardingPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('upload'); // 'upload' | 'paste'
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('idle'); // idle | uploading | extracting | analyzing | saving | review | completed | error
  const [errorMessage, setErrorMessage] = useState('');
  const [extractedResume, setExtractedResume] = useState(null);

  useEffect(() => {
    if (user?.onboardingCompleted && currentStep === 'idle') {
      navigate('/dashboard', { replace: true });
    }
  }, [user?.onboardingCompleted, navigate, currentStep]);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err.code === 'file-too-large') {
        toast.error('File exceeds maximum size of 15MB.');
      } else {
        toast.error('Unsupported format. Please upload PDF, DOCX, DOC, JPG, PNG, or WebP.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setErrorMessage('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select a resume file first.');
      return;
    }

    try {
      setCurrentStep('uploading');
      setErrorMessage('');

      const uploadTimer = setTimeout(() => setCurrentStep('extracting'), 1000);
      const analysisTimer = setTimeout(() => setCurrentStep('analyzing'), 2800);

      const response = await resumeService.uploadResume(selectedFile, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      clearTimeout(uploadTimer);
      clearTimeout(analysisTimer);

      const resumeData = response.resume || response;
      setExtractedResume(resumeData);
      setCurrentStep('review');
      await refreshUser();
      toast.success('Resume extracted and analyzed into structured facets!');
    } catch (err) {
      console.error(err);
      setCurrentStep('error');
      const msg = err.response?.data?.message || err.message || 'Failed to process resume. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handlePasteAndAnalyze = async () => {
    if (!pastedText || pastedText.trim().length < 40) {
      toast.error('Please paste your resume text (at least 40 characters).');
      return;
    }

    try {
      setCurrentStep('extracting');
      setErrorMessage('');
      const analysisTimer = setTimeout(() => setCurrentStep('analyzing'), 1200);

      const response = await resumeService.pasteResumeText(pastedText.trim(), 'Pasted_Candidate_Resume.txt');
      clearTimeout(analysisTimer);

      const resumeData = response.resume || response;
      setExtractedResume(resumeData);
      setCurrentStep('review');
      await refreshUser();
      toast.success('Resume text analyzed into structured facets!');
    } catch (err) {
      console.error(err);
      setCurrentStep('error');
      const msg = err.response?.data?.message || err.message || 'Failed to process resume text.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleProceedToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Onboarding Welcome Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FF4124]/10 border border-[#FF4124]/20 rounded-[4px] text-[12px] font-mono font-semibold text-[#FF4124]">
          <Sparkle className="w-3.5 h-3.5" weight="fill" />
          <span>ONBOARDING STEP 1 OF 2</span>
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
          Welcome to Magenta, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-[14px] text-stone-400 leading-relaxed max-w-xl mx-auto">
          Magenta extracts your achievements, engineering stack, scale metrics, and credentials without inventing data. Upload in any format: PDF, Word, or image scan.
        </p>
      </div>

      {/* 2. Main Workbench Card */}
      <Card className="w-full max-w-3xl mx-auto overflow-hidden bg-[#141210] border-white/10 rounded-[4px]">
        {/* State: Review Extracted Facets */}
        {currentStep === 'review' && extractedResume ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-[4px] bg-white/10 text-white border border-white/15 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" weight="bold" />
                </div>
                <div>
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
                    Structured Profile Extraction Review
                  </h3>
                  <p className="text-[12px] text-stone-400">
                    Verified deterministic extraction from {extractedResume.metadata?.originalFilename || 'uploaded document'}
                  </p>
                </div>
              </div>
              <Badge variant="verified">
                Confidence: {extractedResume.structuredProfile?.completenessCheck?.overallConfidence || 'High'}
              </Badge>
            </div>

            {(() => {
              const candProf = extractedResume.structuredProfile?.professionalProfile || extractedResume.structuredProfile?.profile || {};
              const cName = candProf.fullName || candProf.name || user?.name || 'Verified Candidate';
              const cHeadline = candProf.headline || candProf.currentRole || 'Engineering Candidate';
              const cEmail = candProf.email || user?.email;
              const cPhone = candProf.phone;
              const rawT = extractedResume.structuredProfile?.technicalSkills || {};
              const stringSkills = Object.entries(rawT)
                .filter(([cat]) => cat !== 'skillContexts')
                .flatMap(([cat, skills]) =>
                  (Array.isArray(skills) ? skills : []).filter(s => typeof s === 'string' && s.trim())
                );

              return (
                <>
                  {/* Extracted Profile Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                    <div className="bg-[#121110] border border-white/10 rounded-[4px] p-4 space-y-1.5">
                      <span className="font-mono text-[11px] text-stone-400 uppercase tracking-wider block">Candidate Identity</span>
                      <div className="font-bold text-white text-[15px]">{cName}</div>
                      <div className="text-stone-300">{cEmail}</div>
                      {cPhone && (
                        <div className="text-stone-400">{cPhone}</div>
                      )}
                    </div>

                    <div className="bg-[#121110] border border-white/10 rounded-[4px] p-4 space-y-1.5">
                      <span className="font-mono text-[11px] text-stone-400 uppercase tracking-wider block">Target Specialty & Level</span>
                      <div className="font-bold text-white text-[15px]">
                        {cHeadline}
                      </div>
                      <div className="text-stone-300">
                        {extractedResume.structuredProfile?.workExperience?.length || 0} Work Roles Extracted
                      </div>
                      <div className="text-stone-400">
                        {extractedResume.structuredProfile?.education?.length || 0} Educational Credentials
                      </div>
                    </div>
                  </div>

                  {/* Skills Matrix Preview */}
                  <div className="space-y-3">
                    <span className="text-[13px] font-bold text-white uppercase tracking-wider font-mono block">
                      Extracted Skills & Facets ({stringSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stringSkills.length > 0 ? (
                        stringSkills.slice(0, 30).map((skill, i) => (
                          <span key={i} className="text-[12px] bg-white/5 text-stone-200 border border-white/10 px-2.5 py-1 rounded-[4px] font-mono">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[13px] text-stone-400">Core technical stack extracted.</span>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Flagged issues if any */}
            {extractedResume.structuredProfile?.completenessCheck?.flaggedIssues?.length > 0 && (
              <div className="bg-white/5 border border-white/15 rounded-[4px] p-4 space-y-2 text-[13px] text-stone-300">
                <div className="flex items-center space-x-2 font-semibold text-white">
                  <WarningCircle className="w-5 h-5 text-[#FF4124]" weight="regular" />
                  <span>Quality & Completeness Notes:</span>
                </div>
                <ul className="list-disc list-inside text-stone-400 space-y-1">
                  {extractedResume.structuredProfile.completenessCheck.flaggedIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Proceed Action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('idle')}
                className="text-[13px] text-stone-400 hover:text-white underline cursor-pointer"
              >
                Upload different file
              </button>
              <Button
                variant="default"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                onClick={handleProceedToDashboard}
                className="rounded-[4px]"
              >
                Proceed to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          /* State: Idle / Uploading / Extracting */
          <div>
            {/* Mode Tabs */}
            <div className="p-3 bg-[#121110] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setMode('upload')}
                  className={`px-3 py-1.5 rounded-[4px] text-[13px] font-semibold transition cursor-pointer ${
                    mode === 'upload' ? 'bg-white text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setMode('paste')}
                  className={`px-3 py-1.5 rounded-[4px] text-[13px] font-semibold transition cursor-pointer ${
                    mode === 'paste' ? 'bg-white text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Paste Text
                </button>
              </div>

              <div className="text-[11px] text-stone-400 font-mono hidden sm:block">
                Tesseract OCR + Semantic Facet Engine
              </div>
            </div>

            {/* Processing State Overlay */}
            {['uploading', 'extracting', 'analyzing', 'saving'].includes(currentStep) ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-[4px] bg-white/10 text-white flex items-center justify-center mx-auto">
                  <SpinnerGap className="w-6 h-6 animate-spin" weight="bold" />
                </div>
                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="text-[18px] font-bold text-white">
                    {currentStep === 'uploading' && `Uploading document (${uploadProgress}%)...`}
                    {currentStep === 'extracting' && 'Extracting text & running OCR analysis...'}
                    {currentStep === 'analyzing' && 'Synthesizing 40+ engineering facets & citations...'}
                    {currentStep === 'saving' && 'Saving your verified profile matrix...'}
                  </h3>
                  <Progress value={currentStep === 'uploading' ? uploadProgress : currentStep === 'extracting' ? 50 : 85} />
                  <p className="text-[13px] text-stone-400 pt-1">
                    Every technology, role, date, and metric is being cross-referenced deterministically.
                  </p>
                </div>
              </div>
            ) : mode === 'upload' ? (
              <div className="p-6 sm:p-8 space-y-6">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-[4px] p-8 text-center transition cursor-pointer ${
                    isDragActive
                      ? 'border-[#FF4124] bg-white/10'
                      : selectedFile
                      ? 'border-white/30 bg-white/5'
                      : 'border-white/15 hover:border-[#FF4124] bg-white/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-12 h-12 rounded-[4px] bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-3 text-white">
                    <UploadSimple className="w-6 h-6" weight="regular" />
                  </div>
                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="text-[15px] font-bold text-white">{selectedFile.name}</p>
                      <p className="text-[12px] text-stone-400 font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-[15px] font-semibold text-white">
                        Drag and drop your resume here, or <span className="text-[#FF4124] underline font-bold">browse files</span>
                      </p>
                      <p className="text-[13px] text-stone-400">
                        Supports PDF, Word DOCX/DOC, and images (JPG, PNG, WebP) up to 15MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Format Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-[13px] text-stone-400">
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-[4px] border border-white/10">
                    <FilePdf className="w-4 h-4 text-stone-300" weight="regular" />
                    <span>PDF (Digital & Scanned)</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-[4px] border border-white/10">
                    <FileDoc className="w-4 h-4 text-stone-300" weight="regular" />
                    <span>Word (DOCX/DOC)</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-[4px] border border-white/10">
                    <ImageIcon className="w-4 h-4 text-stone-300" weight="regular" />
                    <span>OCR Images (PNG/JPG)</span>
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Button
                    variant="default"
                    size="md"
                    disabled={!selectedFile}
                    onClick={handleUploadAndAnalyze}
                    icon={ArrowRight}
                    iconPosition="right"
                    className="rounded-[4px]"
                  >
                    Analyze and Extract Profile
                  </Button>
                </div>
              </div>
            ) : (
              /* Paste Text Mode */
              <div className="p-6 sm:p-8 space-y-4">
                <label className="block text-[13px] font-semibold text-stone-300">
                  Paste Full Resume Content
                </label>
                <Textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  rows={8}
                  placeholder="Paste your resume text here (including career dates, technical proficiencies, roles, and bullet points)..."
                  className="bg-[#0C0B0A] border-white/10 text-stone-100 text-[14px] placeholder:text-stone-600 rounded-[4px]"
                />
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[12px] font-mono text-stone-400">
                    {pastedText.length.toLocaleString()} characters
                  </span>
                  <Button
                    variant="default"
                    size="md"
                    disabled={pastedText.trim().length < 40}
                    onClick={handlePasteAndAnalyze}
                    icon={ArrowRight}
                    iconPosition="right"
                    className="rounded-[4px]"
                  >
                    Analyze Text
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Trust Guarantee Footer */}
      <div className="text-center text-[13px] text-stone-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-white" weight="regular" />
        <span>Your resume is encrypted and used only for your deterministic career clarity.</span>
      </div>
    </div>
  );
}
