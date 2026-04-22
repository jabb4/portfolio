"use client";

import { useEffect, useRef, useState } from "react";

import type { HomeServerContent } from "@/content/portfolio";

import {
  mountHomeServerScene,
  type HomeServerSceneHandle,
} from "./home-server-scene";

type HomeServerExperienceProps = {
  homeServer: HomeServerContent;
};

export default function HomeServerExperience({ homeServer }: HomeServerExperienceProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(homeServer.deviceOrder[0] ?? "");
  const [hoveredDeviceId, setHoveredDeviceId] = useState<string | null>(null);
  const [sceneHoveredDeviceId, setSceneHoveredDeviceId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackRef = useRef<HTMLParagraphElement | null>(null);
  const sceneHandleRef = useRef<HomeServerSceneHandle | null>(null);
  const selectedDeviceIdRef = useRef(selectedDeviceId);
  const hoveredDeviceIdRef = useRef<string | null>(hoveredDeviceId);
  const shellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    selectedDeviceIdRef.current = selectedDeviceId;
    sceneHandleRef.current?.syncVisualState();
  }, [selectedDeviceId]);

  useEffect(() => {
    hoveredDeviceIdRef.current = hoveredDeviceId;
    sceneHandleRef.current?.syncVisualState();
  }, [hoveredDeviceId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;

    if (!canvas || !shell) {
      return;
    }

    try {
      sceneHandleRef.current = mountHomeServerScene({
        canvas,
        shell,
        getHoveredDeviceId: () => hoveredDeviceIdRef.current,
        getSelectedDeviceId: () => selectedDeviceIdRef.current,
        onHoverDeviceChange: setSceneHoveredDeviceId,
        onSelectDevice: setSelectedDeviceId,
      });
      sceneHandleRef.current.syncVisualState();
    } catch {
      canvas.hidden = true;
      fallbackRef.current?.classList.remove("hidden");
    }

    return () => {
      sceneHandleRef.current?.destroy();
      sceneHandleRef.current = null;
    };
  }, []);

  const activeDeviceId = sceneHoveredDeviceId ?? hoveredDeviceId ?? selectedDeviceId;
  const inspectorDevice = homeServer.devicesById[activeDeviceId];

  if (!inspectorDevice) {
    return null;
  }

  return (
    <section className="surface-panel surface-panel-grid px-5 py-5 md:px-6 md:py-6">
      <div className="relative z-10 grid gap-6">
        <div>
          <h2 className="section-title text-slate-50 md:text-4xl">{homeServer.heading}</h2>
          <p className="section-copy mt-4 max-w-2xl text-base">{homeServer.intro}</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-stretch">
          <div>
            <div className="rack-canvas-shell" ref={shellRef}>
              <canvas
                aria-label="Interactive 3D home server rack"
                className="rack-canvas"
                ref={canvasRef}
              />
              <p className="home-server-fallback hidden" ref={fallbackRef}>
                {homeServer.fallbackMessage}
              </p>
            </div>

            <div className="mt-4">
              <p className="section-kicker">Device Selection</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {homeServer.deviceOrder.map((deviceId) => {
                  const device = homeServer.devicesById[deviceId];
                  const isSelected = deviceId === selectedDeviceId;
                  const isHovered = deviceId === hoveredDeviceId || deviceId === sceneHoveredDeviceId;

                  if (!device) {
                    return null;
                  }

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`surface-card-soft flex min-h-14 min-w-0 items-center px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-sky-300/80 bg-sky-400/14 text-slate-50 shadow-[0_18px_34px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-sky-300/28"
                          : isHovered
                            ? "border-sky-300/58 bg-sky-400/10 text-slate-50 ring-1 ring-inset ring-sky-300/16"
                            : "text-slate-100 hover:-translate-y-0.5 hover:border-sky-300/50 hover:bg-sky-400/8 hover:text-slate-50"
                      }`}
                      key={device.id}
                      onBlur={() => setHoveredDeviceId(null)}
                      onClick={() => setSelectedDeviceId(device.id)}
                      onFocus={() => setHoveredDeviceId(device.id)}
                      onMouseEnter={() => setHoveredDeviceId(device.id)}
                      onMouseLeave={() => setHoveredDeviceId(null)}
                      type="button"
                    >
                      <span className="font-semibold">{device.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="surface-card-soft p-5 md:p-6 xl:flex xl:h-full xl:flex-col xl:self-stretch">
            <div className="grid gap-5 xl:h-full xl:content-start">
              <div>
                <h2 className="section-title text-slate-50">{inspectorDevice.title}</h2>
                <p className="font-mono mt-3 text-xs uppercase tracking-[0.28em] text-sky-200">
                  {inspectorDevice.role}
                </p>
                <p className="section-copy mt-4 text-base">{inspectorDevice.summary}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {inspectorDevice.facts.map((fact) => (
                  <dl
                    className="surface-card-soft px-4 py-4"
                    key={`${inspectorDevice.id}-${fact.label}`}
                  >
                    <dt className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-slate-500">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 text-base font-semibold text-slate-50">{fact.value}</dd>
                  </dl>
                ))}
              </div>

              <div>
                <p className="section-kicker">Key Services</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {inspectorDevice.services.map((service) => (
                    <span className="tag-pill" key={`${inspectorDevice.id}-${service}`}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
