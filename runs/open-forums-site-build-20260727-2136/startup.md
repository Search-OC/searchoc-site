# Open Forums Site Build - Startup Note

**Timestamp:** 2026-07-27 21:36 PDT
**Run Directory:** runs/open-forums-site-build-20260727-2136/

## Current Working Directory
```
/Users/bya/jake-command/work/owned/search-oc/searchoc-site
```
Confirmed via `pwd`.

## Git Branch / Status
- Branch: `fix/remove-smoke-string`
- Status summary:
  ```
  fix/remove-smoke-string
  ?? config/
  ?? preview.html
  ```
- Note: Uncommitted work exists (config/, preview.html). Changes for this RP will be scoped to new page + home card update.

## Framework / Package Manager
- Framework: Astro 7.0.9
- Package manager: npm (package-lock.json present)
- UI: Tailwind CSS 4 via Vite plugin
- Deployment: Vercel (`@astrojs/vercel`)
- Node: >=22.12.0

## Route Chosen
- Primary: `/open-forums` (per locked Notion brief and RP requirements)
- Existing pages follow flat structure: `src/pages/index.astro`, `src/pages/formation.astro`
- No duplicate architecture exists; will create `src/pages/open-forums.astro`
- Optional: consider redirect from `/open-forum` (singular) if trivial

## Key Files Expected to Change
1. `src/pages/open-forums.astro` — NEW: main page implementation
2. `src/pages/index.astro` — UPDATE: replace dead Forums card with link to `/open-forums`
3. `src/layouts/Layout.astro` — possibly add nav link (TBD, keep minimal)
4. Evidence files in this run directory

## Source of Truth Notes
- Notion MCP used to retrieve context
- Primary brief: RP page `bdd8dff4eb8a45769a63956fc729da01`
- Locked page brief from Action Plan `20c9083bd9704171ad7d2d4b7520ed7b`
- Email locked: `jhartson@searchnational.org` (matches existing site usage)
- Date mode locked: evergreen "Coming soon / Stay tuned" only — no invented dates
- Form: email (required) + phone (required) + name (optional); "Keep me posted"
- No form provider currently configured in repo

## Preflight Checklist
- [x] pwd confirmed exact path
- [x] Project inspected (Astro + Tailwind + Vercel)
- [x] AGENTS.md read (dev server guidance)
- [x] Existing pages/components/styles reviewed
- [x] Route convention identified (flat pages/)
- [x] Evidence dir created
- [x] Notion context retrieved for locked brief
- [ ] Set Notion Status=Running (done via API)
- [ ] Pull main / create branch (deferred per constraints: do not make destructive git ops unless asked)
- [ ] Build + validation at end

## Constraints Observed
- No publishing/deploying
- No new paid services without clear notes
- No invented dates or testimonials
- Scope limited to /open-forums + home card
- Use existing design tokens and patterns
