"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Home, Info, Menu, MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const iconByHref = {
  "/": Home,
  "/properties": Building2,
  "/about": Info,
  "/contact": MessageCircle,
} as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/12 text-white shadow-[0_12px_34px_rgb(0_0_0_/_0.12)] backdrop-blur-md transition duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {open ? (
          <X aria-hidden className="size-4" />
        ) : (
          <Menu aria-hidden className="size-4" />
        )}
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 transition duration-300",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-[#04101f]/48 backdrop-blur-[10px] transition-opacity duration-300 dark:bg-black/62",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <aside
          id="mobile-navigation"
          className={cn(
            "absolute right-3 top-3 w-[min(calc(100vw-24px),390px)] overflow-hidden rounded-lg border border-white/35 bg-white/94 text-[#121927] shadow-[0_30px_100px_rgb(4_16_34_/_0.32)] backdrop-blur-2xl transition duration-300 ease-out dark:border-white/12 dark:bg-[#07101e]/94 dark:text-white",
            open
              ? "translate-x-0 opacity-100"
              : "translate-x-6 opacity-0",
          )}
        >
          <div className="flex items-center justify-between border-b border-[#dbe7f5] px-5 py-4 dark:border-white/10">
            <div>
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.28em] text-[#0193fd]">
                Menu
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                PropertyCrest
              </p>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-[#dbe7f5] bg-white text-[#1c2740] transition hover:border-[#0193fd] hover:text-[#0193fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0193fd] dark:border-white/12 dark:bg-white/8 dark:text-white"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="p-3">
            {siteConfig.nav.map((item, index) => {
              const Icon = iconByHref[item.href] ?? Building2;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex min-h-14 items-center gap-3 rounded-md px-3 font-ui text-[15px] font-semibold text-[#273248] transition duration-300 hover:bg-[#eef7ff] hover:text-[#0193fd] dark:text-white/82 dark:hover:bg-white/8 dark:hover:text-[#8bd5ff]"
                  style={{
                    transitionDelay: open ? `${index * 35}ms` : "0ms",
                  }}
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#eaf7ff] text-[#0193fd] transition group-hover:scale-105 dark:bg-white/8 dark:text-[#8bd5ff]">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-[#dbe7f5] p-5 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-[#6d788c] dark:text-white/52">
                Theme
              </span>
              <ThemeToggle />
            </div>
            <Link
              href="/properties"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0193fd] px-6 font-ui text-[13px] font-semibold text-white shadow-[0_18px_44px_rgb(1_147_253_/_0.24)] transition duration-300 hover:bg-[#3f51f4]"
            >
              Explore Properties
            </Link>
            <Link
              href="/book-site-visit"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#3f51f4] px-6 font-ui text-[13px] font-semibold text-[#3f51f4] transition duration-300 hover:bg-[#3f51f4] hover:text-white dark:border-[#8bcfff]/70 dark:text-[#8bcfff] dark:hover:bg-[#8bcfff] dark:hover:text-[#07111f]"
            >
              Book Site Visit
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
