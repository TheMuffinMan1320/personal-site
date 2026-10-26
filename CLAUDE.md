# Project: Personal portfolio site (Afnan Hasan)

A single-page portfolio for a CS student, built for recruiters to review quickly.
Plain HTML/CSS/JS — intentionally no framework, no build step, no dependencies.

## Stack & constraints

- No React, no bundler, no package.json. Keep it that way unless explicitly asked
  to change it — the whole point is zero build step and trivial static deploy.
- Vanilla JS only (`script.js`), used sparingly: mobile nav toggle + scroll-based
  active-link highlighting. Don't introduce a framework for small interactions.
- Fonts loaded via one Google Fonts `<link>` in `index.html`: Archivo (variable width,
  expanded italic for display), Instrument Serif (italic captions/ledes), Saira Stencil One
  (numbers/badges), Courier Prime (specs, stacks, dates).

## Files

- `index.html` — all page content and structure
- `styles.css` — all styling, driven by CSS custom properties under `:root`
- `scene.js` — full-page 3D: fixed WebGL canvas (three.js from jsDelivr via an import map in `index.html`, still no build step) whose camera flies through line-drawn car parts on scroll (wheel + tyre, brake rotor + caliper, coil-over shock, steering wheel, gear, piston + rod)
- `script.js` — mobile nav toggle, `IntersectionObserver`-based active-section nav highlight, CSS-3D scroll reveals + pointer tilt
- `resume.pdf` — current resume (copied from Afnan_Hasan_Resume_Oct26.pdf)
- `assets/img/` — three Creative Commons car photos (see Photo credits below)

## Design system (preserve these unless asked to redesign)

- **Theme: monotone motorsport poster / workshop manual.** Paper `#ECEAE5`, ink `#0E0E0E`,
  grays only. No accent hue — emphasis comes from inversion (black chip, paper text).
- **Type roles:** `.disp` (Archivo expanded black italic caps) for names/headings, `.cond`
  (Archivo condensed caps, tracked) for labels/nav, `.serif` (Instrument Serif italic) for
  ledes and captions, `.sten` (Saira Stencil One) for numbers, `.type` (Courier Prime) for
  specs/stacks/dates.
- **Car imagery:** real CC-licensed photos, always shown through CSS `grayscale(1)` in a
  hard-shadow frame (the two lower photos get scroll-linked 3D tilt/parallax). Don't add colored
  photos or drawn/vector cars.
- **Recurring motifs:** livery stripe at top, checkered-flag dividers, spec-sheet boxes
  (`.spec`), timing-sheet experience rows, licence card (education), parts-catalogue skills,
  rubber-stamp "OPEN" PR tags, licence plate in the footer.
- Respect `prefers-reduced-motion` and keep visible `:focus-visible` states.
- Content column is capped at `--content-width` (1248px) and centered.

## Photo credits (CC BY-SA — keep attribution in the footer)

- `chiron-pur-sport.jpg` — Bugatti Chiron Pur Sport, MrWalkr, CC BY-SA 4.0
- `huayra-bc-side.jpg` — Pagani Huayra BC, Mr.choppers, CC BY-SA 3.0
- `huayra-roadster-side.jpg` — Pagani Huayra Roadster BC, MrWalkr, CC BY-SA 4.0

All via Wikimedia Commons. Credits live in the footer (`.footer-base`), not under the
photos. If a photo is added or swapped, update the footer list.

## Content status

Real content, sourced from the owner's resume. When the resume changes, update the
experience, project, skills, and stats sections in `index.html` to match.

## Local dev

No build step. Either open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
```

## Deployment

Static site — GitHub Pages, Vercel, or Netlify all work with zero configuration.
See `README.md` for exact steps.
