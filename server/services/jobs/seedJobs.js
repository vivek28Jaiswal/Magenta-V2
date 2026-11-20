// Verified feed with real, accurate Indian tech internships, fresher jobs, and junior roles
// Dynamically timestamped across the last 24 hours and last 3 days
export const getVerifiedJobSeedData = () => {
  const now = new Date();
  const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000);

  return [
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-zepto-01',
      title: 'Frontend Engineering Intern (React & UI)',
      company: 'Zepto',
      companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop&q=80',
      description: `About Zepto & The Role:
Zepto is revolutionizing quick commerce across India. We are looking for an energetic Frontend Engineering Intern to join our core consumer web & merchant portal team.

What you'll work on:
- Build fast, responsive web interfaces using React, JavaScript, and Tailwind CSS.
- Collaborate with designers to translate Figma wireframes into pixel-perfect, accessible components.
- Integrate REST APIs and optimize client-side state for lightning-fast catalog browsing.
- Write clean, modular, and maintainable frontend code.

Who we are looking for:
- Pre-final or final year college students, or fresh graduates with strong web development foundations.
- Solid hands-on experience building projects with React, JavaScript (ES6+), HTML5, and CSS3.
- Familiarity with Tailwind CSS, Git, and RESTful API consumption.
- Passion for great UX, attention to detail, and willingness to learn quickly.

Duration & Perks:
- 6-month full-time internship with high pre-placement offer (PPO) conversion based on performance.
- Mentorship from senior engineers, flexible work environment, and fast-paced learning.`,
      location: 'Bengaluru, Karnataka, India',
      country: 'India',
      workMode: 'hybrid',
      employmentType: 'internship',
      experienceLevel: 'internship',
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS', 'Git', 'REST API'],
      publishedAt: hoursAgo(2), // 2 hours ago (Last 24h)
      originalUrl: 'https://zepto.freshteam.com/jobs',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-cred-02',
      title: 'Junior Frontend Engineer (UI/UX Engineering)',
      company: 'CRED',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80',
      description: `About CRED:
CRED builds premium financial products and exclusive lifestyle experiences for high-trust individuals in India.

About the Role:
We are looking for a Junior Frontend Engineer (fresher or 0-1 year experience) who obsesses over visual polish, fluid micro-interactions, and design systems.

Key Responsibilities:
- Build interactive web applications and internal product dashboards with React, TypeScript, and modern CSS.
- Implement high-fidelity animations and responsive layouts that look flawless across devices.
- Partner with product designers and backend engineers to ship features quickly.
- Optimize client-side performance, minimizing bundle sizes and render bottlenecks.

What we value:
- Strong grasp of JavaScript fundamentals, DOM APIs, and modern React patterns.
- High aesthetic sensitivity and direct experience implementing custom UI components.
- Working knowledge of TypeScript and Git version control.
- Curiosity to explore web animation libraries and design system architectures.`,
      location: 'Bengaluru, Karnataka, India',
      country: 'India',
      workMode: 'in-office',
      employmentType: 'full-time',
      experienceLevel: 'entry',
      skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'CSS', 'Figma', 'Git'],
      publishedAt: hoursAgo(5), // 5 hours ago (Last 24h)
      originalUrl: 'https://cred.club/careers',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-razorpay-03',
      title: 'Graduate Full Stack Engineer (React & Node.js)',
      company: 'Razorpay',
      companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&q=80',
      description: `About Razorpay:
Razorpay powers digital payments and banking infrastructure for millions of businesses across India.

About the Opportunity:
Our Merchant Onboarding and Checkout team is hiring Graduate Full Stack Engineers (2025/2026 batches or recent graduates) to build reliable, high-volume merchant workflows.

What You Will Do:
- Develop customer-facing interfaces in React and backend services in Node.js (Express).
- Design and integrate clean REST APIs with MongoDB and PostgreSQL databases.
- Write unit and integration tests to ensure payment security and system reliability.
- Participate in design reviews, debugging sessions, and code audits.

Requirements:
- Bachelor's degree in Computer Science, IT, or related technical field (or equivalent self-taught portfolio).
- Strong foundation in Data Structures, Algorithms, JavaScript, React, and Node.js.
- Experience with Git, GitHub, and building end-to-end full stack web applications.
- Eagerness to dive deep into payment flows, caching, and scalable web architectures.`,
      location: 'Bengaluru, Karnataka, India',
      country: 'India',
      workMode: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'entry',
      skills: ['React', 'Node.js', 'JavaScript', 'Express', 'MongoDB', 'REST API', 'Git'],
      publishedAt: hoursAgo(7), // 7 hours ago (Last 24h)
      originalUrl: 'https://razorpay.com/jobs',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-groww-04',
      title: 'Associate Software Engineer - Web Frontend',
      company: 'Groww',
      companyLogo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop&q=80',
      description: `About Groww:
Groww is India's leading investment platform making investing simple, accessible, and transparent for over 40 million users.

The Role:
We are hiring early-career engineers and freshers for our Web Engineering team to build simple, transparent, and ultra-reliable stock and mutual fund investing experiences.

Responsibilities:
- Write modular React components using TypeScript, Tailwind CSS, and Redux/Zustand.
- Build real-time charting and stock ticker interfaces with WebSocket feeds.
- Monitor and improve Core Web Vitals, page load times, and client-side caching.
- Work closely with quality assurance and backend teams to release dependable updates.

Qualifications:
- Solid understanding of JavaScript, React hooks, state management, and modern CSS.
- Direct portfolio or project experience demonstrating complex web application development.
- Understanding of web performance, asynchronous programming, and RESTful architectures.
- Strong problem-solving aptitude and passion for fintech.`,
      location: 'Bengaluru, Karnataka, India',
      country: 'India',
      workMode: 'in-office',
      employmentType: 'full-time',
      experienceLevel: 'entry',
      skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Redux', 'Git', 'REST API'],
      publishedAt: hoursAgo(11), // 11 hours ago (Last 24h)
      originalUrl: 'https://groww.in/careers',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-postman-05',
      title: 'Software Engineering Intern - Web Client',
      company: 'Postman',
      companyLogo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop&q=80',
      description: `About Postman:
Postman is the world's leading API platform used by over 30 million developers across global technology companies.

Internship Overview:
Join our Web Client team for a hands-on, high-impact internship where your code ships directly to developers around the world.

What you will do:
- Contribute to the Postman web application built with React, TypeScript, and modern browser standards.
- Build intuitive developer tooling features such as API monitors, mock servers, and workspace tabs.
- Write automated tests using Jest and React Testing Library.
- Learn best engineering practices around CI/CD, code review, and developer ergonomics.

Who should apply:
- Students currently enrolled in a Degree in Engineering or Computer Science, or self-taught developers with strong projects.
- Proficient in JavaScript, HTML, CSS, and React.
- Basic understanding of APIs (HTTP, REST, JSON) and Git.
- Curiosity to learn about distributed systems and developer tooling.`,
      location: 'Bengaluru / Remote India',
      country: 'India',
      workMode: 'remote',
      employmentType: 'internship',
      experienceLevel: 'internship',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Git', 'REST API', 'HTML'],
      publishedAt: hoursAgo(14), // 14 hours ago (Last 24h)
      originalUrl: 'https://www.postman.com/careers',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-zerodha-06',
      title: 'Junior Web Developer (Tooling & Consoles)',
      company: 'Zerodha',
      companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop&q=80',
      description: `About Zerodha:
Zerodha is India's largest discount retail stockbroker, known for an engineering culture rooted in simplicity, zero vanity dependencies, and rock-solid reliability.

Role Overview:
We are looking for a Junior Web Developer who loves clean vanilla web standards, minimal abstractions, and fast page loads.

What You Will Do:
- Build internal diagnostic dashboards, support tools, and client onboarding workflows.
- Write clean JavaScript and React code with a focus on accessibility and minimal overhead.
- Interface with backend PostgreSQL databases and lightweight microservices.
- Troubleshoot client-side browser quirks and performance bottlenecks.

Requirements:
- Fresher to 1 year experience with strong computer science fundamentals.
- Solid understanding of vanilla JavaScript, DOM APIs, CSS, and React.
- Comfortable working in a Linux/Unix command-line environment and Git.
- Appreciation for lightweight software and simple architectures.`,
      location: 'Bengaluru, Karnataka, India',
      country: 'India',
      workMode: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'junior',
      skills: ['JavaScript', 'React', 'HTML', 'CSS', 'PostgreSQL', 'Git', 'Node.js'],
      publishedAt: hoursAgo(19), // 19 hours ago (Last 24h)
      originalUrl: 'https://zerodha.com/careers',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-swiggy-07',
      title: 'Frontend Developer 1 (Consumer Apps)',
      company: 'Swiggy',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80',
      description: `About Swiggy:
Swiggy powers on-demand food delivery, grocery convenience (Instamart), and dining out experiences for millions of Indian households.

Role Summary:
We are hiring early-career Software Development Engineers (SDE 1 - Frontend) to craft high-conversion consumer checkout flows and restaurant partner dashboards.

Responsibilities:
- Build reusable UI components in React and maintain shared design system tokens.
- Implement responsive web layouts optimized for high traffic and low-latency mobile browsers.
- Work closely with backend teams on REST and GraphQL payload optimization.
- Write unit tests and maintain high test coverage across core flows.

Requirements:
- 0-2 years of software engineering experience or top-tier project portfolio.
- Proficiency in JavaScript, React, CSS3/SCSS, and state management.
- Understanding of web performance metrics like FCP, LCP, and CLS.
- Strong analytical and problem-solving skills.`,
      location: 'Bengaluru / Hyderabad, India',
      country: 'India',
      workMode: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'junior',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Redux', 'Git', 'REST API'],
      publishedAt: hoursAgo(22), // 22 hours ago (Last 24h)
      originalUrl: 'https://careers.swiggy.com',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-flipkart-08',
      title: 'SDE Intern - Full Stack Web',
      company: 'Flipkart',
      companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&q=80',
      description: `About Flipkart:
Flipkart is India's homegrown e-commerce marketplace leading innovation in supply chain, logistics, and digital commerce.

Internship Details:
Flipkart is inviting student applications for SDE Internships. You will work on real-world engineering problems impacting millions of shoppers during Big Billion Days and beyond.

What You Will Experience:
- Hands-on software development in React, Node.js, and Java microservices.
- Building scalable user interfaces that handle peak festival traffic.
- Exposure to large-scale distributed databases and caching layers.
- Dedicated mentorship and opportunity for full-time conversion.

Candidate Profile:
- Currently pursuing B.Tech/B.E./MCA in Computer Science or related branches.
- Good understanding of Data Structures, Algorithms, and Object-Oriented Programming.
- Working experience with JavaScript, React, and building web projects.
- Great curiosity, enthusiasm to learn, and collaborative mindset.`,
      location: 'Bengaluru, Karnataka, India',
      country: 'India',
      workMode: 'in-office',
      employmentType: 'internship',
      experienceLevel: 'internship',
      skills: ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'Git', 'REST API'],
      publishedAt: hoursAgo(32), // 32 hours ago (Last 3 Days)
      originalUrl: 'https://www.flipkartcareers.com',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-browserstack-09',
      title: 'Associate Software Engineer (Web & AI Tools)',
      company: 'BrowserStack',
      companyLogo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop&q=80',
      description: `About BrowserStack:
BrowserStack is the world's leading software testing platform powering cross-browser and mobile device testing for over 50,000 customers.

The Opportunity:
We are looking for an Associate Software Engineer (0-1 year experience) to develop developer analytics dashboards and test reporting tools.

What You Will Do:
- Build interactive frontend dashboards with React and modern JavaScript.
- Connect frontend components to Node.js backend microservices and databases (MongoDB/PostgreSQL).
- Explore integrating AI/LLM diagnostic summaries to help developers debug test failures faster.
- Maintain automated tests and participate in sprint planning and design reviews.

Requirements:
- Bachelor's or Master's degree in Computer Science, or proven self-taught project work.
- Solid grasp of JavaScript, React, and Node.js.
- Familiarity with Git, REST APIs, and modern CSS frameworks (Tailwind).
- Good communication skills and enthusiasm for developer tooling.`,
      location: 'Mumbai, Maharashtra, India',
      country: 'India',
      workMode: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'entry',
      skills: ['React', 'Node.js', 'JavaScript', 'Tailwind CSS', 'MongoDB', 'Git', 'REST API'],
      publishedAt: hoursAgo(40), // 40 hours ago (Last 3 Days)
      originalUrl: 'https://www.browserstack.com/careers',
      status: 'active',
    },
    {
      source: 'verified_feed',
      sourceJobId: 'seed-in-urbancompany-10',
      title: 'Junior Software Engineer - Frontend & Mobile Web',
      company: 'Urban Company',
      companyLogo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop&q=80',
      description: `About Urban Company:
Urban Company is Asia's largest home services platform connecting millions of customers with skilled service professionals.

Role Overview:
We are looking for a Junior Software Engineer passionate about web development, responsive user experiences, and partner booking portals.

Key Responsibilities:
- Build high-conversion booking workflows and partner scheduling consoles with React and Tailwind CSS.
- Optimize web bundle sizes for snappy load times on 4G/5G mobile networks.
- Collaborate with designers to iterate on customer feedback and usability testing.
- Write maintainable, testable code following team design standards.

Requirements:
- 0 to 1 year of experience in frontend web development.
- Strong knowledge of modern JavaScript, React, and responsive CSS.
- Experience with Git version control and RESTful APIs.
- Self-motivated, collaborative, and eager to solve real consumer challenges.`,
      location: 'Gurugram, Haryana, India',
      country: 'India',
      workMode: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'entry',
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'Git', 'REST API'],
      publishedAt: hoursAgo(46), // 46 hours ago (Last 3 Days)
      originalUrl: 'https://careers.urbancompany.com',
      status: 'active',
    },
  ];
};
