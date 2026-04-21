import type { Project } from "@/content/portfolio";

type DefaultProjectTemplateProps = {
  project: Project;
};

export function DefaultProjectTemplate({ project }: DefaultProjectTemplateProps) {
  return (
    <>
      <section className="pt-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {project.sections.map((section) => (
            <article
              className="rounded-[1.75rem] border border-white/10 bg-[rgba(16,18,26,0.92)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
              key={section.title}
            >
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pt-6">
        <div className="rounded-[1.75rem] border border-white/10 bg-[rgba(16,18,26,0.92)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.35)] md:p-8">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">Highlights</p>
          <ul className="mt-6 grid gap-4 text-base leading-8 text-slate-300 md:grid-cols-3">
            {project.highlights.map((item) => (
              <li
                className="rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-4"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
