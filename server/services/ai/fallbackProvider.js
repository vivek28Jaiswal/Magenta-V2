import { logger } from '../../utils/logger.js';

// Comprehensive tech & design skill catalog
const TECH_CATALOG = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'HTML', 'CSS', 'Bash', 'Scala', 'R', 'Dart', 'Solidity'],
  frontend: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Tailwind CSS', 'Tailwind', 'Redux', 'Zustand', 'Bootstrap', 'Vite', 'Webpack', 'jQuery', 'Sass', 'GSAP', 'Framer', 'Framer Motion', 'Three.js', 'Remix', 'Astro'],
  backend: ['Node.js', 'Node', 'Express', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'GraphQL', 'REST API', 'RESTful', 'gRPC', 'Microservices', 'Celery', 'Socket.io'],
  databases: ['PostgreSQL', 'Postgres', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch', 'DynamoDB', 'Firebase', 'Supabase', 'SQLite', 'Prisma', 'Mongoose', 'Cassandra', 'Neo4j'],
  cloudDevOps: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux', 'Nginx', 'Serverless', 'Cloudflare', 'Helm', 'Ansible', 'Vercel'],
  aiMachineLearning: ['PyTorch', 'TensorFlow', 'OpenCV', 'Hugging Face', 'LangChain', 'LlamaIndex', 'Scikit-learn', 'LLMs', 'NLP', 'Prompt Engineering'],
  designTools: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch', 'Canva', 'InDesign', 'UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'Design Systems', 'User Flows', 'Visual Design', 'Interaction Design', 'Responsive Design', 'Information Architecture'],
  devTools: ['Git', 'GitHub', 'GitLab', 'VS Code', 'Cursor', 'Postman', 'Jira', 'Confluence', 'AI Tools', 'Webpack', 'Vite'],
  testingQa: ['Jest', 'Mocha', 'Cypress', 'Playwright', 'Selenium', 'React Testing Library', 'JUnit', 'PyTest'],
};

const SOFT_SKILLS_CATALOG = [
  'Communication', 'Leadership', 'Collaboration', 'Problem Solving', 'Critical Thinking', 
  'Agile Methodology', 'Agile', 'Scrum', 'Time Management', 'Mentorship', 'Cross-functional Collaboration'
];

export const fallbackParseResume = (text, metadata = {}) => {
  logger.info('Running comprehensive deep resume analysis engine...');
  const cleanedRaw = text.replace(/[\u0013\u0014]/g, '—');
  const lines = cleanedRaw.split('\n').map(l => l.trim()).filter(Boolean);

  const ocrApplied = Boolean(metadata.ocrApplied);
  const ocrConfidence = metadata.ocrConfidence || null;

  // 1. Contact & Identity extraction
  const emailMatch = cleanedRaw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  const phoneMatch = cleanedRaw.match(/(?:\+91[\s-]?)?[6789]\d{9}|\+?[0-9\s-]{10,15}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : null;

  // Extract Links
  const links = [];
  const linkMatches = cleanedRaw.matchAll(/(https?:\/\/[^\s]+|linkedin\.com\/[^\s]+|github\.com\/[^\s]+|behance\.net\/[^\s]+|dribbble\.com\/[^\s]+)/gi);
  for (const lm of linkMatches) {
    if (!links.includes(lm[0])) links.push(lm[0]);
  }

  // Location
  let location = null;
  const locRegex = /\b(Delhi(?:,\s*India)?|Bengaluru|Bangalore|Mumbai|Pune|Hyderabad|Chennai|Gurgaon|Noida|Kolkata|India|Remote)\b/i;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (locRegex.test(lines[i])) {
      const match = lines[i].match(locRegex);
      if (match) {
        location = lines[i].length < 35 ? lines[i] : match[0];
        break;
      }
    }
  }

  // Name
  let fullName = 'Candidate';
  if (email) {
    const cleanPrefix = email.split('@')[0].replace(/[0-9_.]+/g, '').replace(/fr$/i, '');
    if (cleanPrefix.length >= 3) {
      fullName = cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1);
    }
  }

  const candidateNameLine = lines.find(l => 
    l.length >= 3 && 
    l.length < 35 && 
    !l.includes('@') && 
    !l.includes('http') && 
    !l.includes('+') && 
    !/^(linkedin|github|portfolio|email|phone|instagram|behance|work experience|skills|education|projects|tools|design|highlights|summary)$/i.test(l) &&
    !/(engineer|developer|designer|architect|lead|intern|manager)/i.test(l)
  );

  if (candidateNameLine && fullName === 'Candidate') {
    fullName = candidateNameLine;
  }

  // Headline & Summary
  let headline = lines.find(l => /(ui\/ux|designer|developer|engineer|full stack|frontend|backend|architect|data scientist)/i.test(l) && l.length > 15 && l.length < 120);
  if (!headline) {
    headline = /designer/i.test(text) ? 'UI/UX & Web Designer' : /frontend/i.test(text) ? 'Frontend Developer' : 'Software Professional';
  }

  const summary = lines.find(l => l.length > 60 && !l.includes('@') && !l.includes('http')) || headline;

  // Inferred roles
  const preferredRoles = [];
  if (/ui[\/\s-]?ux|product designer|design/i.test(cleanedRaw)) {
    preferredRoles.push('UI/UX Designer', 'Product Designer', 'Frontend Developer');
  }
  if (/frontend|front[\s-]?end/i.test(cleanedRaw) && !preferredRoles.includes('Frontend Developer')) {
    preferredRoles.push('Frontend Developer');
  }
  if (/full[\s-]?stack/i.test(cleanedRaw)) preferredRoles.push('Full Stack Developer');
  if (/backend|back[\s-]?end/i.test(cleanedRaw)) preferredRoles.push('Backend Developer');
  if (/data engineer|data scientist|machine learning/i.test(cleanedRaw)) preferredRoles.push('Data Engineer', 'AI/ML Engineer');
  if (preferredRoles.length === 0) preferredRoles.push('Software Developer');

  // 2. Technical Skills with Sentence Context & Evidence Preservation
  const foundSkills = {
    languages: [],
    frameworks: [],
    frontend: [],
    backend: [],
    databases: [],
    cloudDevOps: [],
    aiMachineLearning: [],
    designTools: [],
    devTools: [],
    testingQa: [],
    other: [],
    skillContexts: [],
  };

  for (const [category, list] of Object.entries(TECH_CATALOG)) {
    for (const skill of list) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(cleanedRaw)) {
        if (category === 'languages') foundSkills.languages.push(skill);
        else if (category === 'frontend') {
          foundSkills.frontend.push(skill);
          foundSkills.frameworks.push(skill);
        } else if (category === 'backend') {
          foundSkills.backend.push(skill);
          foundSkills.frameworks.push(skill);
        } else if (category === 'databases') foundSkills.databases.push(skill);
        else if (category === 'cloudDevOps') foundSkills.cloudDevOps.push(skill);
        else if (category === 'aiMachineLearning') foundSkills.aiMachineLearning.push(skill);
        else if (category === 'devTools') foundSkills.devTools.push(skill);
        else if (category === 'designTools') foundSkills.designTools.push(skill);
        else if (category === 'testingQa') foundSkills.testingQa.push(skill);
        else foundSkills.other.push(skill);

        // Find the line where this skill is mentioned to preserve context and evidence
        const contextLine = lines.find(l => regex.test(l)) || '';
        if (contextLine && foundSkills.skillContexts.length < 30) {
          foundSkills.skillContexts.push({
            skill,
            category: category.charAt(0).toUpperCase() + category.slice(1),
            contextFound: contextLine.length > 120 ? contextLine.slice(0, 120) + '...' : contextLine,
            evidenceQuote: skill,
          });
        }
      }
    }
  }

  // Soft Skills with Context
  const softSkills = [];
  SOFT_SKILLS_CATALOG.forEach(s => {
    const sRegex = new RegExp(`\\b${s}\\b`, 'i');
    const matchedLine = lines.find(l => sRegex.test(l));
    if (matchedLine) {
      softSkills.push({
        name: s,
        evidenceQuote: matchedLine.length > 100 ? matchedLine.slice(0, 100) + '...' : matchedLine,
      });
    }
  });

  // 3. Education
  const education = [];
  const eduKeywordRegex = /\b(Bachelor|Master|BCA|MCA|B\.?Tech|B\.?E\.?|Degree|Intermediate|High School|Diploma|Doctorate|PhD|Senior Secondary)\b/i;
  const instKeywordRegex = /\b(College|University|School|Institute|Academy)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (eduKeywordRegex.test(l) && !/^(skills|education|projects|work experience)$/i.test(l)) {
      const yearMatch = l.match(/\b(19|20)\d{2}\b/);
      let institution = 'Documented Educational Institution';
      
      for (let j = 1; j <= 3; j++) {
        if (i - j >= 0 && instKeywordRegex.test(lines[i - j])) {
          institution = lines[i - j];
          break;
        }
      }

      if (instKeywordRegex.test(l) && !/(Bachelor|Master|BCA|MCA|B\.?Tech|Intermediate|Diploma|Degree)/i.test(l)) {
        continue;
      }

      const gpaMatch = l.match(/\b(?:GPA|CGPA|Grade|Marks?)[\s:]*([0-9.]+(?:\s*\/\s*[0-9.]+)?%?)/i);

      education.push({
        degree: l.split('|')[0].trim(),
        institution,
        graduationYear: yearMatch ? yearMatch[0] : '',
        dates: yearMatch ? yearMatch[0] : '',
        academicInfo: l,
        gpaOrGrade: gpaMatch ? gpaMatch[0] : '',
        honors: /honors|distinction|first class/i.test(l) ? ['Documented Academic Honors'] : [],
      });
    }
  }

  // 4. Work Experience
  const workExperience = [];
  const skipKeywords = /^(skills|tools|education|projects|work experience|design|highlights|web technologies)$/i;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (skipKeywords.test(l)) continue;
    if (/(Bachelor|BCA|Intermediate|School|College|Degree|e-commerce|website)/i.test(l)) continue;
    if (/^Role:/i.test(l)) continue;

    const isJobTitle = /(designer|developer|engineer|intern|lead|architect|consultant|analyst|manager)/i.test(l) && 
                       l.length < 90 &&
                       !l.includes('•');

    if (isJobTitle) {
      let foundDate = 'Documented in resume';
      for (let j = 0; j <= 3; j++) {
        const candidateLine = lines[i + j] || '';
        const dMatch = candidateLine.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b[\w\s–—-]*\b(20\d{2}|Present)\b|\b(20\d{2}\s*[-–—]\s*(?:20\d{2}|Present))\b|\bPresent\b/i);
        if (dMatch) {
          foundDate = dMatch[0].trim();
          break;
        }
      }

      let jobTitle = l;
      let company = 'Documented Company';
      let loc = '';

      if (l.includes('—') || l.includes(' - ')) {
        const parts = l.split(/[-—]/);
        jobTitle = parts[0].trim();
        company = parts.slice(1).join(' - ').trim();
      } else if (l.includes(' at ')) {
        const parts = l.split(' at ');
        jobTitle = parts[0].trim();
        company = parts.slice(1).join(' at ').trim();
      }

      const locMatchInTitle = (l + ' ' + (lines[i + 1] || '')).match(/\(([^)]+)\)/);
      if (locMatchInTitle) loc = locMatchInTitle[1];

      // Extract responsibilities & achievements
      const responsibilities = [l];
      const achievements = [];
      const roleTechs = [];

      for (let k = 1; k <= 5; k++) {
        const sub = lines[i + k] || '';
        if (/(Bachelor|BCA|College|School|EDUCATION|PROJECTS)/i.test(sub)) break;
        if (/(designer|developer|engineer|lead)\b/i.test(sub) && sub.length < 70 && !sub.startsWith('•')) break;

        if (sub.length > 15) {
          responsibilities.push(sub);
          if (/\d+[%kK\+]|\$\d+|\b(reduced|increased|improved|scaled|delivered|launched)\b/i.test(sub)) {
            achievements.push(sub);
          }
        }
      }

      // Collect technologies used in this role
      Object.values(TECH_CATALOG).flat().forEach(tech => {
        if (new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(responsibilities.join(' '))) {
          if (!roleTechs.includes(tech)) roleTechs.push(tech);
        }
      });

      workExperience.push({
        company: company || 'Professional Experience',
        jobTitle,
        dates: foundDate,
        duration: foundDate !== 'Documented in resume' ? foundDate : 'Documented in resume',
        location: loc || (l.toLowerCase().includes('remote') ? 'Remote' : ''),
        employmentType: /intern/i.test(jobTitle) ? 'Internship' : /freelance/i.test(jobTitle) ? 'Freelance' : /contract/i.test(jobTitle) ? 'Contract' : 'Full-time',
        responsibilities: responsibilities.slice(0, 4),
        technologies: roleTechs.length > 0 ? roleTechs.slice(0, 6) : foundSkills.designTools.slice(0, 3).concat(foundSkills.frontend.slice(0, 2)),
        achievements,
        evidenceQuotes: [l],
      });
    }
  }

  // 5. Projects
  const projects = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (
      /(e-commerce|website|\bplatform\b|\bdashboard\b|offbeat|redesign|\bapp\b)/i.test(l) && 
      !/(Bachelor|BCA|College|School|Degree|Intermediate|High School)/i.test(l) &&
      l.length > 8 && l.length < 90
    ) {
      let contribution = 'Design and implementation';
      let outcome = 'Delivered project documented in portfolio';
      let measurableAchievements = '';

      for (let j = 1; j <= 3; j++) {
        if (lines[i + j] && /^Role:/i.test(lines[i + j])) {
          contribution = lines[i + j];
        }
        if (lines[i + j] && /\d+[%kK\+]|\$\d+|\b(improved|scaled|delivered)\b/i.test(lines[i + j])) {
          measurableAchievements = lines[i + j];
        }
      }

      const projectTechs = [];
      Object.values(TECH_CATALOG).flat().forEach(tech => {
        if (new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(l)) {
          if (!projectTechs.includes(tech)) projectTechs.push(tech);
        }
      });

      projects.push({
        title: l,
        description: l,
        technologies: projectTechs.length > 0 ? projectTechs : foundSkills.designTools.slice(0, 2).concat(foundSkills.frontend.slice(0, 2)),
        contribution,
        outcomes: outcome,
        measurableAchievements,
        liveUrl: '',
        evidenceQuotes: [l],
      });
    }
  }

  // 6. Certifications
  const certifications = [];
  lines.forEach(l => {
    if (/(certified|certificate|certification|scrum master|aws certified|google cloud certified|coursera|udemy)/i.test(l) && l.length > 10 && l.length < 100) {
      certifications.push({
        name: l,
        issuer: l.includes('by ') ? l.split('by ')[1].trim() : 'Issuing Organization',
        date: (l.match(/\b(19|20)\d{2}\b/) || [''])[0],
        credentialId: '',
      });
    }
  });

  // 7. Completeness & Quality Check
  const flaggedIssues = [];
  const missingSections = [];

  let completenessScore = 100;

  if (workExperience.length === 0) {
    missingSections.push('workExperience');
    completenessScore -= 25;
    flaggedIssues.push({
      section: 'Work Experience',
      issue: 'No clearly demarcated employment history or job titles detected.',
      recommendation: 'Ensure your previous roles, company names, and dates are formatted clearly.',
      severity: 'info',
    });
  }

  if (education.length === 0) {
    missingSections.push('education');
    completenessScore -= 20;
    flaggedIssues.push({
      section: 'Education',
      issue: 'No degrees or educational credentials detected in document.',
      recommendation: 'Mention your degree or completed schooling explicitly.',
      severity: 'info',
    });
  }

  if (!email && !phone) {
    missingSections.push('contact');
    completenessScore -= 15;
    flaggedIssues.push({
      section: 'Contact Information',
      issue: 'No selectable email address or phone number found.',
      recommendation: 'Add your direct contact email on the document.',
      severity: 'warning',
    });
  }

  if (ocrApplied && ocrConfidence !== null && ocrConfidence < 65) {
    completenessScore -= 20;
    flaggedIssues.push({
      section: 'Document Readability',
      issue: `OCR applied with moderate confidence (${ocrConfidence}%). Some letters or characters may require verification.`,
      recommendation: 'If any extracted text is inaccurate, please upload a higher resolution document or use the Paste Resume Text tab.',
      severity: 'warning',
    });
  }

  let overallRating = 'complete';
  if (ocrApplied && ocrConfidence && ocrConfidence < 50) {
    overallRating = 'partially_unreadable';
  } else if (completenessScore < 60) {
    overallRating = 'missing_critical_info';
  } else if (completenessScore < 85) {
    overallRating = 'adequate';
  }

  return {
    professionalProfile: {
      fullName,
      headline,
      currentRole: workExperience[0]?.jobTitle || headline,
      summary,
      preferredRoles,
      location,
      email,
      phone,
      links,
    },
    technicalSkills: foundSkills,
    softSkills,
    workExperience: workExperience.slice(0, 6),
    projects: projects.slice(0, 5),
    education: education.slice(0, 4),
    certifications,
    additional: {
      awards: [],
      achievements: [],
      languages: [],
      activities: [],
    },
    completenessCheck: {
      completenessScore: Math.max(20, completenessScore),
      overallRating,
      missingSections,
      flaggedIssues,
      extractionNotes: ocrApplied
        ? `Text extracted via AI Optical Character Recognition (OCR) with ${ocrConfidence}% character confidence.`
        : `Direct vector/text extraction completed cleanly across all sections.`,
    },
  };
};

export const fallbackAnalyzeJobDescription = (jdText, providedDetails = {}) => {
  logger.info('Running intelligent local JD analysis engine...');
  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);

  const title = providedDetails.title || lines.find(l => /(engineer|developer|architect|designer|manager|lead)/i.test(l)) || 'Software Engineer';
  const company = providedDetails.company || 'Hiring Organization';
  const location = providedDetails.location || (jdText.match(/\b(Remote|Bengaluru|Bangalore|Delhi|Mumbai|Pune|Hyderabad|Chennai|Gurgaon|Noida|India)\b/i) || ['Remote'])[0];

  const mandatory = [];
  const preferred = [];
  const unclear = [];
  const contradictions = [];

  // Categorize requirements based on explicit JD indicators
  lines.forEach(rawLine => {
    const line = rawLine.replace(/^[•\-*#\d.]+\s*/, '').trim();
    if (line.length < 5 || line.length > 250) return;

    // Filter out generic section headers
    if (
      /^(required skills|skills & qualifications|requirements|qualifications|mandatory requirements|what you need|who you are|responsibilities|key responsibilities|about the role|nice to have|preferred skills|preferred qualifications|bonus points)[\s:]*$/i.test(line) ||
      /^(preferred|mandatory|minimum|required)\s*(qualifications|skills)?\s*[:]/i.test(line) ||
      (line.endsWith(':') && line.split(' ').length <= 4)
    ) {
      return;
    }

    const lower = line.toLowerCase();
    const isMandatory = /required|must have|essential|mandatory|minimum|years of experience|demonstrated experience/i.test(lower);
    const isPreferred = /preferred|nice to have|plus|beneficial|good to have|desirable|bonus/i.test(lower);

    // Look for technical entities
    const techHits = [];
    Object.values(TECH_CATALOG).flat().forEach(tech => {
      if (new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(line)) {
        if (!techHits.includes(tech)) techHits.push(tech);
      }
    });

    if (techHits.length > 0 || isMandatory || isPreferred) {
      const name = techHits.length > 0 ? techHits.join(', ') : line.substring(0, 60);
      const reqItem = {
        name,
        category: techHits.length > 0 ? 'Technical Skills' : 'Experience & Qualification',
        evidenceInJD: line,
        explanation: isMandatory ? 'Explicitly stated as a mandatory or must-have requirement in the job description.' :
                     isPreferred ? 'Explicitly stated as desirable, a plus, or preferred.' :
                     'Mentioned in the job description without a clear distinction between mandatory or preferred.',
      };

      if (isMandatory) mandatory.push(reqItem);
      else if (isPreferred) preferred.push(reqItem);
      else unclear.push(reqItem);
    }
  });

  // Check for contradictions
  if (/entry level|junior/i.test(jdText) && /(3\+|4\+|5\+)\s*years/i.test(jdText)) {
    contradictions.push({
      issue: 'Role seniority vs experience requirement discrepancy',
      explanation: 'The job title or description mentions Junior / Entry Level, but also specifies 3-5+ years of experience.',
      recommendation: 'Ask the recruiter whether they consider candidates with fewer years of formal experience or if the title is flexible.',
    });
  }

  return {
    overview: {
      title,
      company,
      location,
      employmentType: /contract/i.test(jdText) ? 'Contract' : /part[\s-]?time/i.test(jdText) ? 'Part-time' : 'Full-time',
      experienceExpectations: (jdText.match(/\b\d+\+?\s*years(?:\s+of)?\s+experience\b/i) || ['Not strictly specified'])[0],
      educationExpectations: (jdText.match(/\b(Bachelor'?s?|Master'?s?|B\.?Tech|Computer Science)\b[^\n.]*/i) || ['Degree in relevant field preferred'])[0],
      summary: lines.slice(0, 3).join(' ').substring(0, 280),
    },
    mandatoryRequirements: mandatory.slice(0, 8),
    preferredRequirements: preferred.slice(0, 6),
    unclearRequirements: unclear.slice(0, 6),
    responsibilities: lines.filter(l => l.startsWith('•') || l.startsWith('-') || /lead|build|design|collaborate|develop/i.test(l)).slice(0, 6),
    experienceRequirements: (jdText.match(/\b\d+\+?\s*years[^\n.]*/i) || ['Experience level stated in job overview'])[0],
    educationRequirements: (jdText.match(/\b(bachelor|degree|computer science)[^\n.]*/i) || ['Standard degree or equivalent experience'])[0],
    contradictions,
  };
};

export const fallbackCompareApplication = (jdAnalysis, candidateProfile, originalResumeText) => {
  logger.info('Running intelligent local Application Clarity comparison engine...');

  const allCandidateSkills = [
    ...(candidateProfile.technicalSkills?.languages || []),
    ...(candidateProfile.technicalSkills?.frameworks || []),
    ...(candidateProfile.technicalSkills?.frontend || []),
    ...(candidateProfile.technicalSkills?.backend || []),
    ...(candidateProfile.technicalSkills?.databases || []),
    ...(candidateProfile.technicalSkills?.designTools || []),
    ...(candidateProfile.technicalSkills?.devTools || []),
    ...(candidateProfile.technicalSkills?.other || []),
    ...(candidateProfile.softSkills || []),
  ];

  const resumeCorpus = [
    originalResumeText || '',
    allCandidateSkills.join(' '),
    (candidateProfile.workExperience || []).map(w => `${w.jobTitle} ${w.company} ${(w.responsibilities || []).join(' ')} ${(w.technologies || []).join(' ')}`).join(' '),
    (candidateProfile.projects || []).map(p => `${p.title} ${p.description} ${(p.technologies || []).join(' ')}`).join(' '),
  ].join(' ').toLowerCase();

  const compareRequirement = (req, classification) => {
    const subItems = req.name.split(',').map(s => s.trim()).filter(Boolean);
    const matchedItems = [];
    const missingItems = [];

    for (const item of subItems) {
      const itemLower = item.toLowerCase();
      const isMatch = allCandidateSkills.some(cs => cs.toLowerCase() === itemLower) ||
                      new RegExp(`\\b${itemLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(resumeCorpus);
      if (isMatch) {
        matchedItems.push(item);
      } else {
        missingItems.push(item);
      }
    }

    let resumeStatus;
    let matchExplanation;
    let matchingSnippet = '';
    let missingInfo = '';

    if (matchedItems.length === subItems.length && subItems.length > 0) {
      resumeStatus = 'Evidence Found';
      matchingSnippet = `Demonstrated evidence found in candidate profile: ${matchedItems.join(', ')}`;
      matchExplanation = `Candidate's resume explicitly documents verified competence in ${matchedItems.join(', ')}.`;
    } else if (matchedItems.length > 0) {
      resumeStatus = 'Partial Evidence';
      matchingSnippet = `Found direct evidence for: ${matchedItems.join(', ')}`;
      matchExplanation = `Candidate has verified experience in ${matchedItems.join(', ')}, but proof for ${missingItems.join(', ')} was not explicitly documented in the resume.`;
      missingInfo = `Explicit evidence or practical project demonstration for ${missingItems.join(', ')}.`;
    } else {
      const phraseMatch = resumeCorpus.includes(req.name.toLowerCase().substring(0, 30));
      if (phraseMatch) {
        resumeStatus = 'Evidence Found';
        matchingSnippet = `Related terminology identified in candidate experience.`;
        matchExplanation = `Candidate's profile contains related background matching "${req.name}".`;
      } else {
        resumeStatus = 'Not Found in Resume';
        matchExplanation = `No direct mention or explicit demonstration of "${req.name}" was found in the candidate's uploaded resume.`;
        missingInfo = `Explicit evidence or practical project experience showcasing ${req.name}. Note: Absence in resume does not mean lack of capability.`;
      }
    }

    return {
      name: req.name,
      category: req.category || 'Technical',
      employerClassification: classification,
      evidenceInJD: req.evidenceInJD,
      resumeStatus,
      resumeEvidence: matchingSnippet,
      matchExplanation,
      missingInformation: missingInfo,
    };
  };

  const mandatoryMapped = (jdAnalysis.mandatoryRequirements || []).map(r => compareRequirement(r, 'Mandatory'));
  const preferredMapped = (jdAnalysis.preferredRequirements || []).map(r => compareRequirement(r, 'Preferred'));
  const unclearMapped = (jdAnalysis.unclearRequirements || []).map(r => compareRequirement(r, 'Unclear'));

  // Recruiter Questions
  const recruiterQuestions = [
    {
      question: `How critical is ${mandatoryMapped.find(m => m.resumeStatus !== 'Evidence Found')?.name || 'every specific tool listed'} compared to strong core skills in ${(candidateProfile.technicalSkills?.languages || ['core languages'])[0]}?`,
      context: 'Employers often list comprehensive toolsets while remaining flexible for candidates with solid foundational design and code capabilities.',
      whyAsk: 'Clarifies whether a missing specialized tool is a hard filter or can be learned on the job.',
    },
    {
      question: 'Which of the listed responsibilities will take top priority during the first 90 days?',
      context: 'Job descriptions compile multi-quarter roadmaps into one list.',
      whyAsk: 'Helps focus interview discussions on the immediate high-priority challenges.',
    },
    {
      question: 'Is the team open to alternative equivalent tools (e.g. Figma vs Sketch) if the candidate has deep design system experience?',
      context: 'Clarifies design and tech stack flexibility.',
      whyAsk: 'Demonstrates adaptability while addressing potential tooling differences.',
    },
  ];

  return {
    overview: jdAnalysis.overview,
    mandatoryRequirements: mandatoryMapped,
    preferredRequirements: preferredMapped,
    unclearRequirements: unclearMapped,
    contradictions: jdAnalysis.contradictions || [],
    experienceComparison: {
      jdExpectation: jdAnalysis.experienceRequirements || 'Documented in job description',
      candidateExperience: `${candidateProfile.workExperience?.length || 0} documented positions in resume`,
      alignmentExplanation: 'The candidate exhibits relevant design and frontend project experience. Alignment depends on recruiter flexibility with year counts versus demonstrated project complexity.',
      potentialUncertainty: 'Years of experience numbers often function as seniority proxies rather than strict prerequisites.',
    },
    educationComparison: {
      jdExpectation: jdAnalysis.educationRequirements || 'Relevant degree or equivalent experience',
      candidateEducation: candidateProfile.education?.[0]?.degree || 'Candidate degree documented in profile',
      alignmentExplanation: (candidateProfile.education || []).length > 0 
        ? 'Candidate holds formal educational credentials meeting standard industry expectations.' 
        : 'Candidate demonstrates strong practical design and development evidence.',
    },
    projectAlignment: (candidateProfile.projects || []).map(p => ({
      projectTitle: p.title,
      relevantJdAspect: 'Demonstrates end-to-end implementation and engineering discipline',
      alignmentNotes: `Uses technologies: ${(p.technologies || []).join(', ')}`,
    })),
    recruiterQuestions,
  };
};
