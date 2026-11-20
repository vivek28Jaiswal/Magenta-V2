const mongoose = require('mongoose');

async function testClarity() {
  const { User } = await import('./server/models/User.js');
  const { Resume } = await import('./server/models/Resume.js');
  const { generateApplicationClarityReport } = await import('./server/services/analysis/applicationClarityService.js');
  const { connectDB } = await import('./server/config/db.js');

  await connectDB();

  const user = await User.findOne({ email: 'vivek@example.com' });
  console.log('User found:', user?._id);

  const sampleJD = `Role: Senior Frontend Engineer
Company: Zepto
Location: Bengaluru, India

Requirements:
- 3+ years experience with React and JavaScript
- Strong hands-on work with Tailwind CSS and Redux
- Experience building high-performance web interfaces
- Good knowledge of REST APIs and Git`;

  try {
    const report = await generateApplicationClarityReport({
      userId: user._id,
      resumeId: user.resume,
      jobDescription: sampleJD,
      jobDetails: { title: 'Senior Frontend Engineer', company: 'Zepto' }
    });
    console.log('Report generated successfully! ID:', report._id);
  } catch (err) {
    console.error('ERROR during generateApplicationClarityReport:', err);
  }

  process.exit(0);
}

testClarity();
