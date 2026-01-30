const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recalculateAllResearchPapers() {
  try {
    console.log('\n🔄 Starting recalculation of ALL research paper incentives...\n');
    
    // Get current research policy
    const policy = await prisma.researchIncentivePolicy.findFirst({
      where: {
        publicationType: 'research_paper',
        isActive: true
      },
      select: {
        id: true,
        policyName: true,
        first_author_percentage: true,
        corresponding_author_percentage: true
      }
    });
    
    if (!policy) {
      console.error('❌ No active research policy found!');
      return;
    }
    
    console.log(`📋 Current Research Policy: ${policy.policyName}`);
    console.log(`   First Author: ${policy.first_author_percentage}%`);
    console.log(`   Corresponding Author: ${policy.corresponding_author_percentage}%`);
    console.log(`   Combined (First+Corresponding): ${Number(policy.first_author_percentage) + Number(policy.corresponding_author_percentage)}%\n`);
    
    // Find all research papers
    const contributions = await prisma.researchContribution.findMany({
      where: {
        publicationType: 'research_paper'
      },
      include: {
        authors: true,
        applicant: {
          include: {
            employeeDetails: true
          }
        }
      }
    });
    
    console.log(`📊 Found ${contributions.length} research papers to recalculate\n`);
    
    const { calculateIncentives } = require('./src/master/controllers/researchContribution.controller');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const contribution of contributions) {
      try {
        console.log(`\n📄 Processing: ${contribution.title.substring(0, 60)}...`);
        console.log(`   ID: ${contribution.id}`);
        console.log(`   Status: ${contribution.status}`);
        console.log(`   Current: ₹${contribution.calculatedIncentiveAmount}, ${contribution.calculatedPoints} pts`);
        
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
        
        // Count internal authors
        const internalAuthors = contribution.authors.filter(a => a.isInternal);
        const internalEmployees = internalAuthors.filter(a => a.authorType === 'faculty' || a.authorType === 'staff');
        const internalCoAuthors = internalAuthors.filter(a => 
          a.userId !== contribution.applicantUserId && 
          (a.authorType === 'faculty' || a.authorType === 'staff')
        );
        
        const isApplicantStudent = contribution.applicantType === 'student';
        
        // Calculate new incentives using current policy
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
          true,
          internalCoAuthors.length,
          0,
          internalEmployees.length
        );
        
        // Update contribution
        await prisma.researchContribution.update({
          where: { id: contribution.id },
          data: {
            calculatedIncentiveAmount: incentiveResult.totalPoolAmount,
            calculatedPoints: incentiveResult.totalPoolPoints
          }
        });
        
        // Recalculate all author shares
        for (const author of contribution.authors) {
          if (!author.isInternal) {
            await prisma.researchContributionAuthor.update({
              where: { id: author.id },
              data: {
                incentiveShare: 0,
                pointsShare: 0
              }
            });
            continue;
          }
          
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
        }
        
        console.log(`   ✅ NEW: ₹${incentiveResult.totalPoolAmount}, ${incentiveResult.totalPoolPoints} pts`);
        successCount++;
        
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Recalculation complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${contributions.length}`);
    console.log(`${'='.repeat(60)}\n`);
    console.log(`💡 All research papers now use the updated policy (${policy.first_author_percentage}% + ${policy.corresponding_author_percentage}%)`);
    console.log(`   Refresh your browser to see the new values.\n`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

recalculateAllResearchPapers();
