"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pendingFocusIndexRef = useRef<number | null>(null);
  const menuId = useId();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open || pendingFocusIndexRef.current === null) {
      return;
    }

    const focusIndex = pendingFocusIndexRef.current;
    pendingFocusIndexRef.current = null;

    const frame = requestAnimationFrame(() => {
      focusLink(focusIndex);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [open]);

  function focusLink(index: number) {
    const links = linkRefs.current.filter(Boolean);

    if (!links.length) {
      return;
    }

    const nextIndex = (index + links.length) % links.length;
    links[nextIndex]?.focus();
  }

  return (
    <div className="relative z-40" ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`action-pill ${open ? "border-sky-300/35 bg-[rgba(18,31,46,0.98)]" : ""}`}
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            pendingFocusIndexRef.current = 0;
            setOpen(true);
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            pendingFocusIndexRef.current = projects.length - 1;
            setOpen(true);
          }
        }}
      >
        Projects
        <span
          aria-hidden="true"
          className={`ml-2 text-xs text-slate-400 transition ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div
          className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-[min(18rem,calc(100vw-2rem))] origin-top-left overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,23,33,0.98),rgba(11,15,23,0.98))] p-2 shadow-[0_20px_44px_rgba(0,0,0,0.34)] backdrop-blur md:left-auto md:right-0 md:origin-top-right"
          id={menuId}
          role="menu"
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
                    : "text-slate-400 hover:bg-white/6 hover:text-slate-50"
                }`}
                href={`/projects/${project.slug}`}
                key={project.slug}
                role="menuitem"
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
      ) : null}
    </div>
  );
}
