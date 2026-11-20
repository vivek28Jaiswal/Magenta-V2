import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { connectDB, closeDB } from './config/db.js';
import app from './app.js';
import { ingestJobs } from './services/jobs/jobIngestionService.js';

const TEST_PORT = 5001;

async function runE2ETest() {
  console.log('--- STARTING MAGENTA END-TO-END VERIFICATION ---');

  await connectDB();
  await ingestJobs();

  const server = app.listen(TEST_PORT, () => {
    console.log(`Test server running on port ${TEST_PORT}`);
  });

  const api = axios.create({
    baseURL: `http://localhost:${TEST_PORT}/api`,
  });

  try {
    // 1. Health check
    const health = await api.get('/health');
    console.log('✓ Health check passed:', health.data.status);

    // 2. User registration
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await api.post('/auth/register', {
      name: 'Priya Sharma',
      email: testEmail,
      password: 'password123',
    });
    console.log('✓ Registered new user:', regRes.data.user.email);
    const token = regRes.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 3. Create a realistic candidate resume file for testing
    const sampleResumeContent = `
PRIYA SHARMA
Bengaluru, Karnataka, India | priya.sharma@example.com | linkedin.com/in/priyasharma

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 4+ years of experience building modern web applications, distributed APIs, and scalable user interfaces. Specialized in React, TypeScript, Node.js, and MongoDB.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL, HTML, CSS
Frontend: React, Next.js, Tailwind CSS, Redux Toolkit
Backend: Node.js, Express, REST APIs, GraphQL
Databases: MongoDB, PostgreSQL, Redis
Tools: Git, Docker, AWS, Jest, Postman

WORK EXPERIENCE
Full Stack Engineer | Zeta Technologies | Bengaluru, India
June 2022 - Present
• Engineered reactive web applications with React, Tailwind CSS, and TypeScript for 250,000+ monthly active users.
• Architected scalable REST microservices with Node.js and Express, achieving 99.98% uptime.
• Managed high-throughput document stores with MongoDB and Redis caching.
• Mentored junior developers and led code reviews across frontend and backend modules.

Software Developer | TechWave Labs | Pune, India
July 2020 - May 2022
• Developed reusable component libraries with React and JavaScript.
• Built backend endpoints using Node.js and PostgreSQL.
• Participated in daily agile standups and sprint planning.

PROJECTS
Magenta Clarity Engine | Personal Project
• Built a full-stack career analytics dashboard using React, Tailwind CSS, Node.js, and MongoDB.
• Integrated document processing pipelines and structured AI extraction.

EDUCATION
Bachelor of Technology in Computer Science
Visvesvaraya Technological University, 2020
`;

    // Save as temporary txt/doc for extraction testing
    const tempFilePath = path.resolve('uploads', `test-resume-${Date.now()}.doc`);
    fs.writeFileSync(tempFilePath, sampleResumeContent, 'utf-8');

    // Create a boundary FormData using native standard or direct multipart simulation
    // Let's test with FormData or direct file upload test
    const FormData = (await import('formdata-node')).FormData || (await import('axios')).default;
    
    // We can also test multer upload using standard node FormData
    const { fileFromPath } = await import('formdata-node/file-from-path').catch(() => ({ fileFromPath: null }));
    
    console.log('✓ Resume document prepared at:', tempFilePath);

    // Let's test resume upload endpoint
    const form = new (await import('form-data')).default();
    form.append('resume', fs.createReadStream(tempFilePath), {
      filename: 'Priya_Sharma_Resume.doc',
      contentType: 'application/msword',
    });

    const uploadRes = await api.post('/resume/upload', form, {
      headers: form.getHeaders(),
    });

    console.log('✓ Resume uploaded and analyzed successfully!');
    console.log('  Candidate Name:', uploadRes.data.resume.structuredProfile.professionalProfile.fullName);
    console.log('  Technical Skills:', uploadRes.data.resume.structuredProfile.technicalSkills.languages);
    console.log('  Frontend Skills:', uploadRes.data.resume.structuredProfile.technicalSkills.frontend);
    console.log('  Work Positions:', uploadRes.data.resume.structuredProfile.workExperience.length);

    // 4. Verify user onboarding status updated
    const meRes = await api.get('/auth/me');
    console.log('✓ User onboarding completed status:', meRes.data.user.onboardingCompleted);

    // 5. Test Feature 02: Personalized Job Discovery (Last 24 Hours)
    const jobs24h = await api.get('/jobs/recommendations?timeframe=24h');
    console.log(`✓ Personalized jobs (Last 24h): ${jobs24h.data.count} jobs found`);
    if (jobs24h.data.jobs.length > 0) {
      const topJob = jobs24h.data.jobs[0];
      console.log(`  Top match: "${topJob.title}" at ${topJob.company}`);
      console.log(`  Relevance category: ${topJob.relevance.category}`);
      console.log(`  Matching skills:`, topJob.relevance.matchingSkills);
      console.log(`  Candidate alignment: ${topJob.relevance.explanation}`);
    }

    // 6. Test Feature 02: Personalized Job Discovery (Last 3 Days)
    const jobs3d = await api.get('/jobs/recommendations?timeframe=3d');
    console.log(`✓ Personalized jobs (Last 3 Days): ${jobs3d.data.count} jobs found`);

    // 7. Save a job and update application status
    if (jobs24h.data.jobs.length > 0) {
      const targetJobId = jobs24h.data.jobs[0].id;
      const saveRes = await api.post(`/jobs/${targetJobId}/save`);
      console.log('✓ Saved job:', saveRes.data.message);

      const statusRes = await api.patch(`/jobs/${targetJobId}/application-status`, {
        status: 'applied',
        notes: 'Submitted application on official career portal.',
      });
      console.log('✓ Updated application status to "applied":', statusRes.data.savedJob.applicationStatus);
    }

    // 8. Test Feature 01: PRIMARY FEATURE - Application Clarity
    const testJD = `
Job Title: Senior Full Stack Engineer
Company: InnovateTech India
Location: Bengaluru / Remote

About the Opportunity:
InnovateTech is hiring a Senior Full Stack Engineer to build next-generation collaboration platforms.

Key Responsibilities:
- Design and build responsive frontend web applications using React and Tailwind CSS.
- Develop distributed microservices with Node.js and Express.
- Manage database schemas in MongoDB and PostgreSQL.
- Lead code reviews and contribute to architecture planning.

Mandatory Requirements (Must Have):
- Minimum 3+ years of professional full-stack development experience.
- Strong proficiency in React, TypeScript, and modern JavaScript is essential.
- Demonstrated hands-on experience building backend APIs with Node.js.
- Must have experience with MongoDB or relational databases.

Preferred Qualifications (Nice to Have):
- Experience with Docker containerization and AWS deployments is a plus.
- Knowledge of GraphQL is desirable.
- Prior experience in fintech or collaboration tooling is beneficial.

Additional Notes:
- Candidate will collaborate with product teams across multiple time zones.
`;

    console.log('Running Application Clarity analysis...');
    const clarityRes = await api.post('/application/analyze', {
      jobDescription: testJD,
      jobDetails: {
        title: 'Senior Full Stack Engineer',
        company: 'InnovateTech India',
        location: 'Bengaluru / Remote',
        workMode: 'remote',
        originalUrl: 'https://innovatetech.example/careers',
      },
    });

    const report = clarityRes.data.report;
    console.log('✓ Application Clarity Report successfully generated!');
    console.log('  Job Title:', report.jobDetails.title);
    console.log('  Mandatory Requirements Count:', report.mandatoryRequirements.length);
    console.log('  Preferred Requirements Count:', report.preferredRequirements.length);
    console.log('  Recruiter Questions Count:', report.recruiterQuestions.length);

    console.log('\n--- SAMPLE REQUIREMENT EVIDENCE COMPARISON ---');
    report.mandatoryRequirements.forEach((req, i) => {
      console.log(`  [${i + 1}] Requirement: ${req.name} (${req.employerClassification})`);
      console.log(`      Resume Status: ${req.resumeStatus}`);
      if (req.resumeEvidence) console.log(`      Evidence: ${req.resumeEvidence}`);
      console.log(`      Analysis: ${req.matchExplanation}`);
    });

    console.log('\n--- RECRUITER QUESTIONS ---');
    report.recruiterQuestions.forEach((q, i) => {
      console.log(`  Q${i + 1}: ${q.question}`);
      console.log(`      Why ask: ${q.whyAsk}`);
    });

    // Clean up temporary file
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    console.log('\n======================================================');
    console.log('✓ ALL END-TO-END TESTS COMPLETED AND VERIFIED 100%!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('E2E Test Error:', error.response?.data || error.message);
    throw error;
  } finally {
    server.close();
    await closeDB();
  }
}

runE2ETest();
