# Search OC Website

Public website for Search OC at searchoc.org.

- Home: `/`
- Formation primer: `/formation`
- Open Forums: `/open-forums`

## Update Path (Notion → Build → Deploy)

1. Update or create content in the corresponding Reference Pack in Notion.
2. Run the Reference Pack (Hermes or other agent) to generate or update site content.
3. Commit changes and open PR to `jhar921/searchoc-site`.
4. Vercel auto-deploys preview from PR.
5. Merge to main for production.

**Working directory for builds:** `~/jake-command/search-oc/searchoc-site`

**Contact for this site:** jhartson@searchnational.org

## Tech

- Astro (static site)
- Tailwind CSS
- Simple, fast, accessible

## Local Development

```sh
npm run dev
```

## Build

```sh
npm run build
```

Output goes to `dist/`.

## Vercel

Framework preset: Astro
Build command: `npm run build`
Output directory: `dist`

## Namecheap DNS (once ready)

Typical Vercel records (verify in Vercel dashboard first):

- A record: `@` → `76.76.21.21`
- CNAME: `www` → `cname.vercel-dns.com`

Do not change DNS until a Vercel preview is confirmed working and content is approved.

## Interest Form (Open Forums)

The `/open-forums` interest form uses [FormSubmit.co](https://formsubmit.co) to deliver submissions to `jhartson@searchnational.org`.

**Activation step:** The first form submission will trigger a confirmation email to Jake. He must click the confirmation link in that email to activate the form. Until then, submissions will not be delivered.

No API key or signup is required. FormSubmit handles spam filtering and email delivery automatically.

## Notes

- Keep the site Search-branded (see Search OC design system in Notion).
- No em dashes in copy.
- No stock church imagery.
- Future pathways will be added as they are ready.
