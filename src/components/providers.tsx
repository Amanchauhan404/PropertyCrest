"use client";

import { ThemeProvider } from "next-themes";
import { LazyAiConcierge } from "@/components/ai/lazy-ai-concierge";
import { LazyToaster } from "@/components/ui/lazy-toaster";
import { DesktopEffects } from "@/components/motion/desktop-effects";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableSystem={false}
    >
      {children}
      <DesktopEffects />
      <LazyAiConcierge />
      <LazyToaster />
    </ThemeProvider>
  );
}
