import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function assertExists(relativePath) {
  const fullPath = path.join(distDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required build output: dist/${relativePath}`);
  }
}

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ directory does not exist. Did the build step run?');
}

// Home route: dist/index.html
assertExists('index.html');

// /formation route: dist/formation/index.html
assertExists(path.join('formation', 'index.html'));

console.log('✅ Required routes exist in dist/: / and /formation');
