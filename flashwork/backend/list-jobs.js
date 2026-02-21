const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listJobs() {
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      work_mode: true,
      work_location: true,
      estimated_hours: true,
      current_price: true,
      urgent_status: true,
      auction_mode: true,
    },
    orderBy: { id: 'asc' }
  });

  console.log('\n=== ALL JOBS ===\n');
  jobs.forEach(j => {
    const title = j.title.substring(0, 45).padEnd(45);
    const mode = j.work_mode.padEnd(5);
    const location = j.work_location.padEnd(7);
    const urgent = j.urgent_status ? '⚡' : '  ';
    const auction = j.auction_mode ? '🎯' : '  ';
    console.log(`${String(j.id).padStart(2)} | ${title} | ${mode} | ${location} | ${String(j.estimated_hours).padStart(2)}h | ₹${String(j.current_price).padStart(4)} ${urgent} ${auction}`);
  });

  console.log(`\nTotal: ${jobs.length} jobs`);
  const online = jobs.filter(j => j.work_location === 'online').length;
  const offline = jobs.filter(j => j.work_location === 'offline').length;
  console.log(`Online: ${online}, Offline: ${offline}`);

  await prisma.$disconnect();
}

listJobs();
