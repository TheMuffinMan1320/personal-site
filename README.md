# Personal site

A minimal, monochrome portfolio site built with plain HTML/CSS/JS — no build step,
no framework, no dependencies.

## Files

- `index.html` — all content (hero, projects, experience, skills, contact)
- `styles.css` — all styling
- `script.js` — mobile nav toggle + active-section highlighting
- `resume.pdf` — placeholder path referenced by the nav and footer; add your actual resume here

## Before you publish

Everything in `index.html` is placeholder content — replace it with your own:

1. **Hero** — name, tagline, bio, and the three link URLs (email, GitHub, LinkedIn).
2. **Projects** — three `<article class="project">` blocks. Swap in your own projects,
   update the `source`/`demo` links (currently `#` placeholders), and edit the `<li>` tags
   under `.tags` to match your stack.
3. **Experience** — three `<article class="role">` blocks with role, org, dates, and bullets.
4. **Skills** — edit the three `.skill-group` lists (languages, frameworks & tools, coursework).
5. **Resume** — drop a `resume.pdf` file next to `index.html`, or update the two links
   pointing to it if you want to host it elsewhere.
6. **Page title / meta description** in the `<head>` of `index.html`.

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

- Type: Fraunces (display), Inter (body), IBM Plex Mono (labels, nav, tags) —
  the monospace accents are a deliberate nod to the CS subject matter.
- Color: strict grayscale (`--ink`, `--muted`, `--faint`, `--rule`, `--paper`) —
  no accent color, per the minimalist brief.
- Signature element: the blinking cursor after your name, and the `~/section`
  terminal-style nav labels.
- Fully responsive with a collapsing mobile nav, visible keyboard focus states,
  and `prefers-reduced-motion` support.
