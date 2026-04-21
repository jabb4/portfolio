import { portfolio } from "@/content/portfolio";

import { ProjectLinkItem } from "./project-link-item";

export function ContactPanel() {
  const { profile } = portfolio;

  return (
    <section className="pt-8" id="contact">
      <div className="rounded-[1.75rem] border border-white/10 bg-[rgba(16,18,26,0.92)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.35)] md:p-8">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">Contact</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-50 md:text-4xl">
          {profile.contactTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">{profile.contactCopy}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <ProjectLinkItem href={`mailto:${profile.email}`} label="Email" />
          <ProjectLinkItem href={profile.github} label="GitHub" />
          <ProjectLinkItem href={profile.linkedin} label="LinkedIn" />
        </div>
      </div>
    </section>
  );
}
