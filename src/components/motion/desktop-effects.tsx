"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";

type MotionComponents = {
  CursorAtmosphere: ComponentType;
  SmoothScrollMount: ComponentType;
};

export function DesktopEffects() {
  const [motionComponents, setMotionComponents] =
    useState<MotionComponents | null>(null);

  useEffect(() => {
    const pointerFine = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wideViewport = window.matchMedia("(min-width: 1024px)");

    if (!pointerFine.matches || reduceMotion.matches || !wideViewport.matches) {
      return;
    }

    let cancelled = false;

    async function loadDesktopMotion() {
      const [cursorModule, smoothModule] = await Promise.all([
        import("@/components/motion/cursor-atmosphere"),
        import("@/components/motion/smooth-scroll"),
      ]);

      if (cancelled) return;

      setMotionComponents({
        CursorAtmosphere: cursorModule.CursorAtmosphere,
        SmoothScrollMount: smoothModule.SmoothScrollMount,
      });
    }

    void loadDesktopMotion();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!motionComponents) return null;

  const { CursorAtmosphere, SmoothScrollMount } = motionComponents;

  return (
    <>
      <SmoothScrollMount />
      <CursorAtmosphere />
    </>
  );
}
