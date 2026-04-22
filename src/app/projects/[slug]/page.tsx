import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactPanel } from "@/components/site/contact-panel";
import { DefaultProjectTemplate } from "@/components/site/default-project-template";
import { PortfolioShell } from "@/components/site/portfolio-shell";
import { ProjectHero } from "@/components/site/project-hero";
import { HomeServerTemplate } from "@/components/home-server/home-server-template";
import { getProjectBySlug, portfolio } from "@/content/portfolio";
import { buildProjectMetadata } from "@/lib/metadata";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return portfolio.projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: `Project Not Found | ${portfolio.profile.name}`,
      description: portfolio.profile.introCopy,
    };
  }

  return buildProjectMetadata(project.title, project.summary);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const isHomeServer = project.customTemplate === "home-server";

  return (
    <PortfolioShell currentSlug={project.slug}>
      <ProjectHero project={project} />
      {isHomeServer ? (
        <HomeServerTemplate project={project} />
      ) : (
        <DefaultProjectTemplate project={project} />
      )}
      <ContactPanel />
    </PortfolioShell>
  );
}
