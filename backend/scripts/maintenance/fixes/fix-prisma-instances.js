/**
 * Script to replace all PrismaClient instances with singleton
 */

const fs = require('fs');
const path = require('path');

const files = [
  'src/master/controllers/school.controller.js',
  'src/master/controllers/department.controller.js',
  'src/master/controllers/analytics.controller.js',
  'src/master/controllers/bookChapterPolicy.controller.js',
  'src/master/routes/ipr.js',
  'src/master/controllers/bookPolicy.controller.js',
  'src/master/controllers/bulkUpload.controller.js',
  'src/master/controllers/centralDepartment.controller.js',
  'src/master/routes/researchProgressTracker.routes.js',
  'src/master/controllers/collaborativeEditing.controller.js',
  'src/master/controllers/conferencePolicy.controller.js',
  'src/master/controllers/googleDocsController.js',
  'src/master/controllers/grantPolicy.controller.js',
  'src/master/controllers/incentivePolicy.controller.js',
  'src/master/controllers/permissionManagement.controller.js',
  'src/master/controllers/program.controller.js',
  'src/master/controllers/researchProgressTracker.controller.js',
  'src/master/controllers/researchReview.controller.js'
];

const oldPattern = /const { PrismaClient } = require\('@prisma\/client'\);\s*const prisma = new PrismaClient\(\);/g;
const newCode = `const prisma = require('../../config/prismaClient');`;

// For routes, use a different path
const oldPatternRoutes = /const { PrismaClient } = require\('@prisma\/client'\);\s*const prisma = new PrismaClient\(\);/g;
const newCodeRoutes = `const prisma = require('../../config/prismaClient');`;

let updated = 0;
let errors = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Determine the correct import path based on file location
    let replacement = newCode;
    if (file.includes('/routes/')) {
      replacement = newCodeRoutes;
    }
    
    if (content.includes('const prisma = new PrismaClient()')) {
      content = content.replace(
        /const { PrismaClient } = require\('@prisma\/client'\);\nconst prisma = new PrismaClient\(\);/g,
        replacement
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
      updated++;
    } else {
      console.log(`⏭️  Skipped (already updated or different pattern): ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
    errors++;
  }
});

console.log(`\n📊 Summary: ${updated} files updated, ${errors} errors`);
