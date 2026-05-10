"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="group relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-white/35 bg-white/12 text-white shadow-[0_10px_40px_rgb(0_0_0_/_0.12)] backdrop-blur-md transition duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <span className="absolute inset-1 rounded-full bg-white/0 transition group-hover:bg-white/10" />
      <Sun
        aria-hidden
        className="absolute size-4 rotate-0 scale-100 opacity-100 transition duration-300 dark:-rotate-90 dark:scale-50 dark:opacity-0"
      />
      <Moon
        aria-hidden
        className="absolute size-4 rotate-90 scale-50 opacity-0 transition duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
    </button>
  );
}
