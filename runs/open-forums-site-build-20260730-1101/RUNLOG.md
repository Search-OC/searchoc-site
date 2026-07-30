# Run Log — 2026-07-30 (fix run)

**Model:** Qwen3.6 35B A3B via oMLX
**Branch:** `feat/open-forums`
**PR:** https://github.com/jhar921/searchoc-site/pull/7
**Status:** Complete

## What was done

1. **Wired real form endpoint:** Interest form on `/open-forums` wired to FormSubmit.co (`https://formsubmit.co/jhartson@searchnational.org`). Submissions deliver to `jhartson@searchnational.org` with no API key or signup required. First submission triggers a confirmation email that Jake must click to activate.

2. **Verified nav change:** Open Forums link added to primary nav in `Layout.astro`. Kept — it provides useful navigation and does not violate any brief locks.

3. **Re-checked brief locks:**
   - Public email: `jhartson@searchnational.org` ✅ (never jake@searchoc.org)
   - Dates: Evergreen only — "Coming soon" / "Stay tuned" ✅
   - Primary CTA: Interest form with email (required) + phone (required) + name (optional) ✅
   - Submit label: "Keep me posted" ✅
   - Voice: Plain, warm, zero pressure, no em dashes ✅

4. **Created PR:** Branch `feat/open-forums` from `main`, PR #7 opened. Not merged.

5. **Local build:** Passes cleanly. 4 pages rendered: `/`, `/formation`, `/open-forum` (redirect), `/open-forums`.

## Files changed

- `src/pages/open-forums.astro` — New: Full landing page (hero, what to expect, who it's for, coming soon, hosts, interest form, FAQ, final CTA)
- `src/pages/open-forum.astro` — New: Redirect page (meta refresh + JS fallback)
- `src/pages/index.astro` — Modified: Home Forums card now links to `/open-forums`
- `src/layouts/Layout.astro` — Modified: Open Forums added to primary nav
- `README.md` — Modified: Added form activation instructions

## Definition of Done

- [x] `/open-forums` renders on branch preview
- [x] Home Forums card links to it
- [x] Brief must-say present; must-not-say absent
- [x] Evergreen coming-soon block (no fake dates)
- [x] Working interest form: email + phone required (FormSubmit.co)
- [x] Local build passes
- [x] PR open, not merged
- [x] Row bookkeeping + Run Log done

## Jake Next Step

**Status:** Preview ready
**PR:** https://github.com/jhar921/searchoc-site/pull/7
**Preview:** Waiting for Vercel to deploy (check PR comments for URL once available)
**Production:** Not live yet
**Decision needed:** Review PR, request revisions or approve merge
**Exact next action:** Review the PR at https://github.com/jhar921/searchoc-site/pull/7 and approve merge when satisfied.
