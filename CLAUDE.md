# Project: Personal portfolio site

A single-page portfolio for a CS student, built for recruiters to review quickly.
Plain HTML/CSS/JS — intentionally no framework, no build step, no dependencies.

## Stack & constraints

- No React, no bundler, no package.json. Keep it that way unless explicitly asked
  to change it — the whole point is zero build step and trivial static deploy.
- Vanilla JS only (`script.js`), used sparingly: mobile nav toggle + scroll-based
  active-link highlighting. Don't introduce a framework for small interactions.
- Fonts loaded via Google Fonts `<link>` tags in `index.html` — Fraunces (display),
  Inter (body), IBM Plex Mono (nav/labels/tags/dates).

## Files

- `index.html` — all page content and structure
- `styles.css` — all styling, driven by CSS custom properties defined at the top
  under `:root` (`--ink`, `--paper`, `--muted`, `--faint`, `--rule`, plus the three
  `--font-*` families)
- `script.js` — mobile nav toggle, `IntersectionObserver`-based active-section nav highlight
- `resume.pdf` — not yet added; referenced by two links (`.nav-resume`, footer)

## Design system (preserve these unless asked to redesign)

- **Color: strict grayscale, no accent color.** This was an explicit user choice
  ("monochrome/very minimal"). Don't add a brand color without being asked.
- **Type roles are fixed:** Fraunces for name/section headings that need personality,
  Inter for body copy, IBM Plex Mono for anything nav/label/meta/tag-like (a deliberate
  nod to code — comment-style `// section` headers, `~/section` nav links).
- **Signature element:** the blinking terminal cursor after the name in the hero
  (`.cursor`, pure CSS animation, no JS). Don't remove it or add a second competing
  "hero" gimmick.
- Respect `prefers-reduced-motion` (already handled globally in `styles.css`) and
  keep visible `:focus-visible` states on all interactive elements.
- Content column is capped at `--content-width` (700px) and centered — don't go full-bleed.

## Content status

Everything in `index.html` is currently **placeholder content** (name "Jordan Lee",
sample projects, sample experience, `#` links). Before deploying, this needs to be
replaced with the real owner's projects, experience, skills, and contact links —
see the "Before you publish" checklist in `README.md`.

## Local dev

No build step. Either open `index.html` directly, or serve it so relative paths
behave like production:

```bash
python3 -m http.server 8000
```

## Deployment

Static site — GitHub Pages, Vercel, or Netlify all work with zero configuration.
See `README.md` for exact steps.
