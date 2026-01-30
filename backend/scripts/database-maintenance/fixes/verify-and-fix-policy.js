require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyAndFixPolicy() {
  try {
    console.log('🔍 Checking active research paper policy...\n');
    
    const policy = await prisma.researchIncentivePolicy.findFirst({
      where: {
        publicationType: 'research_paper',
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!policy) {
      console.log('❌ No active policy found!');
      await prisma.$disconnect();
      return;
    }

    console.log('📋 Current Active Policy:');
    console.log('   ID:', policy.id);
    console.log('   Name:', policy.policyName);
    console.log('   First Author %:', policy.first_author_percentage);
    console.log('   Corresponding Author %:', policy.corresponding_author_percentage);
    console.log('   Total (First+Corresponding):', (policy.first_author_percentage || 0) + (policy.corresponding_author_percentage || 0), '%');
    console.log('   Co-Author Total:', 100 - (policy.first_author_percentage || 0) - (policy.corresponding_author_percentage || 0), '%');
    console.log('   Distribution Method:', policy.distributionMethod);
    console.log('   Active:', policy.isActive);
    console.log('   Effective From:', policy.effectiveFrom);
    console.log('   Effective To:', policy.effectiveTo || 'No end date');

    // Check if update is needed
    if (policy.corresponding_author_percentage === 40 && policy.first_author_percentage === 40) {
      console.log('\n✅ Policy already has correct percentages (40% + 40% = 80%)');
      console.log('   First + Corresponding = 80% ✓');
      console.log('   Co-Authors = 20% ✓');
      await prisma.$disconnect();
      return;
    }

    console.log('\n⚠️  Policy needs update!');
    console.log(`   Current: ${policy.first_author_percentage}% + ${policy.corresponding_author_percentage}% = ${(policy.first_author_percentage || 0) + (policy.corresponding_author_percentage || 0)}%`);
    console.log('   Target:  40% + 40% = 80%');
    console.log('\n🔧 Updating policy...');

    const updated = await prisma.researchIncentivePolicy.update({
      where: { id: policy.id },
      data: {
        first_author_percentage: 40,
        corresponding_author_percentage: 40
      }
    });

    console.log('\n✅ Policy updated successfully!');
    console.log('   First Author:', updated.first_author_percentage, '%');
    console.log('   Corresponding Author:', updated.corresponding_author_percentage, '%');
    console.log('   Total (First+Corresponding):', updated.first_author_percentage + updated.corresponding_author_percentage, '%');
    console.log('   Co-Author Pool:', 100 - updated.first_author_percentage - updated.corresponding_author_percentage, '%');

    console.log('\n📊 Example Calculation (₹200,000 total pool):');
    const total = 200000;
    const firstShare = (total * updated.first_author_percentage) / 100;
    const correspondingShare = (total * updated.corresponding_author_percentage) / 100;
    const coAuthorPool = (total * (100 - updated.first_author_percentage - updated.corresponding_author_percentage)) / 100;
    
    console.log(`   First Author:        ₹${firstShare.toLocaleString()} (${updated.first_author_percentage}%)`);
    console.log(`   Corresponding:       ₹${correspondingShare.toLocaleString()} (${updated.corresponding_author_percentage}%)`);
    console.log(`   Co-Author Pool:      ₹${coAuthorPool.toLocaleString()} (${100 - updated.first_author_percentage - updated.corresponding_author_percentage}%)`);
    console.log(`   First+Corresponding: ₹${(firstShare + correspondingShare).toLocaleString()} (${updated.first_author_percentage + updated.corresponding_author_percentage}%)`);

    await prisma.$disconnect();
    console.log('\n✅ Done! Test by creating a new research paper contribution.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyAndFixPolicy();
