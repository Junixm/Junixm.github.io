# Jun Heng — Portfolio

Personal portfolio site for Jun Heng, an Information Security student at NUS.
Built with React + Vite, presented as a full-page section deck over an animated
starfield with light/dark theming.

## Features

- **Full-page deck** — each wheel notch, swipe, or arrow key transitions one
  section at a time (Hero · About · Projects · Contact). Sections taller than
  the viewport scroll internally; the gesture logic absorbs momentum so a
  single swipe never overshoots a short section, while active spam-scrolling
  still chains through.
- **Light / dark theme** — toggle in the header, defaulting to time of day and
  persisted in `localStorage`. Dark mode renders a parallax starfield and
  floating particles; light mode a soft canvas backdrop.
- **Scroll-reveal transitions**, animated down-arrow cues, sticky header nav,
  and a fixed footer.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Project structure

```
src/
  App.jsx                 # composes the page
  components/
    FullPage.jsx          # full-page scroll/transition controller
    Header.jsx, ThemeToggle.jsx
    Hero.jsx, About.jsx, Projects.jsx, Contact.jsx, Footer.jsx
    Section.jsx           # reveal-on-scroll section wrapper
    Starfield.jsx, Particles.jsx, LightBackground.jsx
  hooks/
    useTheme.js           # theme state + persistence
    useReveal.js          # IntersectionObserver reveal hook
  index.css               # all styles + design tokens
public/images/            # profile photo and social icons
```

## Deployment

Source lives on `dev`. Every push to `dev` triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the
SPA and publishes the static output to `main`, which GitHub Pages serves.

The Vite `base` path is set via the `VITE_BASE` env var (the workflow derives it
from the repo name): `/` for a user page (`<user>.github.io`) or `/<repo>/` for
a project page.
