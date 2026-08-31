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

function assertStaticHtml(relativePath, { minBytes = 1500, mustInclude = [], mustNotInclude = [] } = {}) {
  const fullPath = assertExists(relativePath);
  const html = fs.readFileSync(fullPath, 'utf8');
  if (html.length < minBytes) {
    throw new Error(
      `dist/${relativePath} is too small (${html.length} bytes). Expected a real static page, not a JS shell.`
    );
  }
  // Fail client-only shells that Lighthouse cannot paint (NO_FCP).
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
  // noscript-only body is not acceptable for public SEO pages
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

assertStaticHtml('index.html', {
  minBytes: 2000,
  mustInclude: ['Search OC', 'Open Forum', "Life's big questions"],
  mustNotInclude: ['href="/formation"', 'href="/foundation"', 'Explore Formation', 'Coming soon']
});

assertStaticHtml(path.join('formation', 'index.html'), {
  minBytes: 2000,
  mustInclude: ['Formation', '1-2-3', 'href="/open-forums"']
});

assertStaticHtml(path.join('open-forums', 'index.html'), {
  minBytes: 2000,
  mustInclude: ['Open Forum', "Life's big questions", 'Get notified of the next gathering'],
  mustNotInclude: ['Coming soon']
});

assertStaticHtml(path.join('invite', 'index.html'), {
  minBytes: 2000,
  mustInclude: ['Invite']
});

console.log('✅ Required routes exist in dist/ with static content: /, /formation, /open-forums, /invite');
