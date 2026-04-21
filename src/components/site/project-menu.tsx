"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuProject = {
  slug: string;
  title: string;
};

type ProjectMenuProps = {
  currentSlug?: string;
  projects: MenuProject[];
};

export function ProjectMenu({ currentSlug, projects }: ProjectMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function focusLink(index: number) {
    const links = linkRefs.current.filter(Boolean);

    if (!links.length) {
      return;
    }

    const nextIndex = (index + links.length) % links.length;
    links[nextIndex]?.focus();
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-controls="project-menu"
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-100 transition hover:border-sky-300/35 hover:bg-slate-900"
        type="button"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            focusLink(0);
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            focusLink(projects.length - 1);
          }
        }}
      >
        Projects
        <span
          aria-hidden="true"
          className={`text-xs text-slate-400 transition ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      <div
        className={`absolute right-0 top-full z-30 mt-3 min-w-56 rounded-3xl border border-white/10 bg-slate-950/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur ${
          open ? "block" : "hidden"
        }`}
        id="project-menu"
        onKeyDown={(event) => {
          const activeIndex = linkRefs.current.findIndex((link) => link === document.activeElement);

          if (event.key === "ArrowDown") {
            event.preventDefault();
            focusLink(activeIndex + 1);
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            focusLink(activeIndex - 1);
          }

          if (event.key === "Home") {
            event.preventDefault();
            focusLink(0);
          }

          if (event.key === "End") {
            event.preventDefault();
            focusLink(projects.length - 1);
          }
        }}
      >
        {projects.map((project, index) => {
          const active = project.slug === currentSlug;

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`block rounded-2xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-sky-400/10 text-slate-50"
                  : "text-slate-400 hover:bg-sky-400/8 hover:text-slate-50"
              }`}
              href={`/projects/${project.slug}`}
              key={project.slug}
              onClick={() => setOpen(false)}
              ref={(element) => {
                linkRefs.current[index] = element;
              }}
            >
              {project.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
