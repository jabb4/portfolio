import { portfolio } from "@/content/portfolio";

import { ProjectLinkItem } from "./project-link-item";

export function ContactPanel() {
  const { profile } = portfolio;

  return (
    <section className="pt-8" id="contact">
      <div className="surface-panel surface-panel-grid px-6 py-6 md:px-8 md:py-8 xl:px-10">
        <h2 className="section-title text-slate-50 md:text-4xl">{profile.contactTitle}</h2>
        <p className="section-copy mt-4 max-w-2xl text-base">{profile.contactCopy}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <ProjectLinkItem href={`mailto:${profile.email}`} label="Email" />
          <ProjectLinkItem href={profile.github} label="GitHub" />
          <ProjectLinkItem href={profile.linkedin} label="LinkedIn" />
        </div>
      </div>
    </section>
  );
}
