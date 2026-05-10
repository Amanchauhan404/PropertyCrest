"use client";

import { useEffect, useRef } from "react";

const calmSelector =
  "a,button,input,textarea,select,label,p,h1,h2,h3,h4,h5,h6,li,span";

export function CursorAtmosphere() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const pointerFine = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!pointerFine.matches || reduceMotion.matches) return;

    let frame = 0;
    let active = false;
    let targetX = -180;
    let targetY = -180;
    let currentX = targetX;
    let currentY = targetY;

    const render = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      cursor.style.transform = `translate3d(${currentX - 58}px, ${currentY - 58}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      const target = event.target;
      const shouldCalm =
        target instanceof Element && Boolean(target.closest(calmSelector));
      cursor.dataset.calm = shouldCalm ? "true" : "false";

      if (!active) {
        active = true;
        currentX = targetX;
        currentY = targetY;
        cursor.style.opacity = "1";
        render();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="cursor-atmosphere pointer-events-none fixed left-0 top-0 z-[140] hidden size-[116px] opacity-0 lg:block"
    >
      <div className="cursor-gradient" />
      <div className="cursor-stars">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
