import { readdirSync, statSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ASSETS_DIR = 'dist-demo/assets';
const MAX_TOTAL_JS_GZIP = 30 * 1024; // 30KB
const MAX_CHUNK_GZIP = 30 * 1024;    // 30KB per chunk

function getGzipSize(filePath) {
  const output = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf-8' });
  return parseInt(output.trim(), 10);
}

let totalJsGzip = 0;
let failed = false;

const files = existsSync(ASSETS_DIR) ? readdirSync(ASSETS_DIR) : [];

if (files.length === 0) {
  console.log(`Warning: No files found in ${ASSETS_DIR}. Run npm run build:demo first.`);
  process.exit(0);
}

console.log('Bundle size report:');
console.log('='.repeat(60));

for (const file of files) {
  const filePath = join(ASSETS_DIR, file);
  const rawSize = statSync(filePath).size;
  const gzipSize = getGzipSize(filePath);
  const rawKB = (rawSize / 1024).toFixed(2);
  const gzipKB = (gzipSize / 1024).toFixed(2);

  console.log(`  ${file}: ${rawKB} KB raw, ${gzipKB} KB gzip`);

  if (file.endsWith('.js')) {
    totalJsGzip += gzipSize;

    if (gzipSize > MAX_CHUNK_GZIP) {
      console.log(`  !! OVER BUDGET: ${file} gzip (${gzipKB} KB) exceeds ${MAX_CHUNK_GZIP / 1024} KB limit`);
      failed = true;
    }
  }
}

console.log('='.repeat(60));
console.log(`Total JS gzipped: ${(totalJsGzip / 1024).toFixed(2)} KB (budget: ${MAX_TOTAL_JS_GZIP / 1024} KB)`);

if (totalJsGzip > MAX_TOTAL_JS_GZIP) {
  console.log('!! OVER BUDGET: Total JS gzip exceeds limit');
  failed = true;
}

if (failed) {
  console.log('\nBundle budget check FAILED');
  process.exit(1);
} else {
  console.log('\nBundle budget check PASSED');
}
