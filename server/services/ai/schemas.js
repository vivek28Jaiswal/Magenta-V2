import { z } from 'zod';

export const resumeProfileSchema = z.object({
  professionalProfile: z.object({
    fullName: z.string().nullable().default(null),
    headline: z.string().nullable().default(null),
    currentRole: z.string().nullable().default(null),
    summary: z.string().nullable().default(null),
    preferredRoles: z.array(z.string()).default([]),
    location: z.string().nullable().default(null),
    email: z.string().nullable().default(null),
    phone: z.string().nullable().default(null),
    links: z.array(z.string()).default([]),
  }),
  technicalSkills: z.object({
    languages: z.array(z.string()).default([]),
    frameworks: z.array(z.string()).default([]),
    frontend: z.array(z.string()).default([]),
    backend: z.array(z.string()).default([]),
    databases: z.array(z.string()).default([]),
    cloudDevOps: z.array(z.string()).default([]),
    aiMachineLearning: z.array(z.string()).default([]),
    designTools: z.array(z.string()).default([]),
    devTools: z.array(z.string()).default([]),
    testingQa: z.array(z.string()).default([]),
    other: z.array(z.string()).default([]),
    skillContexts: z.array(
      z.object({
        skill: z.string().default(''),
        category: z.string().default(''),
        contextFound: z.string().default(''),
        evidenceQuote: z.string().default(''),
      })
    ).default([]),
  }),
  softSkills: z.array(
    z.union([
      z.string().transform(val => ({ name: val, evidenceQuote: '' })),
      z.object({
        name: z.string().default(''),
        evidenceQuote: z.string().default(''),
      }),
    ])
  ).default([]),
  workExperience: z.array(
    z.object({
      company: z.string().default(''),
      jobTitle: z.string().default(''),
      dates: z.string().default(''),
      duration: z.string().default(''),
      location: z.string().default(''),
      employmentType: z.string().default(''),
      responsibilities: z.array(z.string()).default([]),
      technologies: z.array(z.string()).default([]),
      achievements: z.array(z.string()).default([]),
      evidenceQuotes: z.array(z.string()).default([]),
    })
  ).default([]),
  projects: z.array(
    z.object({
      title: z.string().default(''),
      description: z.string().default(''),
      technologies: z.array(z.string()).default([]),
      contribution: z.string().default(''),
      outcomes: z.string().default(''),
      measurableAchievements: z.string().default(''),
      liveUrl: z.string().default(''),
      evidenceQuotes: z.array(z.string()).default([]),
    })
  ).default([]),
  education: z.array(
    z.object({
      degree: z.string().default(''),
      institution: z.string().default(''),
      graduationYear: z.string().default(''),
      dates: z.string().default(''),
      academicInfo: z.string().default(''),
      gpaOrGrade: z.string().default(''),
      honors: z.array(z.string()).default([]),
    })
  ).default([]),
  certifications: z.array(
    z.object({
      name: z.string().default(''),
      issuer: z.string().default(''),
      date: z.string().default(''),
      credentialId: z.string().default(''),
    })
  ).default([]),
  additional: z.object({
    awards: z.array(z.string()).default([]),
    achievements: z.array(z.string()).default([]),
    languages: z.array(z.string()).default([]),
    activities: z.array(z.string()).default([]),
  }).default({}),
  completenessCheck: z.object({
    completenessScore: z.number().default(100),
    overallRating: z.enum(['complete', 'adequate', 'partially_unreadable', 'missing_critical_info']).default('complete'),
    missingSections: z.array(z.string()).default([]),
    flaggedIssues: z.array(
      z.object({
        section: z.string().default(''),
        issue: z.string().default(''),
        recommendation: z.string().default(''),
        severity: z.enum(['warning', 'info', 'critical']).default('info'),
      })
    ).default([]),
    extractionNotes: z.string().default(''),
  }).default({}),
});

export const jobDescriptionAnalysisSchema = z.object({
  overview: z.object({
    title: z.string().default('Position'),
    company: z.string().default('Company'),
    location: z.string().default('Unspecified'),
    employmentType: z.string().default('Full-time'),
    experienceExpectations: z.string().default('Not explicitly stated'),
    educationExpectations: z.string().default('Not explicitly stated'),
    summary: z.string().default(''),
  }),
  mandatoryRequirements: z.array(
    z.object({
      name: z.string(),
      category: z.string().default('Technical'),
      evidenceInJD: z.string().default(''),
      explanation: z.string().default(''),
    })
  ).default([]),
  preferredRequirements: z.array(
    z.object({
      name: z.string(),
      category: z.string().default('Technical'),
      evidenceInJD: z.string().default(''),
      explanation: z.string().default(''),
    })
  ).default([]),
  unclearRequirements: z.array(
    z.object({
      name: z.string(),
      category: z.string().default('General'),
      evidenceInJD: z.string().default(''),
      explanation: z.string().default(''),
    })
  ).default([]),
  responsibilities: z.array(z.string()).default([]),
  experienceRequirements: z.string().default(''),
  educationRequirements: z.string().default(''),
  contradictions: z.array(
    z.object({
      issue: z.string(),
      explanation: z.string(),
      recommendation: z.string(),
    })
  ).default([]),
});

export const applicationClaritySchema = z.object({
  overview: z.object({
    title: z.string().default('Position'),
    company: z.string().default('Company'),
    location: z.string().default('Unspecified'),
    employmentType: z.string().default('Full-time'),
    experienceExpectations: z.string().default('Not explicitly stated'),
    educationExpectations: z.string().default('Not explicitly stated'),
    summary: z.string().default(''),
  }),
  mandatoryRequirements: z.array(
    z.object({
      name: z.string(),
      category: z.string().default('Technical'),
      employerClassification: z.string().default('Mandatory'),
      evidenceInJD: z.string().default(''),
      resumeStatus: z.enum(['Evidence Found', 'Partial Evidence', 'Not Found in Resume', 'Unclear']),
      resumeEvidence: z.string().default(''),
      matchExplanation: z.string().default(''),
      missingInformation: z.string().default(''),
    })
  ).default([]),
  preferredRequirements: z.array(
    z.object({
      name: z.string(),
      category: z.string().default('Technical'),
      employerClassification: z.string().default('Preferred'),
      evidenceInJD: z.string().default(''),
      resumeStatus: z.enum(['Evidence Found', 'Partial Evidence', 'Not Found in Resume', 'Unclear']),
      resumeEvidence: z.string().default(''),
      matchExplanation: z.string().default(''),
      missingInformation: z.string().default(''),
    })
  ).default([]),
  unclearRequirements: z.array(
    z.object({
      name: z.string(),
      category: z.string().default('General'),
      employerClassification: z.string().default('Unclear'),
      evidenceInJD: z.string().default(''),
      resumeStatus: z.enum(['Evidence Found', 'Partial Evidence', 'Not Found in Resume', 'Unclear']),
      resumeEvidence: z.string().default(''),
      matchExplanation: z.string().default(''),
      missingInformation: z.string().default(''),
    })
  ).default([]),
  contradictions: z.array(
    z.object({
      issue: z.string(),
      explanation: z.string(),
      recommendation: z.string(),
    })
  ).default([]),
  experienceComparison: z.object({
    jdExpectation: z.string().default(''),
    candidateExperience: z.string().default(''),
    alignmentExplanation: z.string().default(''),
    potentialUncertainty: z.string().default(''),
  }),
  educationComparison: z.object({
    jdExpectation: z.string().default(''),
    candidateEducation: z.string().default(''),
    alignmentExplanation: z.string().default(''),
  }),
  projectAlignment: z.array(
    z.object({
      projectTitle: z.string(),
      relevantJdAspect: z.string(),
      alignmentNotes: z.string(),
    })
  ).default([]),
  recruiterQuestions: z.array(
    z.object({
      question: z.string(),
      context: z.string().default(''),
      whyAsk: z.string().default(''),
    })
  ).default([]),
});
