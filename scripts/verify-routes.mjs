import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function assertExists(relativePath) {
  const fullPath = path.join(distDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required build output: dist/${relativePath}`);
  }
  return fullPath;
}

function assertStaticHtml(relativePath, { minBytes = 1500, mustInclude = [], mustNotInclude = [], mustNotMatch = [] } = {}) {
  const fullPath = assertExists(relativePath);
  const html = fs.readFileSync(fullPath, 'utf8');
  if (html.length < minBytes) {
    throw new Error(
      `dist/${relativePath} is too small (${html.length} bytes). Expected a real static page, not a JS shell.`
    );
  }
  if (/document\.write\s*\(/.test(html) && !/<h1[\s>]/i.test(html)) {
    throw new Error(
      `dist/${relativePath} looks client-rendered only (document.write without <h1>). Use static HTML in the initial response.`
    );
  }
  if (!/<body[\s>]/i.test(html)) {
    throw new Error(`dist/${relativePath} is missing a <body>.`);
  }
  for (const needle of mustInclude) {
    if (!html.includes(needle)) {
      throw new Error(`dist/${relativePath} missing expected content: ${JSON.stringify(needle)}`);
    }
  }
  for (const needle of mustNotInclude) {
    if (html.includes(needle)) {
      throw new Error(`dist/${relativePath} must not include ${JSON.stringify(needle)}`);
    }
  }
  for (const pattern of mustNotMatch) {
    const re = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    if (re.test(html)) {
      throw new Error(`dist/${relativePath} matched forbidden pattern: ${re}`);
    }
  }
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : '';
  const bodyWithoutNoscript = body.replace(/<noscript[\s\S]*?<\/noscript>/gi, '').trim();
  if (bodyWithoutNoscript.length < 200) {
    throw new Error(
      `dist/${relativePath} body has almost no static content after removing noscript. Lighthouse will fail with NO_FCP.`
    );
  }
}

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ directory does not exist. Did the build step run?');
}

// Homepage is an isolated entry point. It must not link into the inner ecosystem.
assertStaticHtml('index.html', {
  minBytes: 2000,
  mustInclude: [
    'Search Orange County',
    'Open Forum',
    'safe room',
    'walked away',
    'goes that deep',
    'think critically',
    'questions',
    'Learn with',
    'name="email"',
    'name="phone"',
    'id="stay-in-touch"',
    'Tell me when'
  ],
  mustNotInclude: [
    'href="/formation"',
    'href="/foundation"',
    'href="/resources"',
    'href="/invite"',
    'Explore Formation',
    'Coming soon',
    'id="footer-form"',
    '>Home</a>',
    '>Invite Someone</a>',
    'Eight to twelve',
    'Get involved',
    'href="/open-forums"',
    'Forty years of tables'
  ]
});

const noHomeLink = { mustNotMatch: [/href=(["'])\/\1/] };

assertStaticHtml(path.join('formation', 'index.html'), {
  minBytes: 2000,
  mustInclude: [
    'Formation',
    '1-2-3',
    'href="/open-forums"',
    'id="footer-form"',
    'Having Killer Conversations',
    'id="stay-in-touch"',
    'Get involved'
  ],
  mustNotInclude: ['Back to Search OC home'],
  ...noHomeLink
});

assertStaticHtml(path.join('open-forums', 'index.html'), {
  minBytes: 2000,
  mustInclude: [
    'Open Forum',
    "Life's big questions",
    'id="stay-in-touch"',
    'name="phone"',
    'Get involved',
    'href="/formation"',
    'href="/foundation"',
    'href="/resources"',
    'href="/invite"'
  ],
  mustNotInclude: ['Coming soon'],
  ...noHomeLink
});

assertStaticHtml(path.join('invite', 'index.html'), {
  minBytes: 2000,
  mustInclude: ['Invite', 'id="stay-in-touch"', 'Get involved', 'href="/open-forums"'],
  ...noHomeLink
});

assertStaticHtml(path.join('resources', 'index.html'), {
  minBytes: 2000,
  mustInclude: [
    'Resources',
    'REACH',
    'Questioning God',
    'id="stay-in-touch"',
    'Get involved',
    'href="/formation"',
    'href="/foundation"',
    'href="/open-forums"'
  ],
  ...noHomeLink
});

assertStaticHtml(path.join('foundation', 'index.html'), {
  minBytes: 2000,
  mustInclude: [
    'Foundations',
    'Inquire',
    'Explore',
    'Grow',
    'Speak',
    'Listen',
    'Invest',
    'Invite',
    'id="stay-in-touch"',
    'Get involved',
    'href="/open-forums"',
    'href="/formation"',
    'href="/resources"'
  ],
  ...noHomeLink
});

console.log(
  '✅ Required routes exist in dist/ with static content: /, /formation, /open-forums, /invite, /resources, /foundation'
);
