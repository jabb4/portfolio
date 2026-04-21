import Link from "next/link";

import type { Project } from "@/content/portfolio";

import { ProjectLinkItem } from "./project-link-item";

type ProjectHeroProps = {
  project: Project;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="pb-8 pt-2 md:pb-10">
      <Link
        className="font-mono inline-flex items-center text-sm uppercase tracking-[0.18em] text-sky-300 transition hover:text-sky-200"
        href="/#projects"
      >
        Back to featured projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">{project.label}</p>
        <span className="font-mono text-sm uppercase tracking-[0.24em] text-slate-500">
          {project.year}
        </span>
      </div>

      <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-slate-50 sm:text-6xl lg:text-7xl">
        {project.title}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">{project.summary}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span
            className="font-mono rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.links.map((link) => (
          <ProjectLinkItem href={link.href} key={link.label} label={link.label} />
        ))}
      </div>
    </section>
  );
}
