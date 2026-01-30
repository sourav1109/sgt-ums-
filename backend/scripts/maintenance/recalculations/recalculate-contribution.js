const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const contributionId = '3ac884f7-e694-42b4-8d8f-948e5f2deecf'; // The one from your URL

async function recalculateContribution() {
  try {
    console.log(`\n🔄 Recalculating incentives for contribution: ${contributionId}\n`);
    
    // Fetch the contribution with authors
    const contribution = await prisma.researchContribution.findUnique({
      where: { id: contributionId },
      include: {
        authors: true,
        applicant: {
          include: {
            employeeDetails: true
          }
        }
      }
    });
    
    if (!contribution) {
      console.error('❌ Contribution not found!');
      return;
    }
    
    console.log(`📄 Found: ${contribution.title}`);
    console.log(`   Type: ${contribution.publicationType}`);
    console.log(`   Status: ${contribution.status}`);
    console.log(`   Authors: ${contribution.authors.length}`);
    console.log(`   Current calculated incentive: ₹${contribution.calculatedIncentiveAmount}`);
    console.log(`   Current calculated points: ${contribution.calculatedPoints}`);
    
    // Import the calculateIncentives function
    const { calculateIncentives } = require('./src/master/controllers/researchContribution.controller');
    
    // Get policy for research papers
    const policy = await prisma.researchIncentivePolicy.findFirst({
      where: {
        publicationType: 'research_paper',
        isActive: true
      },
      select: {
        first_author_percentage: true,
        corresponding_author_percentage: true
      }
    });
    
    if (!policy) {
      console.error('❌ No active research policy found!');
      return;
    }
    
    console.log(`\n📋 Current Policy Percentages:`);
    console.log(`   First Author: ${policy.first_author_percentage}%`);
    console.log(`   Corresponding Author: ${policy.corresponding_author_percentage}%`);
    console.log(`   Combined: ${Number(policy.first_author_percentage) + Number(policy.corresponding_author_percentage)}%`);
    
    // Determine applicant role
    const applicantAuthor = contribution.authors.find(a => a.userId === contribution.applicantUserId);
    let authorRole = 'co_author';
    
    if (applicantAuthor) {
      const isFirst = applicantAuthor.authorOrder === 1;
      const isCorresponding = applicantAuthor.isCorresponding;
      
      if (isFirst && isCorresponding) {
        authorRole = 'first_and_corresponding_author';
      } else if (isFirst) {
        authorRole = 'first_author';
      } else if (isCorresponding) {
        authorRole = 'corresponding_author';
      }
    }
    
    console.log(`\n👤 Applicant Role: ${authorRole}`);
    
    // Count internal authors
    const internalAuthors = contribution.authors.filter(a => a.isInternal);
    const internalEmployees = internalAuthors.filter(a => a.authorType === 'faculty' || a.authorType === 'staff');
    const internalCoAuthors = internalAuthors.filter(a => 
      a.userId !== contribution.applicantUserId && 
      (a.authorType === 'faculty' || a.authorType === 'staff')
    );
    
    console.log(`   Total authors: ${contribution.authors.length}`);
    console.log(`   Internal authors: ${internalAuthors.length}`);
    console.log(`   Internal co-authors (for distribution): ${internalCoAuthors.length}`);
    
    // Calculate new incentives
    const isApplicantStudent = contribution.applicantType === 'student';
    
    const incentiveResult = await calculateIncentives(
      {
        publicationDate: contribution.publicationDate,
        quartile: contribution.quartile,
        sjr: contribution.sjr,
        indexingCategories: contribution.indexingCategories || [],
        impactFactor: contribution.impactFactor,
        naasRating: contribution.naasRating,
        subsidiaryImpactFactor: contribution.subsidiaryImpactFactor
      },
      contribution.publicationType,
      authorRole,
      isApplicantStudent,
      contribution.sjr || 0,
      internalCoAuthors.length,
      contribution.authors.length,
      true, // isInternal (applicant is internal)
      internalCoAuthors.length,
      0, // externalFirstCorrespondingPct
      internalEmployees.length
    );
    
    console.log(`\n✨ NEW Calculated Values:`);
    console.log(`   Total Pool Incentive: ₹${incentiveResult.totalPoolAmount}`);
    console.log(`   Total Pool Points: ${incentiveResult.totalPoolPoints}`);
    console.log(`   Applicant Share Incentive: ₹${incentiveResult.incentiveAmount}`);
    console.log(`   Applicant Share Points: ${incentiveResult.points}`);
    
    // Update the contribution
    await prisma.researchContribution.update({
      where: { id: contributionId },
      data: {
        calculatedIncentiveAmount: incentiveResult.totalPoolAmount,
        calculatedPoints: incentiveResult.totalPoolPoints
      }
    });
    
    // Recalculate all author shares
    console.log(`\n🔄 Recalculating individual author shares...`);
    
    for (const author of contribution.authors) {
      if (!author.isInternal) {
        // External authors get 0
        await prisma.researchContributionAuthor.update({
          where: { id: author.id },
          data: {
            incentiveShare: 0,
            pointsShare: 0
          }
        });
        continue;
      }
      
      // Determine this author's role
      const isFirst = author.authorOrder === 1;
      const isCorresponding = author.isCorresponding;
      let thisAuthorRole = 'co_author';
      
      if (isFirst && isCorresponding) {
        thisAuthorRole = 'first_and_corresponding_author';
      } else if (isFirst) {
        thisAuthorRole = 'first_author';
      } else if (isCorresponding) {
        thisAuthorRole = 'corresponding_author';
      }
      
      const isStudent = author.authorType === 'student';
      
      const authorIncentive = await calculateIncentives(
        {
          publicationDate: contribution.publicationDate,
          quartile: contribution.quartile,
          sjr: contribution.sjr,
          indexingCategories: contribution.indexingCategories || [],
          impactFactor: contribution.impactFactor,
          naasRating: contribution.naasRating,
          subsidiaryImpactFactor: contribution.subsidiaryImpactFactor
        },
        contribution.publicationType,
        thisAuthorRole,
        isStudent,
        contribution.sjr || 0,
        internalCoAuthors.length,
        contribution.authors.length,
        true,
        internalCoAuthors.length,
        0,
        internalEmployees.length
      );
      
      await prisma.researchContributionAuthor.update({
        where: { id: author.id },
        data: {
          incentiveShare: authorIncentive.incentiveAmount,
          pointsShare: authorIncentive.points
        }
      });
      
      console.log(`   ✓ ${author.name} (${thisAuthorRole}): ₹${authorIncentive.incentiveAmount}, ${authorIncentive.points} pts`);
    }
    
    console.log(`\n✅ Recalculation complete! The contribution now uses the updated policy.`);
    console.log(`\n💡 Refresh the page to see the new values.`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

recalculateContribution();
