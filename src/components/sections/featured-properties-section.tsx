import Link from "next/link";
import { Building2, ChevronDown, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { ServerPropertyCard } from "@/components/property/server-property-card";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

const purposeOptions = [
  { label: "All", href: "/properties" },
  { label: "Buy", href: "/properties?purpose=buy" },
  { label: "Rent", href: "/properties?purpose=rent" },
];

export function FeaturedPropertiesSection({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <section
      id="featured-properties"
      className="relative isolate overflow-hidden bg-white px-5 py-24 text-[#11131a] dark:bg-[#05070d] dark:text-white sm:px-8 lg:px-12 lg:py-32"
    >
      <div
        aria-hidden
        className="feature-lines-drift pointer-events-none absolute inset-x-0 top-10 -z-10 h-[620px]"
      >
        <div className="absolute left-1/2 top-20 h-px w-[92vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#0193fd]/22 to-transparent" />
        <div className="absolute left-[7%] top-6 h-[520px] w-px rotate-[17deg] bg-gradient-to-b from-[#0193fd]/18 via-[#3f51f4]/8 to-transparent dark:from-[#8bd5ff]/14 dark:via-[#8b96ff]/8" />
        <div className="absolute right-[10%] top-0 h-[560px] w-px rotate-[-13deg] bg-gradient-to-b from-[#b89555]/22 via-[#0193fd]/8 to-transparent dark:from-[#d9b86d]/16 dark:via-[#8bd5ff]/7" />
      </div>

      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="scroll-reveal max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dbe8f6] bg-white/80 px-4 py-2 font-ui text-xs font-semibold text-[#3f51f4] shadow-[0_12px_36px_rgb(28_62_132_/_0.08)] backdrop-blur dark:border-white/10 dark:bg-white/6 dark:text-[#8bd5ff]">
              <Sparkles aria-hidden className="size-4" />
              Curated premium inventory
            </div>
            <h2 className="font-display text-5xl font-semibold leading-[0.98] text-[#11131a] dark:text-white sm:text-6xl lg:text-7xl">
              Featured Properties
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#697386] dark:text-white/64">
              A refined selection of verified homes, villas, and commercial
              spaces, staged for fast comparison and high-intent inquiries.
            </p>
          </div>

          <div className="scroll-reveal flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {purposeOptions.map((option, index) => (
                <FilterLink
                  key={option.href}
                  href={option.href}
                  active={index === 0}
                >
                  {option.label}
                </FilterLink>
              ))}
            </div>

            <form
              action="/properties"
              className="flex flex-col gap-3 rounded-lg border border-[#dce7f4] bg-white/82 p-3 shadow-[0_24px_80px_rgb(28_62_132_/_0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-white/7 sm:flex-row"
            >
              <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-md bg-[#f6f9fe] px-4 dark:bg-black/18">
                <Search aria-hidden className="size-4 text-[#0193fd]" />
                <span className="sr-only">Search properties</span>
                <input
                  name="q"
                  placeholder="Search location or property"
                  className="min-w-0 flex-1 bg-transparent font-ui text-sm text-[#1d2738] outline-none placeholder:text-[#8d98aa] dark:text-white dark:placeholder:text-white/40"
                />
              </label>

              <Link
                href="/properties"
                className="group flex h-12 min-w-[190px] items-center justify-between gap-3 rounded-md border border-[#dce7f4] bg-[#f6f9fe] px-4 font-ui text-sm font-semibold text-[#162033] outline-none transition duration-300 hover:border-[#0193fd]/70 hover:bg-white dark:border-white/10 dark:bg-black/18 dark:text-white dark:hover:border-[#8bd5ff]/50 dark:hover:bg-white/8"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="shrink-0 text-[#0193fd] dark:text-[#8bd5ff]">
                    <SlidersHorizontal aria-hidden className="size-4" />
                  </span>
                  <span>Property type</span>
                </span>
                <ChevronDown
                  aria-hidden
                  className="size-4 shrink-0 text-[#0193fd] dark:text-[#8bd5ff]"
                />
              </Link>
            </form>
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {properties.map((property, index) => (
            <ServerPropertyCard
              key={property.id}
              property={property}
              featured={index === 0 && properties.length > 2}
            />
          ))}
        </div>

        {properties.length === 0 ? (
          <div className="mt-12 flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-[#ccd8ea] bg-[#f8fbff] text-center dark:border-white/12 dark:bg-white/5">
            <Building2 aria-hidden className="size-8 text-[#0193fd]" />
            <p className="mt-4 font-display text-3xl font-semibold">
              No matching properties
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#697386] dark:text-white/60">
              Explore the full inventory page for live filters and comparison.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FilterLink({
  active,
  children,
  href,
}: {
  active: boolean;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center rounded-full border px-5 font-ui text-sm font-semibold transition duration-300",
        active
          ? "border-[#0193fd] bg-[#0193fd] text-white shadow-[0_16px_36px_rgb(1_147_253_/_0.22)]"
          : "border-[#dce7f4] bg-white/70 text-[#47566d] hover:border-[#0193fd] hover:text-[#0193fd] dark:border-white/10 dark:bg-white/6 dark:text-white/68 dark:hover:text-[#8bd5ff]",
      )}
    >
      {children}
    </Link>
  );
}
