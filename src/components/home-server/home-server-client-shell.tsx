"use client";

import dynamic from "next/dynamic";

import type { HomeServerContent } from "@/content/portfolio";

const HomeServerExperience = dynamic(() => import("./home-server-experience"), {
  ssr: false,
  loading: () => (
    <div className="surface-panel surface-panel-grid px-6 py-6 md:px-8 md:py-8">
      <div className="relative z-10">
        <p className="section-copy text-base">Loading the rack view...</p>
      </div>
    </div>
  ),
});

type HomeServerClientShellProps = {
  homeServer: HomeServerContent;
};

export function HomeServerClientShell({ homeServer }: HomeServerClientShellProps) {
  return <HomeServerExperience homeServer={homeServer} />;
}
