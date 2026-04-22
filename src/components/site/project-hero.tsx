import type { Project } from "@/content/portfolio";

import { ProjectLinkItem } from "./project-link-item";

type ProjectHeroProps = {
  project: Project;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  const visibleLinks = project.links.filter((link) => link.label !== "Architecture");
  const heroTags = project.heroTags ?? project.stack;

  return (
    <section className="surface-panel surface-panel-grid px-6 py-6 md:px-8 md:py-8 xl:px-10 xl:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_320px] lg:gap-8">
        <div className="max-w-4xl">
          <h1 className="display-title max-w-4xl text-slate-50">{project.title}</h1>
          <p className="section-copy mt-6 max-w-3xl text-lg">{project.summary}</p>

          {visibleLinks.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {visibleLinks.map((link) => (
                <ProjectLinkItem href={link.href} key={link.label} label={link.label} />
              ))}
            </div>
          ) : null}
        </div>

        <aside className="surface-card-soft p-5 md:p-6">
          <div className="grid gap-4">
            <div className="info-stat">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-slate-500">
                Timeline
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-50">{project.year}</p>
            </div>

            <div className="info-stat">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-slate-500">
                Tags
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {heroTags.map((item) => (
                  <span className="tag-pill" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
