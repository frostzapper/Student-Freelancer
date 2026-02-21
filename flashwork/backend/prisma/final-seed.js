const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.auctionBid.deleteMany();
  await prisma.workerGroupMember.deleteMany();
  await prisma.workerEntity.deleteMany();
  await prisma.escrow.deleteMany();
  await prisma.job.deleteMany();
  await prisma.workerSchedule.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.withdrawalRequest.deleteMany();
  await prisma.trustFund.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const client1 = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh@client.com',
      password_hash: hashedPassword,
      role: 'client',
      wallet_balance: 50000,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@client.com',
      password_hash: hashedPassword,
      role: 'client',
      wallet_balance: 30000,
    },
  });

  const worker1 = await prisma.user.create({
    data: {
      name: 'Amit Patel',
      email: 'amit@worker.com',
      password_hash: hashedPassword,
      role: 'worker',
      wallet_balance: 0,
      skills: ['Data Entry', 'Excel', 'Writing', 'Proofreading'],
      education: 'B.Com Graduate',
      is_student: false,
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      name: 'Sneha Reddy',
      email: 'sneha@worker.com',
      password_hash: hashedPassword,
      role: 'worker',
      wallet_balance: 0,
      skills: ['Design', 'Canva', 'PowerPoint', 'Graphics'],
      education: 'BBA Student',
      is_student: true,
      daily_hour_limit: 4,
      weekly_hour_limit: 20,
    },
  });

  const worker3 = await prisma.user.create({
    data: {
      name: 'Vikram Singh',
      email: 'vikram@worker.com',
      password_hash: hashedPassword,
      role: 'worker',
      wallet_balance: 0,
      skills: ['Video Editing', 'Photography', 'Content Creation'],
      education: 'Mass Communication Graduate',
      is_student: false,
    },
  });

  console.log('Created users');

  // Helper function to create deadline
  const getDeadline = (hoursFromNow) => {
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + hoursFromNow);
    return deadline;
  };

  // ONLINE JOBS (11 jobs)
  
  // Short Hours (2-5h) - Student Friendly
  const job1 = await prisma.job.create({
    data: {
      title: 'Data Entry - Excel Spreadsheet',
      description: 'Enter 500 rows of customer data into Excel spreadsheet. Clean formatting required.',
      base_price: 500,
      current_price: 500,
      pricing_mode: 'rising',
      deadline: getDeadline(24),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      estimated_hours: 3,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job1.id,
      locked_amount: 500,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'PowerPoint Presentation Design',
      description: 'Create a 15-slide professional presentation for business pitch. Modern design needed.',
      base_price: 550,
      current_price: 550,
      pricing_mode: 'declining',
      deadline: getDeadline(36),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 3,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job2.id,
      locked_amount: 550,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: 'English Proofreading Service',
      description: 'Proofread and edit a 3000-word academic article. Check grammar, spelling, and flow.',
      base_price: 600,
      current_price: 600,
      pricing_mode: 'rising',
      deadline: getDeadline(18),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      estimated_hours: 3,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job3.id,
      locked_amount: 600,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: 'Assignment Writing - History Essay',
      description: 'Write a 2000-word essay on Indian Independence Movement. Proper citations required.',
      base_price: 650,
      current_price: 650,
      pricing_mode: 'rising',
      deadline: getDeadline(48),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 4,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job4.id,
      locked_amount: 650,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job5 = await prisma.job.create({
    data: {
      title: 'Social Media Graphics - Canva',
      description: 'Design 10 Instagram posts for fashion brand. Consistent branding and modern aesthetic.',
      base_price: 700,
      current_price: 700,
      pricing_mode: 'declining',
      deadline: getDeadline(30),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 4,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job5.id,
      locked_amount: 700,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  // Medium Hours (6-10h)
  const job6 = await prisma.job.create({
    data: {
      title: 'Website Content Writing',
      description: 'Write content for 5 website pages (About, Services, Blog posts). SEO optimized.',
      base_price: 1250,
      current_price: 1250,
      pricing_mode: 'declining',
      deadline: getDeadline(72),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 8,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job6.id,
      locked_amount: 1250,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job7 = await prisma.job.create({
    data: {
      title: 'Excel Dashboard Creation',
      description: 'Create interactive Excel dashboard with charts, pivot tables, and KPI tracking.',
      base_price: 1350,
      current_price: 1350,
      pricing_mode: 'declining',
      deadline: getDeadline(24),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      estimated_hours: 7,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job7.id,
      locked_amount: 1350,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job8 = await prisma.job.create({
    data: {
      title: 'Video Editing - YouTube Channel',
      description: 'Edit 3 YouTube videos (10 min each). Add transitions, music, subtitles, and thumbnails.',
      base_price: 1450,
      current_price: 1450,
      pricing_mode: 'rising',
      deadline: getDeadline(96),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 10,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job8.id,
      locked_amount: 1450,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job9 = await prisma.job.create({
    data: {
      title: 'Logo Design Package',
      description: 'Design professional logo with 3 concepts, unlimited revisions, and brand guidelines.',
      base_price: 1550,
      current_price: 1550,
      pricing_mode: 'rising',
      deadline: getDeadline(120),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 9,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job9.id,
      locked_amount: 1550,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  // Long Hours (12-20h)
  const job10 = await prisma.job.create({
    data: {
      title: 'Mobile App Testing - Full QA',
      description: 'Complete QA testing of Android app. Test all features, report bugs, create test cases.',
      base_price: 3200,
      current_price: 3200,
      pricing_mode: 'declining',
      deadline: getDeadline(168),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: false,
      estimated_hours: 15,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job10.id,
      locked_amount: 3200,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job11 = await prisma.job.create({
    data: {
      title: 'Social Media Management - 2 Weeks',
      description: 'Manage Instagram and Facebook for 2 weeks. Daily posts, engagement, analytics reports.',
      base_price: 3800,
      current_price: 3800,
      pricing_mode: 'rising',
      deadline: getDeadline(336),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 20,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job11.id,
      locked_amount: 3800,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  // OFFLINE JOBS (8 jobs)
  
  // Short Hours (2-5h)
  const job12 = await prisma.job.create({
    data: {
      title: 'Flyer Distribution - College Campus',
      description: 'Distribute 500 flyers at college campus in Koramangala. Must cover all departments.',
      base_price: 520,
      current_price: 520,
      pricing_mode: 'rising',
      deadline: getDeadline(12),
      work_mode: 'solo',
      work_location: 'offline',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      estimated_hours: 3,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job12.id,
      locked_amount: 520,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job13 = await prisma.job.create({
    data: {
      title: 'Grocery Shopping & Delivery',
      description: 'Buy groceries from list and deliver to Indiranagar address. Receipt required.',
      base_price: 580,
      current_price: 580,
      pricing_mode: 'declining',
      deadline: getDeadline(8),
      work_mode: 'solo',
      work_location: 'offline',
      ai_allowed: false,
      status: 'open',
      urgent_status: false,
      estimated_hours: 3,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job13.id,
      locked_amount: 580,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job14 = await prisma.job.create({
    data: {
      title: 'Pet Walking Service',
      description: 'Walk 2 dogs in Whitefield area. Morning and evening walks for 2 days.',
      base_price: 620,
      current_price: 620,
      pricing_mode: 'rising',
      deadline: getDeadline(48),
      work_mode: 'solo',
      work_location: 'offline',
      ai_allowed: false,
      status: 'open',
      urgent_status: false,
      estimated_hours: 4,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job14.id,
      locked_amount: 620,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job15 = await prisma.job.create({
    data: {
      title: 'Mystery Shopping - Restaurant',
      description: 'Visit restaurant on MG Road, order meal, evaluate service. Submit detailed report.',
      base_price: 820,
      current_price: 820,
      pricing_mode: 'declining',
      deadline: getDeadline(24),
      work_mode: 'solo',
      work_location: 'offline',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      estimated_hours: 3,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job15.id,
      locked_amount: 820,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  // Medium Hours (6-10h)
  const job16 = await prisma.job.create({
    data: {
      title: 'Home Cleaning Service',
      description: 'Deep clean 3BHK apartment in BTM Layout. Kitchen, bathrooms, all rooms.',
      base_price: 1080,
      current_price: 1080,
      pricing_mode: 'declining',
      deadline: getDeadline(36),
      work_mode: 'solo',
      work_location: 'offline',
      ai_allowed: false,
      status: 'open',
      urgent_status: false,
      estimated_hours: 7,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job16.id,
      locked_amount: 1080,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job17 = await prisma.job.create({
    data: {
      title: 'Product Photography - Store',
      description: 'Photograph 50 products for e-commerce store on Commercial Street. Professional quality.',
      base_price: 1180,
      current_price: 1180,
      pricing_mode: 'rising',
      deadline: getDeadline(48),
      work_mode: 'solo',
      work_location: 'offline',
      ai_allowed: false,
      status: 'open',
      urgent_status: false,
      estimated_hours: 6,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job17.id,
      locked_amount: 1180,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job18 = await prisma.job.create({
    data: {
      title: 'Furniture Assembly - IKEA',
      description: 'Assemble IKEA furniture in HSR Layout apartment. Bed, wardrobe, desk, shelves.',
      base_price: 1380,
      current_price: 1380,
      pricing_mode: 'rising',
      deadline: getDeadline(24),
      work_mode: 'solo',
      work_location: 'offline',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      estimated_hours: 8,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job18.id,
      locked_amount: 1380,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  // Group Job
  const job19 = await prisma.job.create({
    data: {
      title: 'Event Setup & Management',
      description: 'Setup and manage corporate event in Electronic City. Stage, seating, registration, coordination.',
      base_price: 2600,
      current_price: 2600,
      pricing_mode: 'declining',
      deadline: getDeadline(72),
      work_mode: 'group',
      work_location: 'offline',
      ai_allowed: false,
      status: 'open',
      urgent_status: false,
      estimated_hours: 12,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job19.id,
      locked_amount: 2600,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  // HYBRID JOB (1 job)
  const job20 = await prisma.job.create({
    data: {
      title: 'Photography + Online Editing',
      description: 'Photograph event in Marathahalli (4h) + edit 100 photos online (6h). Deliver edited album.',
      base_price: 2100,
      current_price: 2100,
      pricing_mode: 'rising',
      deadline: getDeadline(96),
      work_mode: 'solo',
      work_location: 'online',
      ai_allowed: true,
      status: 'open',
      urgent_status: true,
      estimated_hours: 10,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job20.id,
      locked_amount: 2100,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  console.log('Created all 20 jobs with escrow');

  // ADDITIONAL SKILL-SPECIFIC JOBS (10 more jobs)
  
  // JavaScript/Programming Jobs
  const job21 = await prisma.job.create({
    data: {
      title: 'JavaScript Bug Fixing',
      description: 'Fix 5 JavaScript bugs in existing website. Experience with vanilla JS and DOM manipulation required.',
      base_price: 1200,
      current_price: 1200,
      pricing_mode: 'rising',
      deadline: getDeadline(48),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 6,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job21.id,
      locked_amount: 1200,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job22 = await prisma.job.create({
    data: {
      title: 'Python Data Analysis Script',
      description: 'Write Python script to analyze CSV data and generate charts. Pandas and Matplotlib knowledge needed.',
      base_price: 1500,
      current_price: 1500,
      pricing_mode: 'rising',
      deadline: getDeadline(60),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 8,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job22.id,
      locked_amount: 1500,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  // Design Jobs
  const job23 = await prisma.job.create({
    data: {
      title: 'Logo Design for Startup',
      description: 'Create modern minimalist logo for tech startup. Provide 3 concepts with revisions. Adobe Illustrator or Figma.',
      base_price: 1800,
      current_price: 1800,
      pricing_mode: 'declining',
      deadline: getDeadline(72),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 10,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job23.id,
      locked_amount: 1800,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job24 = await prisma.job.create({
    data: {
      title: 'UI/UX Design - Mobile App',
      description: 'Design 10 screens for food delivery app. Figma preferred. Modern, clean interface needed.',
      base_price: 2500,
      current_price: 2500,
      pricing_mode: 'rising',
      deadline: getDeadline(96),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: true,
      estimated_hours: 15,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job24.id,
      locked_amount: 2500,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  // Content Creation Jobs
  const job25 = await prisma.job.create({
    data: {
      title: 'Blog Writing - Technology Articles',
      description: 'Write 5 blog posts (800 words each) about latest tech trends. SEO optimized content needed.',
      base_price: 1400,
      current_price: 1400,
      pricing_mode: 'declining',
      deadline: getDeadline(84),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 10,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job25.id,
      locked_amount: 1400,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job26 = await prisma.job.create({
    data: {
      title: 'Video Editing - YouTube Content',
      description: 'Edit 3 YouTube videos (10 min each). Add transitions, music, subtitles. Premiere Pro or Final Cut.',
      base_price: 1600,
      current_price: 1600,
      pricing_mode: 'rising',
      deadline: getDeadline(60),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      estimated_hours: 12,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job26.id,
      locked_amount: 1600,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  // Marketing Jobs
  const job27 = await prisma.job.create({
    data: {
      title: 'Social Media Marketing Strategy',
      description: 'Create comprehensive social media strategy for small business. Include content calendar and posting schedule.',
      base_price: 1300,
      current_price: 1300,
      pricing_mode: 'declining',
      deadline: getDeadline(72),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 8,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job27.id,
      locked_amount: 1300,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  // Data Entry & Excel Jobs
  const job28 = await prisma.job.create({
    data: {
      title: 'Excel Dashboard Creation',
      description: 'Create interactive Excel dashboard with charts and pivot tables. Sales data visualization needed.',
      base_price: 1100,
      current_price: 1100,
      pricing_mode: 'rising',
      deadline: getDeadline(48),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: false,
      estimated_hours: 7,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job28.id,
      locked_amount: 1100,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  // Photography Jobs
  const job29 = await prisma.job.create({
    data: {
      title: 'Product Photography - E-commerce',
      description: 'Photograph 50 products for online store. White background, professional lighting. Deliver edited images.',
      base_price: 2200,
      current_price: 2200,
      pricing_mode: 'declining',
      deadline: getDeadline(96),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: false,
      estimated_hours: 12,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job29.id,
      locked_amount: 2200,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  // Translation/Proofreading Jobs
  const job30 = await prisma.job.create({
    data: {
      title: 'English to Hindi Translation',
      description: 'Translate 5000-word business document from English to Hindi. Professional quality required.',
      base_price: 900,
      current_price: 900,
      pricing_mode: 'rising',
      deadline: getDeadline(60),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: false,
      estimated_hours: 6,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job30.id,
      locked_amount: 900,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  console.log('Created 10 additional skill-specific jobs');

  // URGENT & AUCTION MODE JOBS (10 jobs)
  
  const job31 = await prisma.job.create({
    data: {
      title: 'URGENT: Website Bug Fix Needed NOW',
      description: 'Critical bug on production website. Need immediate fix. JavaScript error breaking checkout flow.',
      base_price: 2000,
      current_price: 2000,
      pricing_mode: 'rising',
      deadline: getDeadline(6),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 3,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job31.id,
      locked_amount: 2000,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job32 = await prisma.job.create({
    data: {
      title: 'URGENT: Presentation Design - Meeting Tomorrow',
      description: 'Need professional PowerPoint presentation designed by tonight. 20 slides for investor pitch.',
      base_price: 1500,
      current_price: 1500,
      pricing_mode: 'rising',
      deadline: getDeadline(8),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 5,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job32.id,
      locked_amount: 1500,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job33 = await prisma.job.create({
    data: {
      title: 'URGENT: Data Entry - Deadline Today',
      description: 'Need 1000 records entered into Excel spreadsheet. Must be completed within 4 hours.',
      base_price: 1200,
      current_price: 1200,
      pricing_mode: 'rising',
      deadline: getDeadline(4),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 4,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job33.id,
      locked_amount: 1200,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job34 = await prisma.job.create({
    data: {
      title: 'URGENT: Video Editing - Event Tomorrow',
      description: 'Edit 10-minute promotional video for event tomorrow morning. Fast turnaround needed.',
      base_price: 2500,
      current_price: 2500,
      pricing_mode: 'rising',
      deadline: getDeadline(12),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 6,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job34.id,
      locked_amount: 2500,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job35 = await prisma.job.create({
    data: {
      title: 'URGENT: Logo Design - Launch This Week',
      description: 'Startup launching this week. Need professional logo ASAP. 3 concepts with revisions.',
      base_price: 3000,
      current_price: 3000,
      pricing_mode: 'rising',
      deadline: getDeadline(24),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 8,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job35.id,
      locked_amount: 3000,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job36 = await prisma.job.create({
    data: {
      title: 'URGENT: Content Writing - Blog Posts Needed',
      description: 'Need 5 blog posts (1000 words each) written urgently for SEO campaign launch.',
      base_price: 1800,
      current_price: 1800,
      pricing_mode: 'rising',
      deadline: getDeadline(18),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 10,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job36.id,
      locked_amount: 1800,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job37 = await prisma.job.create({
    data: {
      title: 'URGENT: Social Media Graphics - Campaign Starting',
      description: 'Need 20 Instagram posts designed urgently. Campaign starts tomorrow morning.',
      base_price: 1600,
      current_price: 1600,
      pricing_mode: 'rising',
      deadline: getDeadline(10),
      work_mode: 'solo',
      ai_allowed: true,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 6,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job37.id,
      locked_amount: 1600,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job38 = await prisma.job.create({
    data: {
      title: 'URGENT: Excel Dashboard - Board Meeting',
      description: 'Create interactive Excel dashboard for board meeting tomorrow. Sales data visualization.',
      base_price: 2200,
      current_price: 2200,
      pricing_mode: 'rising',
      deadline: getDeadline(14),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 7,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job38.id,
      locked_amount: 2200,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  const job39 = await prisma.job.create({
    data: {
      title: 'URGENT: Product Photography - Listing Today',
      description: 'Need 30 products photographed professionally. E-commerce listing going live tonight.',
      base_price: 2800,
      current_price: 2800,
      pricing_mode: 'rising',
      deadline: getDeadline(8),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 5,
      client_id: client1.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job39.id,
      locked_amount: 2800,
      status: 'locked',
      locked: true,
      client_id: client1.id,
    },
  });

  const job40 = await prisma.job.create({
    data: {
      title: 'URGENT: Translation - Contract Signing Tomorrow',
      description: 'Urgent translation of legal contract from English to Hindi. 3000 words. Signing tomorrow.',
      base_price: 1400,
      current_price: 1400,
      pricing_mode: 'rising',
      deadline: getDeadline(12),
      work_mode: 'solo',
      ai_allowed: false,
      status: 'open',
      urgent_status: true,
      auction_mode: true,
      estimated_hours: 6,
      client_id: client2.id,
    },
  });

  await prisma.escrow.create({
    data: {
      job_id: job40.id,
      locked_amount: 1400,
      status: 'locked',
      locked: true,
      client_id: client2.id,
    },
  });

  console.log('Created 10 urgent auction mode jobs');

  // Create Trust Fund
  await prisma.trustFund.create({
    data: {
      balance: 0,
    },
  });

  console.log('Created trust fund');

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- 2 Clients created');
  console.log('- 3 Workers created');
  console.log('- 40 Jobs created (32 Online, 8 Offline)');
  console.log('- 10 Urgent Auction Mode jobs');
  console.log('- 40 Escrow records created');
  console.log('- 1 Trust Fund created');
  console.log('\n🔑 Login Credentials:');
  console.log('Client 1: rajesh@client.com / password123');
  console.log('Client 2: priya@client.com / password123');
  console.log('Worker 1: amit@worker.com / password123 (Skills: Data Entry, Excel, Writing, Proofreading)');
  console.log('Worker 2: sneha@worker.com / password123 (Skills: Design, Canva, PowerPoint, Graphics) - Student');
  console.log('Worker 3: vikram@worker.com / password123 (Skills: Video Editing, Photography, Content Creation)');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
