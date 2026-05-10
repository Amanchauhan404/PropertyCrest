import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertiesExplorer } from "@/components/property/properties-explorer";
import { EmiCalculator } from "@/components/tools/emi-calculator";
import { getAllProperties } from "@/lib/property-data";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Explore premium residential and commercial properties in prime locations.",
};

export const revalidate = 60;

export default async function PropertiesPage() {
  const properties = await getAllProperties();

  return (
    <main className="min-h-screen bg-white text-[#11131a] dark:bg-[#05070d] dark:text-white">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(118deg,#3f51f4_0%,#0193fd_100%)] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <SiteHeader />
        <div className="absolute -right-24 top-16 -z-10 size-96 rounded-full bg-white/12 blur-3xl" />
        <div className="mx-auto max-w-[1320px]">
          <p className="font-ui text-sm font-semibold uppercase text-white/72">
            Verified premium inventory
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl">
            Find the property that fits your next move.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
            Search curated residential and commercial spaces with clear pricing,
            visit-ready details, and fast agent support.
          </p>
        </div>
      </section>

      <section className="relative -mt-12 px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1320px] space-y-12">
          <PropertiesExplorer properties={properties} />
          <EmiCalculator
            properties={properties}
            title="Compare EMI Across Properties"
          />
        </div>
      </section>
    </main>
  );
}
