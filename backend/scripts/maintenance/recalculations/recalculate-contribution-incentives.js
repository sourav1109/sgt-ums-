/**
 * Script to recalculate incentives for a specific research contribution
 * This will update the author incentive shares based on the current policy and fixed logic
 * 
 * Usage: node recalculate-contribution-incentives.js <contribution-id>
 * Example: node recalculate-contribution-incentives.js 7e37b5c9-35fb-4376-9a29-b3005b75c394
 */

const { PrismaClient } = require('@prisma/client');
const { calculateIncentives } = require('./src/master/controllers/researchContribution.controller');

const prisma = new PrismaClient();

async function recalculateContributionIncentives(contributionId) {
  try {
    console.log(`\n[Recalculate] Starting for contribution: ${contributionId}\n`);

    // Fetch the contribution with all authors
    const contribution = await prisma.researchContribution.findUnique({
      where: { id: contributionId },
      include: {
        authors: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!contribution) {
      console.error('❌ Contribution not found');
      return;
    }

    console.log(`📄 Title: ${contribution.title}`);
    console.log(`📊 Type: ${contribution.publicationType}`);
    console.log(`👥 Authors: ${contribution.authors.length}\n`);

    // Count internal vs external authors for proper distribution
    const totalAuthors = contribution.authors.length;
    const internalAuthors = contribution.authors.filter(a => {
      const category = a.authorCategory?.toLowerCase() || 'internal';
      return !category.includes('external') && category !== 'academic' && category !== 'industry';
    });
    
    const internalCoAuthors = internalAuthors.filter(a => {
      const role = a.authorType || 'co_author';
      return role === 'co_author' || role === 'senior_author';
    });
    
    const internalEmployeeCoAuthors = internalCoAuthors.filter(a => {
      const category = a.authorCategory?.toLowerCase() || '';
      return category !== 'student';
    });

    const totalCoAuthors = contribution.authors.filter(a => {
      const role = a.authorType || 'co_author';
      return role === 'co_author' || role === 'senior_author';
    }).length;

    // Check if first/corresponding are external (to track lost percentage)
    let externalFirstCorrespondingPct = 0;
    contribution.authors.forEach(a => {
      const isExternal = a.authorCategory?.toLowerCase() === 'academic' || 
                        a.authorCategory?.toLowerCase() === 'industry' ||
                        a.authorCategory?.toLowerCase().includes('external');
      if (isExternal) {
        const role = a.authorType || 'co_author';
        if (role === 'first_author') externalFirstCorrespondingPct += 40;
        if (role === 'corresponding_author') externalFirstCorrespondingPct += 40;
        if (role === 'first_and_corresponding_author' || role === 'first_and_corresponding') {
          externalFirstCorrespondingPct += 80;
        }
      }
    });

    console.log('[Author Composition]', {
      totalAuthors,
      internalAuthors: internalAuthors.length,
      internalCoAuthors: internalCoAuthors.length,
      internalEmployeeCoAuthors: internalEmployeeCoAuthors.length,
      totalCoAuthors,
      externalFirstCorrespondingPct
    });

    let totalIncentiveAwarded = 0;
    let totalPointsAwarded = 0;

    // Recalculate for each author
    for (const author of contribution.authors) {
      const isExternal = author.authorCategory?.toLowerCase() === 'academic' || 
                        author.authorCategory?.toLowerCase() === 'industry' ||
                        author.authorCategory?.toLowerCase().includes('external');
      const authorRole = author.authorType || 'co_author';
      const isStudent = author.authorCategory?.toLowerCase() === 'student';

      console.log(`\n[Author ${author.orderNumber || '?'}] ${author.authorName || 'Unnamed'}`);
      console.log(`  Role: ${authorRole}`);
      console.log(`  Category: ${author.authorCategory}`);
      console.log(`  Is External: ${isExternal}`);
      console.log(`  Is Student: ${isStudent}`);

      // Calculate incentive using the fixed function
      const incentiveResult = await calculateIncentives(
        contribution,                          // contributionData
        contribution.publicationType,         // publicationType
        authorRole,                           // authorRole
        isStudent,                            // isStudent
        contribution.sjr || 0,                // sjrValue
        totalCoAuthors,                       // coAuthorCount
        totalAuthors,                         // totalAuthors
        !isExternal,                          // isInternal
        internalCoAuthors.length,            // internalCoAuthorCount
        externalFirstCorrespondingPct,       // externalFirstCorrespondingPct
        internalEmployeeCoAuthors.length     // internalEmployeeCoAuthorCount
      );

      const authorIncentive = incentiveResult.incentiveAmount || 0;
      const authorPoints = incentiveResult.points || 0;

      console.log(`  Old: ₹${author.incentiveShare}, ${author.pointsShare} pts`);
      console.log(`  New: ₹${authorIncentive}, ${authorPoints} pts`);

      // Update author with calculated incentive
      await prisma.researchContributionAuthor.update({
        where: { id: author.id },
        data: {
          incentiveShare: Math.round(authorIncentive),
          pointsShare: authorPoints
        }
      });

      totalIncentiveAwarded += Math.round(authorIncentive);
      totalPointsAwarded += authorPoints;
    }

    console.log(`\n✅ Recalculation Complete!`);
    console.log(`📊 Total Incentive: ₹${totalIncentiveAwarded.toLocaleString()}`);
    console.log(`📊 Total Points: ${totalPointsAwarded}`);
    console.log(`\nPlease refresh the pages to see updated values.\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get contribution ID from command line
const contributionId = process.argv[2];

if (!contributionId) {
  console.error('❌ Please provide a contribution ID');
  console.error('Usage: node recalculate-contribution-incentives.js <contribution-id>');
  process.exit(1);
}

recalculateContributionIncentives(contributionId);
