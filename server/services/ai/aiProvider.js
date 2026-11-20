import { logger } from '../../utils/logger.js';
import { callGeminiStructured } from './geminiProvider.js';
import { callOpenAIStructured } from './openaiProvider.js';
import {
  fallbackParseResume,
  fallbackAnalyzeJobDescription,
  fallbackCompareApplication,
} from './fallbackProvider.js';
import {
  resumeProfileSchema,
  jobDescriptionAnalysisSchema,
  applicationClaritySchema,
} from './schemas.js';

export const analyzeResumeAI = async (resumeText, metadata = {}) => {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  const systemPrompt = `You are an expert technical resume parser and career intelligence system.
Analyze the provided resume text thoroughly across every section, page, and bullet point.
Return a structured candidate profile in valid JSON matching this schema:
{
  "professionalProfile": {
    "fullName": string or null,
    "headline": string or null,
    "currentRole": string or null,
    "summary": string or null,
    "preferredRoles": string[],
    "location": string or null,
    "email": string or null,
    "phone": string or null,
    "links": string[]
  },
  "technicalSkills": {
    "languages": string[],
    "frameworks": string[],
    "frontend": string[],
    "backend": string[],
    "databases": string[],
    "cloudDevOps": string[],
    "aiMachineLearning": string[],
    "designTools": string[],
    "devTools": string[],
    "testingQa": string[],
    "other": string[],
    "skillContexts": [
      {
        "skill": string,
        "category": string,
        "contextFound": string,
        "evidenceQuote": string
      }
    ]
  },
  "softSkills": [
    {
      "name": string,
      "evidenceQuote": string
    }
  ],
  "workExperience": [
    {
      "company": string,
      "jobTitle": string,
      "dates": string,
      "duration": string,
      "location": string,
      "employmentType": string,
      "responsibilities": string[],
      "technologies": string[],
      "achievements": string[],
      "evidenceQuotes": string[]
    }
  ],
  "projects": [
    {
      "title": string,
      "description": string,
      "technologies": string[],
      "contribution": string,
      "outcomes": string,
      "measurableAchievements": string,
      "liveUrl": string,
      "evidenceQuotes": string[]
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "graduationYear": string,
      "dates": string,
      "academicInfo": string,
      "gpaOrGrade": string,
      "honors": string[]
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string,
      "date": string,
      "credentialId": string
    }
  ],
  "additional": {
    "awards": string[],
    "achievements": string[],
    "languages": string[],
    "activities": string[]
  },
  "completenessCheck": {
    "completenessScore": number (0 to 100),
    "overallRating": "complete" | "adequate" | "partially_unreadable" | "missing_critical_info",
    "missingSections": string[],
    "flaggedIssues": [
      {
        "section": string,
        "issue": string,
        "recommendation": string,
        "severity": "warning" | "info" | "critical"
      }
    ],
    "extractionNotes": string
  }
}

CRITICAL RULES:
1. Extract supporting evidence quotes from the original resume for every major skill, project, and experience.
2. ZERO FABRICATED INFORMATION. Do NOT invent skills, dates, companies, or accomplishments. If not found, use null or empty array.
3. Preserve the exact context in which each technology or skill was used.
4. Perform completeness check: if any section is unclear, flag it clearly.`;

  const userPrompt = `Here is the candidate resume text (Metadata: ${JSON.stringify(metadata)}):\n\n${resumeText}`;

  if (hasGemini && (provider === 'gemini' || !provider)) {
    try {
      const raw = await callGeminiStructured({ systemPrompt, userPrompt });
      return resumeProfileSchema.parse(raw);
    } catch (err) {
      logger.warn(`Gemini resume analysis failed (${err.message}). Using intelligent local fallback engine.`);
    }
  } else if (hasOpenAI && (provider === 'openai' || !provider)) {
    try {
      const raw = await callOpenAIStructured({ systemPrompt, userPrompt });
      return resumeProfileSchema.parse(raw);
    } catch (err) {
      logger.warn(`OpenAI resume analysis failed (${err.message}). Using intelligent local fallback engine.`);
    }
  }

  // Fallback
  const fallbackResult = fallbackParseResume(resumeText, metadata);
  return resumeProfileSchema.parse(fallbackResult);
};

export const analyzeJobDescriptionAI = async (jdText, details = {}) => {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  const systemPrompt = `You are Magenta's Job Description Intelligence Engine.
Analyze the provided Job Description (JD). Extract its expectations, classify requirements into:
- Mandatory: ONLY when employer explicitly states required, essential, must-have, minimum X years, etc.
- Preferred: ONLY when employer states preferred, nice-to-have, bonus, plus, beneficial, desirable.
- Unclear: Skills or tools mentioned without clearly defined priority.
- Contradictory: Conflicts in the JD (e.g. entry level asking for 5 years).

Do NOT decide if a candidate is qualified. Return valid JSON matching this schema:
{
  "overview": {
    "title": string,
    "company": string,
    "location": string,
    "employmentType": string,
    "experienceExpectations": string,
    "educationExpectations": string,
    "summary": string
  },
  "mandatoryRequirements": [{ "name": string, "category": string, "evidenceInJD": string, "explanation": string }],
  "preferredRequirements": [{ "name": string, "category": string, "evidenceInJD": string, "explanation": string }],
  "unclearRequirements": [{ "name": string, "category": string, "evidenceInJD": string, "explanation": string }],
  "responsibilities": string[],
  "experienceRequirements": string,
  "educationRequirements": string,
  "contradictions": [{ "issue": string, "explanation": string, "recommendation": string }]
}`;

  const userPrompt = `Job Title: ${details.title || 'Unspecified'}
Company: ${details.company || 'Unspecified'}
Location: ${details.location || 'Unspecified'}

Job Description:
${jdText}`;

  if (hasGemini && (provider === 'gemini' || !provider)) {
    try {
      const raw = await callGeminiStructured({ systemPrompt, userPrompt });
      return jobDescriptionAnalysisSchema.parse(raw);
    } catch (err) {
      logger.warn(`Gemini JD analysis failed (${err.message}). Using fallback engine.`);
    }
  } else if (hasOpenAI && (provider === 'openai' || !provider)) {
    try {
      const raw = await callOpenAIStructured({ systemPrompt, userPrompt });
      return jobDescriptionAnalysisSchema.parse(raw);
    } catch (err) {
      logger.warn(`OpenAI JD analysis failed (${err.message}). Using fallback engine.`);
    }
  }

  const fallbackResult = fallbackAnalyzeJobDescription(jdText, details);
  return jobDescriptionAnalysisSchema.parse(fallbackResult);
};

export const generateApplicationClarityAI = async (jdAnalysis, candidateProfile, originalResumeText) => {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  const systemPrompt = `You are Magenta's Job Application Clarity Engine.
Your purpose: Help job seekers understand how their resume relates to a job description before they apply.
You must NOT score, rank, grade, or predict if they will get selected.
Do NOT generate ATS scores or match percentages.

Classify every requirement into one of four resume statuses:
1. "Evidence Found" - candidate resume explicitly demonstrates direct experience or skill.
2. "Partial Evidence" - candidate has related experience, foundational concepts, but exact proof is missing.
3. "Not Found in Resume" - no evidence was found in the candidate resume (clarify that absence in resume does not mean lack of capability).
4. "Unclear" - ambiguous relation.

Also generate 3-4 insightful questions the candidate should ask the recruiter to resolve ambiguities in the JD.

Return valid JSON adhering to this schema:
{
  "overview": { ... },
  "mandatoryRequirements": [{ "name": string, "category": string, "employerClassification": "Mandatory", "evidenceInJD": string, "resumeStatus": "Evidence Found"|"Partial Evidence"|"Not Found in Resume"|"Unclear", "resumeEvidence": string, "matchExplanation": string, "missingInformation": string }],
  "preferredRequirements": [{ "name": string, "category": string, "employerClassification": "Preferred", "evidenceInJD": string, "resumeStatus": "Evidence Found"|"Partial Evidence"|"Not Found in Resume"|"Unclear", "resumeEvidence": string, "matchExplanation": string, "missingInformation": string }],
  "unclearRequirements": [{ "name": string, "category": string, "employerClassification": "Unclear", "evidenceInJD": string, "resumeStatus": "Evidence Found"|"Partial Evidence"|"Not Found in Resume"|"Unclear", "resumeEvidence": string, "matchExplanation": string, "missingInformation": string }],
  "contradictions": [{ "issue": string, "explanation": string, "recommendation": string }],
  "experienceComparison": { "jdExpectation": string, "candidateExperience": string, "alignmentExplanation": string, "potentialUncertainty": string },
  "educationComparison": { "jdExpectation": string, "candidateEducation": string, "alignmentExplanation": string },
  "projectAlignment": [{ "projectTitle": string, "relevantJdAspect": string, "alignmentNotes": string }],
  "recruiterQuestions": [{ "question": string, "context": string, "whyAsk": string }]
}`;

  const userPrompt = `Job Description Analysis:
${JSON.stringify(jdAnalysis, null, 2)}

Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

Original Resume Text:
${originalResumeText}`;

  if (hasGemini && (provider === 'gemini' || !provider)) {
    try {
      const raw = await callGeminiStructured({ systemPrompt, userPrompt });
      return applicationClaritySchema.parse(raw);
    } catch (err) {
      logger.warn(`Gemini Application Clarity failed (${err.message}). Using fallback engine.`);
    }
  } else if (hasOpenAI && (provider === 'openai' || !provider)) {
    try {
      const raw = await callOpenAIStructured({ systemPrompt, userPrompt });
      return applicationClaritySchema.parse(raw);
    } catch (err) {
      logger.warn(`OpenAI Application Clarity failed (${err.message}). Using fallback engine.`);
    }
  }

  const fallbackResult = fallbackCompareApplication(jdAnalysis, candidateProfile, originalResumeText);
  return applicationClaritySchema.parse(fallbackResult);
};
