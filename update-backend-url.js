#!/usr/bin/env node

/**
 * Script to update backend URL in frontend configuration
 * Usage: node update-backend-url.js <your-backend-url>
 * Example: node update-backend-url.js https://ai-resume-builder-api.onrender.com
 */

const fs = require('fs');
const path = require('path');

// Get backend URL from command line arguments
const backendUrl = process.argv[2];

if (!backendUrl) {
  console.error('❌ Please provide your backend URL');
  console.log('Usage: node update-backend-url.js <your-backend-url>');
  console.log('Example: node update-backend-url.js https://ai-resume-builder-api.onrender.com');
  process.exit(1);
}

// Validate URL format
if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
  console.error('❌ Invalid URL format. Please include http:// or https://');
  process.exit(1);
}

console.log(`🔄 Updating backend URL to: ${backendUrl}`);

// Files to update
const filesToUpdate = [
  {
    path: 'client/src/config/config.js',
    pattern: /API_URL: 'https:\/\/your-backend-url\.onrender\.com'/g,
    replacement: `API_URL: '${backendUrl}'`
  },
  {
    path: 'client/package.json',
    pattern: /REACT_APP_API_URL=https:\/\/your-backend-url\.onrender\.com/g,
    replacement: `REACT_APP_API_URL=${backendUrl}`
  },
  {
    path: 'client/public/sitemap.xml',
    pattern: /https:\/\/your-frontend-url\.onrender\.com/g,
    replacement: 'https://your-frontend-url.onrender.com' // This will be updated when frontend is deployed
  },
  {
    path: 'client/public/robots.txt',
    pattern: /https:\/\/your-frontend-url\.onrender\.com/g,
    replacement: 'https://your-frontend-url.onrender.com' // This will be updated when frontend is deployed
  }
];

// Update files
let updatedFiles = 0;

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (file.pattern.test(content)) {
        content = content.replace(file.pattern, file.replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file.path}`);
        updatedFiles++;
      } else {
        console.log(`⚠️  No pattern found in: ${file.path}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${file.path}:`, error.message);
    }
  } else {
    console.log(`⚠️  File not found: ${file.path}`);
  }
});

console.log(`\n🎉 Updated ${updatedFiles} files successfully!`);
console.log('\n📝 Next steps:');
console.log('1. Deploy your frontend to Render');
console.log('2. Update the frontend URLs in sitemap.xml and robots.txt');
console.log('3. Test your application');

// Create .env.production file
const envContent = `# Production API URL
REACT_APP_API_URL=${backendUrl}
`;

try {
  fs.writeFileSync(path.join(__dirname, 'client', '.env.production'), envContent);
  console.log('✅ Created client/.env.production file');
} catch (error) {
  console.error('❌ Error creating .env.production:', error.message);
}
