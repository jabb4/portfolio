import type { Metadata } from "next";

import { portfolio } from "@/content/portfolio";

export function buildHomeMetadata(): Metadata {
  return {
    title: `${portfolio.profile.name} | Portfolio`,
    description: portfolio.profile.introCopy,
  };
}

export function buildProjectMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} | ${portfolio.profile.name}`,
    description,
  };
}
