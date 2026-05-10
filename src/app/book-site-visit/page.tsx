import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteVisitForm } from "@/components/forms/lead-forms";
import { getDefaultPropertyId, getPropertyOptions } from "@/lib/property-options";

export const metadata: Metadata = {
  title: "Book a Site Visit",
  description:
    "Schedule a private site visit for premium residential and commercial properties.",
};

type BookSiteVisitPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookSiteVisitPage({
  searchParams,
}: BookSiteVisitPageProps) {
  const params = await searchParams;
  const selectedProperty = readParam(params.property);
  const propertyOptions = await getPropertyOptions();
  const defaultPropertyId = await getDefaultPropertyId(selectedProperty);

  return (
    <main className="min-h-screen bg-white text-[#11131a] dark:bg-[#05070d] dark:text-white">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(118deg,#3f51f4_0%,#0193fd_100%)] px-5 pb-20 pt-32 dark:bg-[radial-gradient(ellipse_at_70%_20%,rgba(37,169,255,0.28),transparent_32%),linear-gradient(118deg,#0a1020_0%,#071d35_50%,#0b1225_100%)] sm:px-8 lg:px-12">
        <SiteHeader />
        <div className="absolute left-0 top-32 -z-10 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-ui text-sm font-semibold uppercase text-white/72">
              Private appointment
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl">
              Book a calm, guided site visit.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
              Choose your preferred property, date, and time. Our team will
              confirm the visit and prepare the right property details before
              you arrive.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:max-w-xl">
            <VisitSignal icon={<CalendarDays />} label="Date matched" />
            <VisitSignal icon={<Clock />} label="Time confirmed" />
            <VisitSignal icon={<ShieldCheck />} label="Verified visit" />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <SiteVisitForm
            propertyOptions={propertyOptions}
            defaultPropertyId={defaultPropertyId}
          />

          <aside className="space-y-5">
            <section className="rounded-lg border border-[#dbe7f5] bg-[#f8fbff] p-6 dark:border-white/10 dark:bg-white/6">
              <h2 className="font-display text-4xl font-semibold">
                What happens next
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-6 text-[#5f6b7d] dark:text-white/66">
                <VisitStep label="1" text="Your request is sent to the owner dashboard." />
                <VisitStep label="2" text="The team calls to confirm the timing and property." />
                <VisitStep label="3" text="You receive a guided visit with all key details ready." />
              </div>
            </section>

            <section className="rounded-lg border border-[#dbe7f5] bg-white p-6 dark:border-white/10 dark:bg-white/7">
              <h2 className="font-display text-4xl font-semibold">
                Visit preparation
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#5f6b7d] dark:text-white/66">
                Bring any budget, financing, or location preferences. We will
                use them to make the appointment sharper and faster.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-md bg-[#f1f6ff] px-4 py-3 text-sm font-semibold text-[#334056] dark:bg-black/20 dark:text-white/76">
                <MapPin aria-hidden className="size-5 text-[#0193fd]" />
                Exact location is shared after confirmation.
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function VisitSignal({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/12 p-4 text-white backdrop-blur-xl">
      <span className="text-white/82 [&>svg]:size-5">{icon}</span>
      <p className="mt-3 font-ui text-xs font-semibold uppercase">{label}</p>
    </div>
  );
}

function VisitStep({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0193fd] font-ui text-xs font-bold text-white">
        {label}
      </span>
      <p>{text}</p>
    </div>
  );
}
