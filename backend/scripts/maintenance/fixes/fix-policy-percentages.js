require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPolicy() {
  try {
    console.log('\n🔧 Updating Research Policy Percentages...\n');
    
    const policy = await prisma.researchIncentivePolicy.findFirst({
      where: {
        publicationType: 'research_paper',
        isActive: true
      }
    });
    
    if (!policy) {
      console.log('❌ No active policy found!');
      await prisma.$disconnect();
      return;
    }
    
    console.log('📋 Current Policy:');
    console.log(`   Name: ${policy.policyName}`);
    console.log(`   First Author: ${policy.first_author_percentage}%`);
    console.log(`   Corresponding Author: ${policy.corresponding_author_percentage}%`);
    console.log(`   Total (First+Corresponding): ${Number(policy.first_author_percentage) + Number(policy.corresponding_author_percentage)}%`);
    
    // Update the policy
    const updated = await prisma.researchIncentivePolicy.update({
      where: { id: policy.id },
      data: {
        first_author_percentage: 40,
        corresponding_author_percentage: 40  // Change from 30 to 40
      }
    });
    
    console.log('\n✅ Policy Updated!');
    console.log(`   First Author: ${updated.first_author_percentage}%`);
    console.log(`   Corresponding Author: ${updated.corresponding_author_percentage}%`);
    console.log(`   Total (First+Corresponding): ${Number(updated.first_author_percentage) + Number(updated.corresponding_author_percentage)}%`);
    console.log(`   Co-Authors get: ${100 - Number(updated.first_author_percentage) - Number(updated.corresponding_author_percentage)}%`);
    
    console.log('\n💡 From ₹2,00,000 base:');
    console.log(`   First+Corresponding: ₹${((200000 * 80) / 100).toLocaleString()}`);
    console.log(`   Co-Authors share: ₹${((200000 * 20) / 100).toLocaleString()}`);
    
    console.log('\n⚠️  IMPORTANT: Existing contributions have old values stored.');
    console.log('   Option 1: Edit & save each contribution to recalculate');
    console.log('   Option 2: Run: node recalculate-all-research-papers.js\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixPolicy();
