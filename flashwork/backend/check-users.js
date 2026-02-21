const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      skills: true
    }
  });
  
  console.log('Users in database:');
  users.forEach(u => {
    console.log(`- ${u.email} (${u.role}) - Skills: ${u.skills ? u.skills.join(', ') : 'None'}`);
  });
  
  await prisma.$disconnect();
}

checkUsers();
