import Image from "next/image";

import { ContactPanel } from "@/components/site/contact-panel";
import { PortfolioShell } from "@/components/site/portfolio-shell";
import { ProjectCard } from "@/components/site/project-card";
import { featuredProjects, portfolio } from "@/content/portfolio";
import { withBasePath } from "@/lib/base-path";
import { buildHomeMetadata } from "@/lib/metadata";

export function generateMetadata() {
  return buildHomeMetadata();
}

export default function HomePage() {
  const { profile } = portfolio;

  return (
    <PortfolioShell>
      <section className="grid gap-10 pb-8 pt-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">
            {profile.helloLine}
          </p>
          <h1 className="mt-5 max-w-[11ch] text-5xl font-semibold tracking-[-0.08em] text-slate-50 sm:text-6xl lg:text-7xl">
            {profile.introTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">{profile.introCopy}</p>
        </div>

        <div className="grid-panel p-3 sm:p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,201,240,0.18),transparent_42%)]" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80">
            <Image
              alt={profile.profileImageAlt}
              className="h-auto w-full object-cover"
              height={960}
              priority
              sizes="(min-width: 1280px) 360px, (min-width: 1024px) 320px, 100vw"
              src={withBasePath(profile.profileImage)}
              width={960}
            />
          </div>
        </div>
      </section>

      <section className="pt-6" id="projects">
        <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">
              Featured work
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-50 md:text-4xl">
              Selected projects
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-slate-400">
            A compact set of projects that show how I think about systems, product quality,
            and implementation details.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <ContactPanel />
    </PortfolioShell>
  );
}
