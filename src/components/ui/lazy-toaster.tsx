"use client";

import { useEffect, useState } from "react";
import type { Toaster as ToasterComponent } from "sonner";

type ToasterType = typeof ToasterComponent;

export function LazyToaster() {
  const [Toaster, setToaster] = useState<ToasterType | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loaded = false;
    let idleId: number | null = null;
    let fallbackId: number | null = null;

    const load = () => {
      if (loaded) return;
      loaded = true;

      import("sonner").then((mod) => {
        if (!cancelled) {
          setToaster(() => mod.Toaster);
        }
      });
    };

    const win = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (win.requestIdleCallback) {
      idleId = win.requestIdleCallback(load, { timeout: 4500 });
    } else {
      fallbackId = window.setTimeout(load, 2600);
    }

    window.addEventListener("propertycrest:load-toaster", load, { once: true });

    return () => {
      cancelled = true;
      if (idleId && win.cancelIdleCallback) win.cancelIdleCallback(idleId);
      if (fallbackId) window.clearTimeout(fallbackId);
      window.removeEventListener("propertycrest:load-toaster", load);
    };
  }, []);

  return Toaster ? <Toaster richColors position="top-right" /> : null;
}
