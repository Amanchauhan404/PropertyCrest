"use client";

import { Bot } from "lucide-react";
import { useState } from "react";
import type { AiConcierge } from "@/components/ai/ai-concierge";

type AiConciergeComponent = typeof AiConcierge;

export function LazyAiConcierge() {
  const [Concierge, setConcierge] = useState<AiConciergeComponent | null>(null);
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function activate() {
    setActivated(true);

    if (Concierge || loading) return;

    setLoading(true);
    const mod = await import("@/components/ai/ai-concierge");
    setConcierge(() => mod.AiConcierge);
    setLoading(false);
  }

  if (activated && Concierge) {
    return <Concierge defaultOpen />;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={activate}
        className="group relative grid size-16 place-items-center rounded-full bg-[#0193fd] text-white shadow-[0_24px_64px_rgb(1_147_253_/_0.34)] transition duration-300 hover:-translate-y-1 hover:bg-[#3f51f4] dark:bg-[#8bd5ff] dark:text-[#06111f] dark:shadow-[0_22px_80px_rgb(139_213_255_/_0.2)]"
        aria-label="Open AI concierge"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-white/40 opacity-0 transition duration-500 group-hover:scale-125 group-hover:opacity-70"
        />
        <Bot aria-hidden className={loading ? "size-6 animate-pulse" : "size-6"} />
      </button>
    </div>
  );
}
