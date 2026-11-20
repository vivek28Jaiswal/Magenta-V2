import { UserJobRelevance } from '../../models/UserJobRelevance.js';
import { logger } from '../../utils/logger.js';

/**
 * Calculates genuine candidate job relevance and generates friendly,
 * conversational senior-friend feedback (strictly NO emojis).
 */
export const calculateCandidateJobRelevance = async (candidateProfile, job) => {
  // 1. Gather all candidate skills from all categories
  const candidateSkills = [
    ...(candidateProfile?.technicalSkills?.languages || []),
    ...(candidateProfile?.technicalSkills?.frameworks || []),
    ...(candidateProfile?.technicalSkills?.frontend || []),
    ...(candidateProfile?.technicalSkills?.backend || []),
    ...(candidateProfile?.technicalSkills?.databases || []),
    ...(candidateProfile?.technicalSkills?.devTools || []),
  ];

  const candidateSkillsLower = candidateSkills.map(s => (s || '').toLowerCase().trim()).filter(Boolean);
  const jobDescriptionLower = (job.description || '').toLowerCase();
  const jobTitleLower = (job.title || '').toLowerCase();
  const jobSkills = job.skills || [];

  const matchingSkills = [];
  const missingImportantSkills = [];

  // 2. Identify matching skills against job skills list
  jobSkills.forEach(jSkill => {
    const jsLower = jSkill.toLowerCase().trim();
    const hasDirectSkill = candidateSkillsLower.some(
      cs => cs === jsLower || cs.includes(jsLower) || jsLower.includes(cs)
    );
    if (hasDirectSkill) {
      if (!matchingSkills.includes(jSkill)) matchingSkills.push(jSkill);
    } else {
      if (!missingImportantSkills.includes(jSkill)) missingImportantSkills.push(jSkill);
    }
  });

  // Also check if candidate skills appear prominently in JD body text
  candidateSkills.forEach(cSkill => {
    const csLower = (cSkill || '').toLowerCase().trim();
    if (csLower.length > 2 && jobDescriptionLower.includes(csLower)) {
      if (!matchingSkills.includes(cSkill)) {
        matchingSkills.push(cSkill);
      }
    }
  });

  // 3. Project Evidence Audit
  // Check if candidate projects utilized technologies required by this role
  const candidateProjects = candidateProfile?.projects || [];
  const matchingProjects = candidateProjects.filter(p => {
    const techLower = (p.technologies || []).map(t => (t || '').toLowerCase().trim());
    return techLower.some(t => 
      jobSkills.some(js => js.toLowerCase().includes(t) || t.includes(js.toLowerCase())) ||
      jobDescriptionLower.includes(t)
    );
  });

  const relevantExperienceEvidence = matchingProjects.map(
    p => `Project "${p.title}" built with ${(p.technologies || []).slice(0, 3).join(', ')}`
  );

  // 4. Honest Match Calculation
  // Grounded in real skill overlap, practical project evidence, and level fit
  const totalRequired = Math.max(jobSkills.length, 1);
  const matchedSkillCount = Math.min(matchingSkills.length, totalRequired);
  const skillCoverage = matchedSkillCount / totalRequired;

  // Project evidence weighting: real project proof adds strong confidence
  let projectProofScore = 0.4;
  if (matchingProjects.length >= 2) {
    projectProofScore = 1.0;
  } else if (matchingProjects.length === 1) {
    projectProofScore = 0.8;
  }

  // Level & Role alignment check: internships and entry roles give full alignment to freshers/students
  const isFresherOrInternJob = /intern|fresher|entry|graduate|junior|associate/i.test(job.title) || 
    ['internship', 'entry', 'junior'].includes(job.experienceLevel);
  const levelAlignmentScore = isFresherOrInternJob ? 1.0 : 0.65;

  // Weighted honest score: 55% skill coverage, 30% project proof, 15% level alignment
  const rawCalculatedScore = (skillCoverage * 0.55) + (projectProofScore * 0.30) + (levelAlignmentScore * 0.15);
  let matchScore = Math.min(Math.max(Math.round(rawCalculatedScore * 100), 30), 96);

  // If candidate has 3+ matching skills and project proof for a junior/intern role, ensure genuine 90%+
  if (matchingSkills.length >= 3 && matchingProjects.length >= 1 && isFresherOrInternJob) {
    matchScore = Math.max(matchScore, 91);
  }

  // Relevance category mapping
  let relevanceCategory;
  if (matchScore >= 88) {
    relevanceCategory = 'Relevant';
  } else if (matchScore >= 65) {
    relevanceCategory = 'Potentially Relevant';
  } else {
    relevanceCategory = 'Low Relevance';
  }

  // 5. Senior-friend casual, relatable copy (STRICTLY ZERO EMOJIS)
  let friendlyHeadline;
  if (matchScore >= 90) {
    const topHeadlines = [
      "Hey, this one's looking like a good fit for you!",
      "You've got a pretty good shot at this one!",
      "Look what we found for you!"
    ];
    // Deterministic selection based on title length
    friendlyHeadline = topHeadlines[job.title.length % topHeadlines.length];
  } else if (matchScore >= 75) {
    friendlyHeadline = "Okay, this one looks interesting!";
  } else {
    friendlyHeadline = "A bit of a stretch, but could be worth a look";
  }

  // "Why we picked this for you"
  let whyPicked;
  const topMatches = matchingSkills.slice(0, 2);
  if (topMatches.length >= 2 && matchingProjects.length > 0) {
    whyPicked = `Your ${topMatches[0]} skills? Check. Your ${topMatches[1]} projects? Check. Your background matches almost everything this team is asking for.`;
  } else if (topMatches.length >= 1) {
    whyPicked = `Your ${topMatches[0]} skills? Check. You already have practical project work that maps right into what they need.`;
  } else {
    whyPicked = `They build with modern web workflows, which fits your software engineering direction.`;
  }

  // "One small thing to look at before applying"
  let beforeYouApply;
  if (missingImportantSkills.length > 0) {
    const missing = missingImportantSkills.slice(0, 2).join(' and ');
    beforeYouApply = `One small thing to look at before applying: They ask for ${missing}, so review the basics or highlight related concepts in your resume.`;
  } else {
    beforeYouApply = `One small thing to look at before applying: Your core stack matches cleanly. Just make sure your GitHub links and live demos are working before you submit.`;
  }

  const explanation = `${whyPicked} ${beforeYouApply}`;

  return {
    relevanceCategory,
    matchScore,
    friendlyHeadline,
    whyPicked,
    beforeYouApply,
    explanation,
    matchingSkills,
    missingImportantSkills,
    relevantExperienceEvidence,
  };
};

export const getOrCalculateJobRelevance = async (userId, candidateProfile, job) => {
  let relevance = await UserJobRelevance.findOne({ userId, jobId: job._id });

  // Recalculate if relevance missing or lacks new friendly score fields
  if (!relevance || typeof relevance.matchScore !== 'number' || !relevance.friendlyHeadline) {
    const calculated = await calculateCandidateJobRelevance(candidateProfile, job);
    if (relevance) {
      Object.assign(relevance, calculated, { calculatedAt: new Date() });
      await relevance.save();
    } else {
      relevance = await UserJobRelevance.create({
        userId,
        jobId: job._id,
        ...calculated,
        calculatedAt: new Date(),
      });
    }
  }

  return relevance;
};
