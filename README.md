# Portfolio

Portfolio site rebuilt with `Next.js` App Router, `Tailwind CSS`, and a typed content model.

## Structure

- `src/app/` contains the App Router pages, layout, and global styles.
- `src/content/portfolio.ts` is the single typed source of truth for profile data, projects, and the `home-server` page content.
- `src/components/site/` contains shared UI like the header, cards, contact panel, and generic project template.
- `src/components/home-server/` contains the client-only Three.js experience for the `home-server` route.
- `public/` contains static assets copied into the export, including the profile image and `.nojekyll` for GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Customize

Update [`src/content/portfolio.ts`](/Users/jacob/Projects/portfolio/src/content/portfolio.ts) to change:

- profile metadata and intro copy
- contact links
- featured projects and their project page content
- the `home-server` device/inspector content

## Add A New Project Page

1. Add a new project object in [`src/content/portfolio.ts`](/Users/jacob/Projects/portfolio/src/content/portfolio.ts).
2. Give it a unique `slug`.
3. For a standard project page, omit `customTemplate` and the generic route will render it automatically.
4. For a custom experience, add a new template component and dispatch to it from [`src/app/projects/[slug]/page.tsx`](/Users/jacob/Projects/portfolio/src/app/projects/[slug]/page.tsx).

## Production Build

```bash
npm run build
```

This creates a static export in `out/`.

## GitHub Pages

Build with the repository subpath set through `NEXT_PUBLIC_BASE_PATH`:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
```

Replace `/portfolio` with your repository path if it differs. The generated `out/` directory is ready for static hosting, and `public/.nojekyll` ensures the exported `_next/` assets are served correctly on GitHub Pages.
