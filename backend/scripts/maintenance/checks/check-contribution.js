const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkContribution() {
  try {
    const contribution = await prisma.researchContribution.findUnique({
      where: { id: 'a2936fbb-17b3-4c2f-b5fd-808482439630' },
      select: {
        id: true,
        title: true,
        volume: true,
        naasRating: true,
        indexingCategories: true,
        publicationType: true,
        status: true,
        issue: true,
        pageNumbers: true,
        doi: true,
        issn: true,
        journalName: true,
        impactFactor: true,
        sjr: true,
        quartile: true
      }
    });
    
    console.log('=== DATABASE DIRECT QUERY ===');
    console.log('ID:', contribution?.id);
    console.log('Title:', contribution?.title);
    console.log('Volume:', contribution?.volume);
    console.log('NAAS Rating:', contribution?.naasRating);
    console.log('Indexing Categories:', contribution?.indexingCategories);
    console.log('Publication Type:', contribution?.publicationType);
    console.log('Status:', contribution?.status);
    console.log('Issue:', contribution?.issue);
    console.log('Page Numbers:', contribution?.pageNumbers);
    console.log('DOI:', contribution?.doi);
    console.log('ISSN:', contribution?.issn);
    console.log('Journal Name:', contribution?.journalName);
    console.log('Impact Factor:', contribution?.impactFactor);
    console.log('SJR:', contribution?.sjr);
    console.log('Quartile:', contribution?.quartile);
    console.log('');
    console.log('=== FULL JSON ===');
    console.log(JSON.stringify(contribution, (key, value) => {
      // Handle Decimal type
      if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
        return Number(value);
      }
      return value;
    }, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContribution();
