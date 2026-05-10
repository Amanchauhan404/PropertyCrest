import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileMenu } from "@/components/layout/mobile-menu";

function CrestMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 18"
      className={cn("h-[18px] w-8", className)}
      fill="none"
    >
      <path
        d="M27.2 17.2H32L16 0 0 17.2h4.8L16 5.15l11.2 12.05ZM8 4.12V0H3.2v9.62L8 4.12Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header
      className="absolute inset-x-0 top-0 z-40 px-5 py-5 sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-white"
          aria-label="PropertyCrest home"
        >
          <CrestMark className="transition duration-300 group-hover:-translate-y-0.5" />
          <span className="font-ui text-[15px] font-bold italic">
            PropertyCrest
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-ui text-[13px] font-semibold text-white/92 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />
          <LuxuryButton href="/properties" variant="ghost" className="h-10 px-6">
            Get Started
          </LuxuryButton>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
