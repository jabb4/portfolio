import Image from "next/image";

import { ContactPanel } from "@/components/site/contact-panel";
import { PortfolioShell } from "@/components/site/portfolio-shell";
import { ProjectCard } from "@/components/site/project-card";
import { featuredProjects, portfolio } from "@/content/portfolio";
import { buildHomeMetadata } from "@/lib/metadata";

export function generateMetadata() {
  return buildHomeMetadata();
}

export default function HomePage() {
  const { profile } = portfolio;

  return (
    <PortfolioShell>
      <section className="hero-band px-2 py-12 md:py-16 lg:px-0 lg:py-20">
        <div className="absolute inset-x-0 top-0 -z-10 h-full">
          <div className="absolute left-[-8rem] top-10 h-52 w-52 rounded-full bg-sky-400/16 blur-3xl md:h-72 md:w-72" />
          <div className="absolute right-[-4rem] top-0 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl md:h-56 md:w-56" />
        </div>

        <div className="grid gap-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center lg:gap-14">
            <div className="max-w-4xl">
              <h1 className="hero-title max-w-[12ch] text-slate-50">{profile.introTitle}</h1>
            </div>

            <div className="relative mx-auto w-full max-w-[220px] lg:mx-0 lg:max-w-[260px] lg:justify-self-center">
              <div className="absolute inset-4 -z-10 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="rounded-full border border-white/10 bg-white/[0.03] p-3 shadow-[0_26px_70px_rgba(0,0,0,0.36)]">
                <div className="overflow-hidden rounded-full border border-sky-300/18 bg-[linear-gradient(180deg,rgba(17,23,34,0.72),rgba(8,12,18,0.9))]">
                  <Image
                    alt={profile.profileImageAlt}
                    className="aspect-square h-auto w-full object-cover"
                    height={960}
                    priority
                    sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, 52vw"
                    src={profile.profileImage}
                    width={960}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="section-copy max-w-2xl text-lg md:text-[1.125rem]">{profile.introCopy}</p>
        </div>
      </section>

      <section className="pt-6" id="projects">
        <div className="surface-panel px-6 py-6 md:px-8 md:py-8 xl:px-10">
          <div className="pb-8">
            <h2 className="section-title text-slate-50">Selected projects</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <ContactPanel />
    </PortfolioShell>
  );
}
