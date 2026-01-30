require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePolicy() {
  try {
    console.log('🔍 Finding existing policy...');
    
    const existingPolicy = await prisma.researchIncentivePolicy.findFirst({
      where: {
        publicationType: 'research_paper'
      }
    });

    if (!existingPolicy) {
      console.log('❌ No research paper policy found!');
      await prisma.$disconnect();
      return;
    }

    console.log(`\n📝 Current policy: ${existingPolicy.policyName}`);
    console.log(`   First Author: ${existingPolicy.first_author_percentage}%`);
    console.log(`   Corresponding Author: ${existingPolicy.corresponding_author_percentage}%`);
    console.log(`   Active: ${existingPolicy.isActive}`);

    console.log('\n🔧 Updating policy to 40% + 40% = 80%...');

    const updated = await prisma.researchIncentivePolicy.update({
      where: { id: existingPolicy.id },
      data: {
        policyName: 'Research Paper Policy 2026 - 11 Categories',
        first_author_percentage: 40,
        corresponding_author_percentage: 40,
        isActive: true,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31')
      }
    });

    console.log('\n✅ Policy updated successfully!');
    console.log(`   First Author: ${updated.first_author_percentage}%`);
    console.log(`   Corresponding Author: ${updated.corresponding_author_percentage}%`);
    console.log(`   Total for First+Corresponding: ${updated.first_author_percentage + updated.corresponding_author_percentage}%`);
    console.log(`   Active: ${updated.isActive}`);
    console.log(`   Period: ${updated.startDate} to ${updated.endDate}`);

    await prisma.$disconnect();
    console.log('\n✅ Done! You can now test creating new research papers.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updatePolicy();
