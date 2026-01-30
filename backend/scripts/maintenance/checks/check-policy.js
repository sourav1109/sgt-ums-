require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPolicy() {
  try {
    const policy = await prisma.researchIncentivePolicy.findFirst({
      where: {
        publicationType: 'research_paper',
        isActive: true
      }
    });
    
    console.log('\n=== ACTIVE RESEARCH PAPER POLICY ===\n');
    if (policy) {
      console.log('Policy Name:', policy.policyName);
      console.log('Base Incentive:', policy.baseIncentiveAmount);
      console.log('Base Points:', policy.basePoints);
      console.log('\n--- Author Percentages ---');
      console.log('First Author:', policy.first_author_percentage, '%');
      console.log('Corresponding Author:', policy.corresponding_author_percentage, '%');
      const coAuthorPool = 100 - Number(policy.first_author_percentage || 0) - Number(policy.corresponding_author_percentage || 0);
      console.log('Co-Author Pool:', coAuthorPool, '%');
      console.log('\nDistribution Method:', policy.distributionMethod || 'author_role_based');
      
      console.log('\n--- What First+Corresponding Should Get ---');
      const firstAndCorr = Number(policy.first_author_percentage || 0) + Number(policy.corresponding_author_percentage || 0);
      console.log('First + Corresponding (same person):', firstAndCorr, '%');
      console.log('From ₹2,00,000:', '₹' + ((200000 * firstAndCorr) / 100).toLocaleString());
    } else {
      console.log('❌ No active policy found!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPolicy();
