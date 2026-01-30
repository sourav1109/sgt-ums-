const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.researchIncentivePolicy.findFirst({
  where: { publicationType: 'research_paper', isActive: true }
}).then(policy => {
  if (policy) {
    console.log('\n=== CURRENT POLICY IN DATABASE ===');
    console.log('First Author %:', policy.first_author_percentage);
    console.log('Corresponding Author %:', policy.corresponding_author_percentage);
    const combined = Number(policy.first_author_percentage || 0) + Number(policy.corresponding_author_percentage || 0);
    console.log('Combined (First+Corr):', combined, '%');
    console.log('\nFrom ₹2,00,000:');
    console.log('First+Corresponding should get: ₹' + ((200000 * combined) / 100).toLocaleString());
  } else {
    console.log('No policy found');
  }
  prisma.$disconnect();
}).catch(e => {
  console.error('Error:', e.message);
  prisma.$disconnect();
});
