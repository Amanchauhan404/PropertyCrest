import type { Metadata } from "next";
import { Building2, CheckCircle2, Compass, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { LuxuryButton } from "@/components/ui/luxury-button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about PropertyCrest, a premium real estate advisory brand for curated residential and commercial properties.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#11131a] dark:bg-[#05070d] dark:text-white">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(118deg,#3f51f4_0%,#0193fd_100%)] px-5 pb-20 pt-32 dark:bg-[radial-gradient(ellipse_at_70%_20%,rgba(37,169,255,0.26),transparent_32%),linear-gradient(118deg,#0a1020_0%,#071d35_50%,#0b1225_100%)] sm:px-8 lg:px-12">
        <SiteHeader />
        <div className="mx-auto max-w-[1320px]">
          <p className="font-ui text-sm font-semibold uppercase text-white/72">
            About PropertyCrest
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl">
            Real estate guidance with calm luxury and clear judgment.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
            PropertyCrest curates premium residential and commercial properties
            with verified details, guided site visits, and fast owner-side lead
            handling.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="font-ui text-xs font-semibold uppercase text-[#0193fd] dark:text-[#8bd5ff]">
              Company story
            </p>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-none">
              Built for serious buyers, investors, and business owners.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#5f6b7d] dark:text-white/64">
              The platform is designed to make high-intent property discovery
              feel premium, efficient, and trustworthy. Every inquiry is routed
              to the owner dashboard, every visit can be tracked, and every
              customer touchpoint is shaped to feel consistent with the brand.
            </p>
            <LuxuryButton href="/book-site-visit" className="mt-7 bg-[#0193fd] text-white hover:bg-[#3f51f4]">
              Book Site Visit
            </LuxuryButton>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AboutSignal
              icon={<ShieldCheck />}
              title="Verified Approach"
              text="Listings, visit requests, and lead status are structured for owner review."
            />
            <AboutSignal
              icon={<Compass />}
              title="Prime Locations"
              text="Property discovery is centered around location quality and buyer intent."
            />
            <AboutSignal
              icon={<Building2 />}
              title="Residential + Commercial"
              text="The platform supports homes, villas, plots, retail, and business spaces."
            />
            <AboutSignal
              icon={<CheckCircle2 />}
              title="Conversion Ready"
              text="Callback, site visit, WhatsApp, call, and email flows are built into the journey."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function AboutSignal({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section className="rounded-lg border border-[#dbe7f5] bg-[#f8fbff] p-6 dark:border-white/10 dark:bg-white/7">
      <span className="text-[#0193fd] dark:text-[#8bd5ff] [&>svg]:size-6">
        {icon}
      </span>
      <h3 className="mt-5 font-display text-3xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#5f6b7d] dark:text-white/62">
        {text}
      </p>
    </section>
  );
}
