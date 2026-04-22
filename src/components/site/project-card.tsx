"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";

import type { Project } from "@/content/portfolio";

type ProjectCardProps = {
  project: Project;
};

type CardStyle = CSSProperties & {
  "--card-lift": string;
  "--card-rotate-x": string;
  "--card-rotate-y": string;
};

const baseStyle: CardStyle = {
  "--card-lift": "0px",
  "--card-rotate-x": "0deg",
  "--card-rotate-y": "0deg",
};

type MotionState = {
  lift: number;
  rotateX: number;
  rotateY: number;
};

const defaultState: MotionState = {
  lift: 0,
  rotateX: 0,
  rotateY: 0,
};

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const currentRef = useRef<MotionState>(defaultState);
  const targetRef = useRef<MotionState>(defaultState);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  function setCardStyles(state: MotionState) {
    if (!cardRef.current) {
      return;
    }

    cardRef.current.style.setProperty("--card-lift", `${state.lift.toFixed(2)}px`);
    cardRef.current.style.setProperty("--card-rotate-x", `${state.rotateX.toFixed(2)}deg`);
    cardRef.current.style.setProperty("--card-rotate-y", `${state.rotateY.toFixed(2)}deg`);
  }

  function animateCard() {
    const current = currentRef.current;
    const target = targetRef.current;

    currentRef.current = {
      lift: current.lift + (target.lift - current.lift) * 0.18,
      rotateX: current.rotateX + (target.rotateX - current.rotateX) * 0.18,
      rotateY: current.rotateY + (target.rotateY - current.rotateY) * 0.18,
    };

    setCardStyles(currentRef.current);

    const isSettled =
      Math.abs(currentRef.current.lift - target.lift) < 0.02 &&
      Math.abs(currentRef.current.rotateX - target.rotateX) < 0.02 &&
      Math.abs(currentRef.current.rotateY - target.rotateY) < 0.02;

    if (isSettled) {
      currentRef.current = { ...target };
      setCardStyles(currentRef.current);
      frameRef.current = null;
      return;
    }

    frameRef.current = requestAnimationFrame(animateCard);
  }

  function scheduleAnimation() {
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(animateCard);
    }
  }

  function resetCard() {
    targetRef.current = { ...defaultState };
    scheduleAnimation();
  }

  function handlePointerEnter(event: PointerEvent<HTMLAnchorElement>) {
    boundsRef.current = event.currentTarget.getBoundingClientRect();
    targetRef.current = {
      ...targetRef.current,
      lift: -6,
    };
    scheduleAnimation();
  }

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    const bounds = boundsRef.current ?? event.currentTarget.getBoundingClientRect();
    boundsRef.current = bounds;

    const percentX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const percentY = ((event.clientY - bounds.top) / bounds.height) * 100;

    targetRef.current = {
      lift: -6,
      rotateX: ((50 - percentY) / 50) * 4,
      rotateY: ((percentX - 50) / 50) * 4,
    };

    scheduleAnimation();
  }

  function handleFocus() {
    targetRef.current = {
      lift: -4,
      rotateX: 0,
      rotateY: 0,
    };
    scheduleAnimation();
  }

  return (
    <Link
      className="surface-card group relative block overflow-hidden p-6 transition-[border-color,box-shadow] duration-150 ease-out will-change-transform [transform:perspective(1200px)_translateY(var(--card-lift))_rotateX(var(--card-rotate-x))_rotateY(var(--card-rotate-y))] hover:border-sky-300/35 hover:shadow-[0_24px_58px_rgba(0,0,0,0.38)] focus-visible:border-sky-300/35 focus-visible:outline-none focus-visible:shadow-[0_24px_58px_rgba(0,0,0,0.38)] md:p-7"
      href={`/projects/${project.slug}`}
      onBlur={resetCard}
      onFocus={handleFocus}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={resetCard}
      onPointerMove={handlePointerMove}
      ref={cardRef}
      style={baseStyle}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_44%)] opacity-70 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.86),transparent)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/0 transition-[box-shadow,ring-color] duration-150 group-hover:ring-sky-300/12 group-focus-visible:ring-sky-300/12" />

      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div className="text-2xl font-semibold tracking-[-0.05em] text-slate-50 transition-colors duration-150 group-hover:text-sky-50 group-focus-visible:text-sky-50">
            {project.title}
          </div>

          <span className="font-mono shrink-0 text-sm uppercase tracking-[0.24em] text-slate-500 transition-colors duration-150 group-hover:text-slate-300 group-focus-visible:text-slate-300">
            {project.year}
          </span>
        </div>

        <p className="section-copy mt-4 text-base">{project.summary}</p>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span className="tag-pill" key={item}>
            {item}
          </span>
        ))}
      </div>
    </Link>
  );
}
