"use client";

import { useEffect, useState } from "react";
import type { Toaster as ToasterComponent } from "sonner";

type ToasterType = typeof ToasterComponent;

export function LazyToaster() {
  const [Toaster, setToaster] = useState<ToasterType | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      import("sonner").then((mod) => {
        if (!cancelled) {
          setToaster(() => mod.Toaster);
        }
      });
    };

    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown"];
    events.forEach((event) => window.addEventListener(event, load, { once: true, passive: true }));

    return () => {
      cancelled = true;
      events.forEach((event) => window.removeEventListener(event, load));
    };
  }, []);

  return Toaster ? <Toaster richColors position="top-right" /> : null;
}
