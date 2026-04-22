import { portfolio, type Project } from "@/content/portfolio";

import { DefaultProjectTemplate } from "../site/default-project-template";
import { HomeServerClientShell } from "./home-server-client-shell";

type HomeServerTemplateProps = {
  project: Project;
};

export function HomeServerTemplate({ project }: HomeServerTemplateProps) {
  return (
    <>
      <section className="pt-4">
        <HomeServerClientShell homeServer={portfolio.homeServer} />
      </section>
      <DefaultProjectTemplate project={project} />
    </>
  );
}
