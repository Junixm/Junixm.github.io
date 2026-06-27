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

## Editing content

All site copy lives in [`content.yaml`](content.yaml) at the project root — you
should never need to touch the components to change text, links, cards, or
projects. The file is imported through [`src/content.js`](src/content.js) and
bundled at build time, so:

- `npm run dev` hot-reloads the moment you save the YAML.
- Changes only reach the live site after a rebuild/redeploy (push to `dev`),
  not by swapping the file on the server.

### How it maps to the page

| YAML key          | Section it drives                                            |
| ----------------- | ----------------------------------------------------------- |
| `hero`            | Headline, tagline, call-to-action, GitHub/LinkedIn icons    |
| `about`           | Profile photo, intro paragraphs, skill tags, info cards     |
| `projects`        | The project cards grid                                       |
| `contact`         | Closing heading, lead text, and social links                |

### Common edits

- **Add a skill tag** — append a string to `about.tags`.
- **Add an info card** — append an entry to `about.cards` with a `title` and an
  `items` list.
- **Add a row to a card** — append an item under that card's `items`. Each item
  supports:
  - `head` — the bold primary line (**required**).
  - `sub` — a muted line under the head.
  - `meta: { left, right }` — a two-sided row, justified to each edge (used for
    `school / year` and `AWS Academy Graduate / Training Badge`).
  - `href` — turns the `head` into a link (e.g. a credential badge).
- **Add a project** — append an entry to `projects`. Give it a `title`,
  `description`, `link`, and `link_label`, plus **either** an `image` URL **or**
  a `label` (the text shown in the placeholder when there's no image).

### Template

[`template.yml`](template.yml) is a blank skeleton showing every supported
field. Copy the parts you need into `content.yaml`.

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
content.yaml              # all editable site copy (see "Editing content")
src/
  content.js              # imports content.yaml and exposes the sections
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
