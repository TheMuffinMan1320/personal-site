# Personal site

A minimal, monochrome portfolio site built with plain HTML/CSS/JS — no build step,
no framework, no dependencies.

## Files

- `index.html` — all content (hero, projects, experience, education, skills, open source, contact)
- `styles.css` — all styling
- `script.js` — mobile nav toggle + active-section highlighting
- `resume.pdf` — current resume linked from the nav and footer
- `assets/img/` — three CC BY-SA car photos (credited in the footer)

## Updating content

When the resume changes, update `index.html` to match and replace `resume.pdf`:

1. **Hero / intro** — bio paragraph and the three link URLs.
2. **Stats band** — headline numbers (`.stats`).
3. **Projects** — `.proj` blocks (with `.spec` boxes) and the smaller `.mini` cards.
4. **Experience** — `.role` rows; mark current roles with the `LIVE` chip.
5. **Skills / Education** — `.sk` rows and the licence card.
6. **Open source** — the `.pr` list.

## Running locally

No build step needed. Either open `index.html` directly in a browser, or serve it
so relative paths behave exactly like production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

**GitHub Pages** (free, simplest):
1. Push this folder to a GitHub repo.
2. In the repo settings, go to Pages → set source to the `main` branch, root folder.
3. Your site will be live at `https://<username>.github.io/<repo>`.

**Vercel / Netlify**: drag-and-drop the folder onto their dashboard, or connect
the GitHub repo — both auto-detect static sites with no configuration needed.

## Design notes

- Theme: monotone motorsport poster / workshop manual — paper, ink and grays only.
- Type: Archivo (expanded italic display), Instrument Serif (italic ledes), Saira Stencil One
  (numbers), Courier Prime (specs, stacks, dates).
- Photos: Creative Commons car photos, displayed in black and white. They are CC BY-SA, so keep
  the credit list in the footer when editing.
- Fully responsive with a collapsing mobile nav, visible keyboard focus states, and
  `prefers-reduced-motion` support.
