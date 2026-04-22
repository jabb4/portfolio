import Link from "next/link";

import { portfolio } from "@/content/portfolio";

import { ProjectMenu } from "./project-menu";

type SiteHeaderProps = {
  currentSlug?: string;
};

export function SiteHeader({ currentSlug }: SiteHeaderProps) {
  return (
    <header className="sticky top-4 z-20 mt-4 flex flex-col gap-3 overflow-visible rounded-[2rem] border border-white/10 bg-[rgba(8,11,16,0.88)] px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between md:gap-6 md:px-5">
      <Link
        className="inline-flex min-h-11 items-center text-[1.45rem] font-medium leading-none tracking-[-0.05em] text-slate-50 transition-colors hover:text-sky-100 md:text-[1.6rem]"
        href="/"
      >
        {portfolio.profile.name}
      </Link>

      <nav
        aria-label="Primary navigation"
        className="relative flex flex-wrap items-center gap-2 overflow-visible md:justify-end"
      >
        <ProjectMenu
          currentSlug={currentSlug}
          projects={portfolio.projects.map(({ slug, title }) => ({ slug, title }))}
        />
        <a className="action-pill-muted" href="#contact">
          Contact
        </a>
      </nav>
    </header>
  );
}
