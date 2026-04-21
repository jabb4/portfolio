"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import type { Project } from "@/content/portfolio";

type ProjectCardProps = {
  project: Project;
};

type CardStyle = CSSProperties & {
  "--card-rotate-x": string;
  "--card-rotate-y": string;
};

const baseStyle: CardStyle = {
  "--card-rotate-x": "0deg",
  "--card-rotate-y": "0deg",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(21,25,37,0.92),rgba(12,16,23,0.98))] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.35)] transition duration-200 hover:border-sky-300/25 [transform:perspective(1200px)_rotateX(var(--card-rotate-x))_rotateY(var(--card-rotate-y))] md:p-7"
      href={`/projects/${project.slug}`}
      onBlur={(event) => {
        event.currentTarget.style.setProperty("--card-rotate-x", "0deg");
        event.currentTarget.style.setProperty("--card-rotate-y", "0deg");
      }}
      onFocus={(event) => {
        event.currentTarget.style.setProperty("--card-rotate-x", "0deg");
        event.currentTarget.style.setProperty("--card-rotate-y", "0deg");
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--card-rotate-x", "0deg");
        event.currentTarget.style.setProperty("--card-rotate-y", "0deg");
      }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const percentX = ((event.clientX - bounds.left) / bounds.width) * 100;
        const percentY = ((event.clientY - bounds.top) / bounds.height) * 100;
        const rotateY = ((percentX - 50) / 50) * 4;
        const rotateX = ((50 - percentY) / 50) * 4;

        event.currentTarget.style.setProperty("--card-rotate-x", `${rotateX}deg`);
        event.currentTarget.style.setProperty("--card-rotate-y", `${rotateY}deg`);
      }}
      style={baseStyle}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.12),transparent_42%)] opacity-70 transition group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-xl font-semibold tracking-[-0.04em] text-slate-50">{project.title}</div>
          <p className="mt-4 text-base leading-8 text-slate-400">{project.summary}</p>
        </div>

        <span className="font-mono shrink-0 text-sm uppercase tracking-[0.24em] text-slate-500">
          {project.year}
        </span>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span
            className="font-mono rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </Link>
  );
}
