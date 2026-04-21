"use client";

import dynamic from "next/dynamic";

const HomeServerExperience = dynamic(() => import("./home-server-experience"), {
  ssr: false,
  loading: () => (
    <div className="grid-panel p-6 md:p-8">
      <div className="relative z-10">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">
          Interactive Rack
        </p>
        <p className="mt-4 text-base leading-8 text-slate-400">Loading the rack view...</p>
      </div>
    </div>
  ),
});

export function HomeServerClientShell() {
  return <HomeServerExperience />;
}
