/**
 * Quick script to fix incentives for contribution 2f386546-d535-485a-bac0-465516abff4c
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixContribution() {
  const id = '2f386546-d535-485a-bac0-465516abff4c';
  
  try {
    // Fetch contribution
    const contrib = await prisma.researchContribution.findUnique({
      where: { id },
      include: { authors: true }
    });
    
    if (!contrib) {
      console.log('❌ Contribution not found');
      return;
    }
    
    console.log('\n📊 Contribution:', contrib.title);
    console.log('Total calculated:', contrib.calculatedIncentiveAmount);
    
    // Calculate new values based on policy
    // From policy: 40% first, 40% corresponding, 20% co-author pool
    // Total: ₹2,00,000
    
    const totalAmount = Number(contrib.calculatedIncentiveAmount);
    const totalPoints = Number(contrib.calculatedPoints);
    
    // Count authors
    const authors = contrib.authors;
    const internalFaculty = authors.filter(a => 
      a.authorCategory?.toLowerCase() === 'faculty' && 
      (a.authorType === 'first_and_corresponding_author' || a.authorType === 'co_author')
    );
    const students = authors.filter(a => a.authorCategory?.toLowerCase() === 'student');
    const external = authors.filter(a => 
      a.authorCategory?.toLowerCase() === 'academic' || 
      a.authorCategory?.toLowerCase() === 'industry'
    );
    
    console.log('\n👥 Authors:', {
      total: authors.length,
      internalFaculty: internalFaculty.length,
      students: students.length,
      external: external.length
    });
    
    // New calculation: 40% + 40% = 80% for first+corresponding
    // Remaining 20% split among 3 internal co-authors (faculty + student)
    const firstCorrPct = 80; // 40% + 40%
    const coAuthorPct = 20;
    const internalCoAuthors = authors.filter(a => 
      a.authorType === 'co_author' && 
      a.authorCategory !== 'academic' && 
      a.authorCategory !== 'industry'
    ).length;
    
    console.log('\n💰 New Distribution:');
    console.log('First+Corresponding:', firstCorrPct, '%');
    console.log('Co-Author Pool:', coAuthorPct, '% split among', internalCoAuthors, 'internal co-authors');
    
    // Update each author
    for (const author of authors) {
      let newIncentive = 0;
      let newPoints = 0;
      
      if (author.authorType === 'first_and_corresponding_author') {
        newIncentive = Math.round((totalAmount * firstCorrPct) / 100);
        newPoints = Math.round((totalPoints * firstCorrPct) / 100);
      } else if (author.authorType === 'co_author') {
        const isExternal = author.authorCategory === 'academic' || author.authorCategory === 'industry';
        if (isExternal) {
          // External authors get 0
          newIncentive = 0;
          newPoints = 0;
        } else {
          // Internal co-authors split the 20%
          const perCoAuthorPct = coAuthorPct / internalCoAuthors;
          newIncentive = Math.round((totalAmount * perCoAuthorPct) / 100);
          
          // Points: students get 0, faculty get points
          if (author.authorCategory === 'student') {
            newPoints = 0;
          } else {
            // Faculty co-authors split points among non-students
            const facultyCoAuthors = authors.filter(a => 
              a.authorType === 'co_author' && 
              a.authorCategory === 'faculty'
            ).length;
            const perFacultyPct = coAuthorPct / facultyCoAuthors;
            newPoints = Math.round((totalPoints * perFacultyPct) / 100);
          }
        }
      }
      
      console.log(`\n${author.authorType} (${author.authorCategory}):`);
      console.log(`  Old: ₹${author.incentiveShare}, ${author.pointsShare} pts`);
      console.log(`  New: ₹${newIncentive}, ${newPoints} pts`);
      
      // Update database
      await prisma.researchContributionAuthor.update({
        where: { id: author.id },
        data: {
          incentiveShare: newIncentive,
          pointsShare: newPoints
        }
      });
    }
    
    console.log('\n✅ Updated successfully! Please refresh the pages.\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixContribution();
