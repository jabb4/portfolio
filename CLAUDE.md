@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js 16 + React 19

This project is on Next.js `^16.2.4` and React `^19.2.5`. APIs, conventions, and file structure differ from older Next.js versions. Before writing or editing anything Next-related, consult `node_modules/next/dist/docs/` (notably `01-app/`) for the version actually installed here — do not rely on prior knowledge of Next.js 13/14/15.

Notable consequences already in the code:
- Route handler `params` is a `Promise` and must be awaited (see `src/app/projects/[slug]/page.tsx`).
- `next dev` runs with `--turbopack`.

## Commands

- `npm install` — install dependencies (this project uses npm, not pnpm, despite the global preference).
- `npm run dev` — start the Turbopack dev server at `http://localhost:3000`.
- `npm run build` — produce a static export in `out/` (driven by `output: "export"` in `next.config.ts`).
- `npm run lint` — ESLint with `--max-warnings=0`; there is no separate typecheck script, so lint and build are the gates.
- `python3 -m http.server 3000 --directory out` — preview the exported static site locally after a build.

There is no test runner configured.

## Architecture

### Static export, not SSR
`next.config.ts` sets `output: "export"`, `trailingSlash: true`, and `images.unoptimized: true`. Everything must work as a fully pre-rendered static site — no server runtime, no ISR, no route handlers. The build emits to `out/`, which the GitHub Actions workflow at `.github/workflows/deploy-pages.yml` deploys to GitHub Pages on pushes to `main`.

The site assumes it lives at the root of a domain (e.g. `https://jabb4.github.io/`). There is no `basePath` / subpath handling — adding project-site hosting would require config changes.

### Single typed content source
`src/content/portfolio.ts` is the source of truth for everything visible on the site: profile, contact links, the full list of projects, and the `home-server` device/inspector content. The exported `portfolio`, `featuredProjects`, and `getProjectBySlug` are consumed by pages and components throughout `src/`. Editing copy or adding projects almost always means editing this file rather than touching components.

### Project routing and the custom-template escape hatch
`src/app/projects/[slug]/page.tsx` is the only project route. It:
1. Sets `dynamicParams = false` and uses `generateStaticParams()` over `portfolio.projects`, so only slugs present in `portfolio.ts` exist at build time.
2. Awaits `params` (Next.js 16 API), looks up the project, and calls `notFound()` if absent.
3. Dispatches on `project.customTemplate`: when it equals `"home-server"`, it renders `HomeServerTemplate`; otherwise `DefaultProjectTemplate`.

To add a standard project: add an entry in `portfolio.ts` with a unique `slug` and omit `customTemplate`. To add a bespoke experience: extend the `ProjectTemplateId` union, add a new template component, and add another branch in the dispatch in `page.tsx`.

### Server vs. client boundaries (Three.js)
The `home-server` project page embeds a Three.js scene that must not run on the server. The pattern used:
- `home-server-template.tsx` (server component) renders `HomeServerClientShell`.
- `home-server-client-shell.tsx` is `"use client"` and `dynamic(() => import("./home-server-experience"), { ssr: false })`.
- `home-server-experience.tsx` + `home-server-scene.ts` contain the actual Three.js code.

Anything browser-only (Three.js, `window`, etc.) belongs behind this `ssr: false` dynamic-import boundary, otherwise the static export will fail.

### Component layout
- `src/components/site/` — shared, server-renderable UI (header, project card/menu, hero, contact panel, default project template, portfolio shell wrapper).
- `src/components/home-server/` — the only place client-only / Three.js code lives.
- `src/lib/metadata.ts` — small helpers that build `Metadata` objects from `portfolio.ts`; used by `generateMetadata` in pages.

### Path alias
`tsconfig.json` maps `@/*` → `./src/*`. Use `@/content/portfolio`, `@/components/...`, `@/lib/...` in imports.
