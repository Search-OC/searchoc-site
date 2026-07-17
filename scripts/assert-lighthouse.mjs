import fs from 'node:fs';
import path from 'node:path';

const REPORT_DIR = path.join(process.cwd(), '.lighthouseci');
const SUMMARY_PATH = path.join(process.cwd(), 'lighthouse-summary.md');

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

function formatRow(url, scores, passMap) {
  const cells = [
    url,
    `${scores.performance}`,
    `${scores.accessibility}`,
    `${scores['best-practices']}`,
    `${scores.seo}`,
    passMap.all ? 'PASS' : 'FAIL'
  ];
  return `| ${cells.join(' | ')} |`;
}

const reports = loadReports();
if (reports.length === 0) {
  const msg = 'No Lighthouse reports found in .lighthouseci/.';
  fs.writeFileSync(
    SUMMARY_PATH,
    `${msg}\n\nThis is a configuration/collection failure (no scores available).\n`,
    'utf8'
  );
  throw new Error(msg);
}

let failed = false;

const summaryLines = [];
summaryLines.push('Thresholds: ' + Object.entries(THRESHOLDS).map(([k,v]) => `${k}>=${v}`).join(', '));
summaryLines.push('');
summaryLines.push('| Route | Performance | Accessibility | Best Practices | SEO | Result |');
summaryLines.push('| --- | --- | --- | --- | --- | --- |');

console.log('\nLighthouse CI results (from collected reports):');
console.log(`Thresholds: ${Object.entries(THRESHOLDS)
  .map(([k, v]) => `${k}>=${v}`)
  .join(', ')}`);

for (const report of reports) {
  const url = report?.finalUrl ?? report?.requestedUrl ?? '(unknown url)';

  const rawScores = {
    performance: report?.categories?.performance?.score,
    accessibility: report?.categories?.accessibility?.score,
    'best-practices': report?.categories?.['best-practices']?.score,
    seo: report?.categories?.seo?.score
  };

  const scores = {
    performance: typeof rawScores.performance === 'number' ? round(rawScores.performance) : 'N/A',
    accessibility: typeof rawScores.accessibility === 'number' ? round(rawScores.accessibility) : 'N/A',
    'best-practices': typeof rawScores['best-practices'] === 'number' ? round(rawScores['best-practices']) : 'N/A',
    seo: typeof rawScores.seo === 'number' ? round(rawScores.seo) : 'N/A'
  };

  const passMap = {
    performance: typeof rawScores.performance === 'number' && rawScores.performance >= THRESHOLDS.performance,
    accessibility: typeof rawScores.accessibility === 'number' && rawScores.accessibility >= THRESHOLDS.accessibility,
    'best-practices': typeof rawScores['best-practices'] === 'number' && rawScores['best-practices'] >= THRESHOLDS['best-practices'],
    seo: typeof rawScores.seo === 'number' && rawScores.seo >= THRESHOLDS.seo,
  };
  passMap.all = passMap.performance && passMap.accessibility && passMap['best-practices'] && passMap.seo;

  summaryLines.push(formatRow(url, scores, passMap));

  console.log(`\nURL: ${url}`);
  for (const [category, minScore] of Object.entries(THRESHOLDS)) {
    const score = rawScores[category];
    const printable = typeof score === 'number' ? round(score) : 'N/A';
    const ok = typeof score === 'number' ? score >= minScore : false;
    console.log(`  - ${category}: ${printable} (min ${minScore}) ${ok ? 'OK' : 'FAIL'}`);
    if (!ok) failed = true;
  }
}

fs.writeFileSync(SUMMARY_PATH, summaryLines.join('\n') + '\n', 'utf8');

if (failed) {
  throw new Error('Lighthouse CI thresholds not met. See lighthouse-summary.md for exact scores.');
}

console.log('\n✅ Lighthouse CI thresholds met.');
