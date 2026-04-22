import type { Project } from "@/content/portfolio";

type DefaultProjectTemplateProps = {
  project: Project;
};

export function DefaultProjectTemplate({ project }: DefaultProjectTemplateProps) {
  return (
    <section className="pt-6">
      <div className="surface-panel px-6 py-6 md:px-8 md:py-8 xl:px-10">
        <div className="pb-8">
          <div className="max-w-2xl">
            <h2 className="section-title text-slate-50">How the project comes together</h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {project.sections.map((section) => (
            <article className="surface-card-soft p-6" key={section.title}>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-50">
                {section.title}
              </h3>
              <p className="section-copy mt-4 text-base">{section.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
