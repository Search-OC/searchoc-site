import fs from 'node:fs';
import path from 'node:path';

const REPORT_DIR = path.join(process.cwd(), '.lighthouseci');
const THRESHOLDS = {
  performance: 0.9,
  accessibility: 0.95,
  'best-practices': 0.95,
  seo: 0.95
};

function round(score) {
  return Math.round(score * 1000) / 1000;
}

function loadReports() {
  if (!fs.existsSync(REPORT_DIR)) return [];
  const files = fs
    .readdirSync(REPORT_DIR)
    .filter((f) => f.endsWith('.json'))
    // ignore manifest.json etc.
    .filter((f) => f.startsWith('lhr-') || f.includes('lighthouse'));

  const reports = [];
  for (const file of files) {
    const fullPath = path.join(REPORT_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    try {
      const json = JSON.parse(raw);
      if (json?.categories) reports.push(json);
    } catch {
      // skip
    }
  }
  return reports;
}

const reports = loadReports();
if (reports.length === 0) {
  throw new Error('No Lighthouse reports found in .lighthouseci/.');
}

let failed = false;

console.log('\nLighthouse CI results (from collected reports):');
console.log(`Thresholds: ${Object.entries(THRESHOLDS)
  .map(([k, v]) => `${k}>=${v}`)
  .join(', ')}`);

for (const report of reports) {
  const url = report?.finalUrl ?? report?.requestedUrl ?? '(unknown url)';

  const scores = {
    performance: report?.categories?.performance?.score,
    accessibility: report?.categories?.accessibility?.score,
    'best-practices': report?.categories?.['best-practices']?.score,
    seo: report?.categories?.seo?.score
  };

  console.log(`\nURL: ${url}`);
  for (const [category, minScore] of Object.entries(THRESHOLDS)) {
    const score = scores[category];
    const printable = typeof score === 'number' ? round(score) : 'N/A';
    const ok = typeof score === 'number' ? score >= minScore : false;
    console.log(`  - ${category}: ${printable} (min ${minScore}) ${ok ? 'OK' : 'FAIL'}`);
    if (!ok) failed = true;
  }
}

if (failed) {
  throw new Error('Lighthouse CI thresholds not met. See per-URL/category scores above.');
}

console.log('\n✅ Lighthouse CI thresholds met.');
