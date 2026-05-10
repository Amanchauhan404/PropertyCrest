"use client";

import { useEffect } from "react";

export function SmoothScrollMount() {
  useEffect(() => {
    const pointerFine = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wideViewport = window.matchMedia("(min-width: 1024px)");

    if (!pointerFine.matches || reduceMotion.matches || !wideViewport.matches) {
      return;
    }

    let rafId = 0;
    let lenisInstance: { raf: (time: number) => void; destroy: () => void } | null =
      null;
    let cancelled = false;

    async function startSmoothScroll() {
      const { default: Lenis } = await import("lenis");

      if (cancelled) return;

      lenisInstance = new Lenis({
        lerp: 0.12,
        wheelMultiplier: 0.82,
        touchMultiplier: 0,
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenisInstance?.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };

      rafId = window.requestAnimationFrame(raf);
    }

    startSmoothScroll();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  return null;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <SmoothScrollMount />
    </>
  );
}
