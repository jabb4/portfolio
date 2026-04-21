import Link from "next/link";

import { portfolio } from "@/content/portfolio";

import { ProjectMenu } from "./project-menu";

type SiteHeaderProps = {
  currentSlug?: string;
};

export function SiteHeader({ currentSlug }: SiteHeaderProps) {
  return (
    <header className="sticky top-4 z-20 mt-4 flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-[rgba(9,9,12,0.86)] px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between md:gap-6 md:px-5">
      <Link
        className="font-mono inline-flex min-h-11 items-center text-2xl font-semibold uppercase tracking-[0.12em] text-slate-50"
        href="/"
      >
        {portfolio.profile.name}
      </Link>

      <nav
        aria-label="Primary navigation"
        className="flex flex-wrap items-center gap-2 md:justify-end"
      >
        <ProjectMenu
          currentSlug={currentSlug}
          projects={portfolio.projects.map(({ slug, title }) => ({ slug, title }))}
        />
        <a
          className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-100 transition hover:border-sky-300/35 hover:bg-slate-900"
          href="#contact"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
