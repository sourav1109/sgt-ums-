const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Try to fetch the contribution
    const contribution = await prisma.researchContribution.findUnique({
      where: { id: 'a2936fbb-17b3-4c2f-b5fd-808482439630' },
      select: {
        id: true,
        title: true,
        volume: true,
        naasRating: true,
        indexingCategories: true,
        status: true
      }
    });
    
    if (contribution) {
      console.log('\n📄 Contribution found in database:');
      console.log('Title:', contribution.title);
      console.log('Volume:', contribution.volume);
      console.log('NAAS Rating:', contribution.naasRating ? Number(contribution.naasRating) : null);
      console.log('Indexing Categories:', contribution.indexingCategories);
      console.log('Status:', contribution.status);
    } else {
      console.log('\n❌ Contribution not found in database');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
}

testConnection();
