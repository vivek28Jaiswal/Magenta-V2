import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Resume } from '../models/Resume.js';
import { logger } from '../utils/logger.js';

export const seedDemoUser = async () => {
  try {
    const demoEmail = 'vivek@example.com';
    let user = await User.findOne({ email: demoEmail });

    const passwordHash = await bcrypt.hash('password123', 10);

    if (!user) {
      user = await User.create({
        name: 'Vivek Sharma',
        email: demoEmail,
        passwordHash,
        onboardingCompleted: true,
        preferences: {
          preferredRoles: ['Frontend Engineer', 'Full Stack Developer', 'Software Engineer - Fresher'],
          preferredLocations: ['Bengaluru', 'Remote India', 'Hyderabad', 'Mumbai'],
          workModes: ['remote', 'hybrid', 'on-site'],
        },
      });
      logger.info(`Created demo user: ${demoEmail}`);
    } else {
      // Ensure password hash matches password123
      user.passwordHash = passwordHash;
      user.onboardingCompleted = true;
      await user.save();
    }

    // Ensure demo resume exists and is linked
    let resume = await Resume.findOne({ userId: user._id });

    const demoStructuredProfile = {
      professionalProfile: {
        fullName: 'Vivek Sharma',
        headline: 'Frontend & Full Stack Developer | React, Node.js, Web Systems',
        currentRole: 'Software Engineering Intern',
        summary: 'Proactive software developer with strong hands-on experience in React, JavaScript, TypeScript, Node.js, and modern CSS. Passionate about building fast, responsive user experiences and scalable web apps.',
        preferredRoles: [
          'Frontend Engineer',
          'Full Stack Developer',
          'Software Development Engineer - Intern',
          'Junior Web Developer',
        ],
        location: 'Bengaluru, Karnataka, India',
        email: demoEmail,
        phone: '+91 98765 43210',
        links: ['https://github.com/vivek-sharma', 'https://linkedin.com/in/vivek-sharma'],
      },
      technicalSkills: {
        languages: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Python'],
        frameworks: ['React', 'Node.js', 'Express', 'Next.js'],
        frontend: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Redux', 'HTML5', 'CSS3'],
        backend: ['Node.js', 'Express', 'REST API'],
        databases: ['MongoDB', 'PostgreSQL'],
        cloudDevOps: ['Docker', 'Git', 'GitHub Actions'],
        aiMachineLearning: ['LLM APIs', 'Prompt Engineering'],
        designTools: ['Figma'],
        devTools: ['Git', 'GitHub', 'VS Code', 'Postman'],
        testingQa: ['Jest', 'React Testing Library'],
        other: ['Responsive Design', 'Web Performance'],
      },
      workExperience: [
        {
          company: 'TechSolutions India',
          jobTitle: 'Frontend Engineering Intern',
          dates: 'June 2024 - Dec 2024',
          duration: '6 months',
          location: 'Bengaluru, India',
          employmentType: 'Internship',
          responsibilities: [
            'Built responsive user interfaces and reusable components in React and Tailwind CSS.',
            'Integrated REST APIs with Axios and managed application state using Redux Toolkit.',
            'Improved page load performance by 35% through bundle optimization and lazy loading.',
          ],
          technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Redux', 'Git', 'REST API'],
          achievements: ['Received Outstanding Intern award for on-time delivery of merchant dashboard.'],
        },
      ],
      projects: [
        {
          title: 'DevConnect - Real-time Developer Collaboration Platform',
          description: 'A full-stack collaboration platform featuring real-time chat, code snippets sharing, and project boards.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST API'],
          contribution: 'Designed frontend architecture and implemented Node.js REST APIs.',
          outcomes: 'Used by over 500 college peers for collaborative hackathon projects.',
        },
        {
          title: 'QuickCart - Modern E-Commerce Web App',
          description: 'A snappy quick-commerce web app with product filtering, instant cart updates, and mock checkout flow.',
          technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Redux', 'Git'],
          contribution: 'Implemented state management and responsive mobile-first UI components.',
          outcomes: 'Achieved 98+ Lighthouse performance score.',
        },
      ],
      education: [
        {
          degree: 'Bachelor of Technology in Computer Science & Engineering',
          institution: 'National Institute of Technology (NIT)',
          graduationYear: '2025',
          dates: '2021 - 2025',
          gpaOrGrade: '8.7 / 10',
        },
      ],
      completenessCheck: {
        completenessScore: 95,
        overallRating: 'complete',
        missingSections: [],
      },
    };

    if (!resume) {
      resume = await Resume.create({
        userId: user._id,
        originalFileReference: 'demo_resume.pdf',
        originalFileName: 'Vivek_Sharma_Software_Engineer_Resume.pdf',
        fileType: 'pdf',
        fileSize: 245000,
        pageCount: 1,
        extractedText: `Vivek Sharma\nFrontend & Full Stack Developer\nEmail: ${demoEmail} | Phone: +91 98765 43210 | Bengaluru, India\nGitHub: github.com/vivek-sharma | LinkedIn: linkedin.com/in/vivek-sharma\n\nTECHNICAL SKILLS:\nLanguages: JavaScript, TypeScript, HTML, CSS, Python\nFrontend: React, Tailwind CSS, Redux, Next.js, HTML5, CSS3\nBackend: Node.js, Express, REST APIs, MongoDB, PostgreSQL\nTools: Git, GitHub, Docker, Postman, Figma\n\nEXPERIENCE:\nTechSolutions India - Frontend Engineering Intern (June 2024 - Dec 2024)\n- Built responsive user interfaces and reusable components in React and Tailwind CSS.\n- Integrated REST APIs with Axios and managed application state using Redux Toolkit.\n- Improved page load performance by 35% through bundle optimization and lazy loading.\n\nPROJECTS:\nDevConnect - Real-time Developer Collaboration Platform (React, Node.js, MongoDB, Tailwind CSS)\nQuickCart - Modern E-Commerce Web App (React, JavaScript, Tailwind CSS, Redux)\n\nEDUCATION:\nB.Tech in Computer Science & Engineering - National Institute of Technology (2021 - 2025) - CGPA: 8.7/10`,
        structuredProfile: demoStructuredProfile,
        analysisStatus: 'completed',
      });
      logger.info(`Created demo resume for ${demoEmail}`);
    } else {
      resume.structuredProfile = demoStructuredProfile;
      resume.analysisStatus = 'completed';
      await resume.save();
    }

    user.resume = resume._id;
    await user.save();

    logger.info(`Demo credentials ready: ${demoEmail} / password123`);
  } catch (error) {
    logger.error('Error seeding demo user:', error.message);
  }
};
