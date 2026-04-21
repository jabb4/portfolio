"use client";

import { useEffect, useRef, useState } from "react";

import { portfolio } from "@/content/portfolio";

import {
  mountHomeServerScene,
  type HomeServerSceneHandle,
} from "./home-server-scene";

const { homeServer } = portfolio;

export default function HomeServerExperience() {
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
  const isPreviewing =
    !!(sceneHoveredDeviceId ?? hoveredDeviceId) &&
    (sceneHoveredDeviceId ?? hoveredDeviceId) !== selectedDeviceId;

  if (!inspectorDevice) {
    return null;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:items-start">
      <section className="grid-panel p-5 md:p-6">
        <div className="relative z-10 grid gap-3">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">
              Interactive Rack
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-50 md:text-4xl">
              {homeServer.heading}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">{homeServer.intro}</p>
          </div>

          <div className="rack-canvas-shell mt-3" ref={shellRef}>
            <canvas
              aria-label="Interactive 3D home server rack"
              className="rack-canvas"
              ref={canvasRef}
            />
            <p className="home-server-fallback hidden" ref={fallbackRef}>
              {homeServer.fallbackMessage}
            </p>
          </div>

          <div className="mt-1">
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">
              Device Selection
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {homeServer.deviceOrder.map((deviceId) => {
                const device = homeServer.devicesById[deviceId];
                const isSelected = deviceId === selectedDeviceId;
                const isActive = deviceId === activeDeviceId;

                if (!device) {
                  return null;
                }

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`flex min-h-14 min-w-0 items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-sky-300/45 bg-[rgba(16,30,40,0.92)] text-slate-50"
                        : "border-sky-200/15 bg-[rgba(18,22,31,0.84)] text-slate-100 hover:-translate-y-0.5 hover:border-sky-300/32"
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
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                      {device.buttonMeta}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <aside className="grid-panel sticky top-28 p-5 md:p-6 xl:self-start">
        <div className="relative z-10 grid gap-5">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">
              {isPreviewing ? "Previewing Device" : "Selected Device"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-50">
              {inspectorDevice.title}
            </h2>
            <p className="font-mono mt-2 text-xs uppercase tracking-[0.28em] text-sky-200">
              {inspectorDevice.role}
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">{inspectorDevice.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {inspectorDevice.facts.map((fact) => (
              <dl
                className="rounded-3xl border border-sky-200/12 bg-[rgba(14,18,26,0.86)] px-4 py-4"
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
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">
              Key Services
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {inspectorDevice.services.map((service) => (
                <span
                  className="rounded-full border border-sky-200/12 bg-[rgba(22,28,38,0.9)] px-3 py-2 text-sm text-slate-200"
                  key={`${inspectorDevice.id}-${service}`}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-500">{inspectorDevice.footnote}</p>
        </div>
      </aside>
    </div>
  );
}
