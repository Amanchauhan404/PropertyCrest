import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CarFront,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickCallbackForm } from "@/components/forms/lead-forms";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { EmiCalculator } from "@/components/tools/emi-calculator";
import { PropertyJsonLd } from "@/components/seo/json-ld";
import { SmartFillImage } from "@/components/ui/smart-image";
import { siteConfig } from "@/config/site";
import { featuredProperties } from "@/data/properties";
import { getAllProperties, getPropertyBySlug } from "@/lib/property-data";
import { formatPropertyPrice, titleCase } from "@/lib/property-format";
import { getPropertyOptions } from "@/lib/property-options";
import { getPropertyMap } from "@/lib/map";

type PropertyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found" };
  }

  return {
    title: property.title,
    description: `${property.title} in ${property.location}. ${formatPropertyPrice(
      property,
    )}. Schedule a site visit with PropertyCrest.`,
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  const image = property.images[0] ?? "/assets/figma/hero-villa.png";
  const visitHref = `/book-site-visit?property=${property.slug}`;
  const whatsappHref = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        `Hello, I am interested in ${property.title}.`,
      )}`
    : "/contact";
  const callHref = siteConfig.callNumber ? `tel:${siteConfig.callNumber}` : "/contact";
  const propertyOptions = await getPropertyOptions();
  const properties = await getAllProperties();
  const propertyMap = getPropertyMap(property);

  return (
    <main className="min-h-screen bg-white text-[#11131a] dark:bg-[#05070d] dark:text-white">
      <PropertyJsonLd property={property} />
      <section className="relative isolate overflow-hidden bg-[linear-gradient(118deg,#3f51f4_0%,#0193fd_100%)] px-5 pb-16 pt-32 sm:px-8 lg:px-12">
        <SiteHeader />
        <div className="absolute -right-24 top-12 -z-10 size-[32rem] rounded-full bg-white/12 blur-3xl" />
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-ui text-sm font-semibold uppercase text-white/72">
              {titleCase(property.type)} · {property.purpose === "buy" ? "For Sale" : "For Rent"}
            </p>
            <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.95] text-white sm:text-7xl">
              {property.title}
            </h1>
            <p className="mt-5 flex items-center gap-2 text-lg text-white/80">
              <MapPin aria-hidden className="size-5" />
              {property.location}
            </p>
          </div>

          <div className="rounded-lg border border-white/18 bg-white/12 p-5 backdrop-blur-xl">
            <p className="font-ui text-sm font-semibold text-white/70">
              Starting from
            </p>
            <p className="mt-2 font-display text-5xl font-semibold text-white">
              {formatPropertyPrice(property)}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <LuxuryButton href={visitHref} icon={<CalendarDays className="size-4" />}>
                Schedule Site Visit
              </LuxuryButton>
              <LuxuryButton href={whatsappHref} variant="ghost" icon={<MessageCircle className="size-4" />}>
                WhatsApp Agent
              </LuxuryButton>
              <LuxuryButton href={callHref} variant="ghost" icon={<Phone className="size-4" />}>
                Call Agent
              </LuxuryButton>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-lg border border-[#dbe7f5] bg-[#07111f] shadow-[0_28px_90px_rgb(28_62_132_/_0.14)] dark:border-white/10">
            <div className="relative aspect-[16/10]">
              <SmartFillImage
                src={image}
                alt={`${property.title} gallery image`}
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-lg border border-[#dbe7f5] bg-white p-6 shadow-[0_22px_70px_rgb(28_62_132_/_0.1)] dark:border-white/10 dark:bg-white/7">
              <h2 className="font-display text-4xl font-semibold">Property Overview</h2>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {property.bhk ? <DetailSpec icon={<BedDouble />} label={`${property.bhk} BHK`} /> : null}
                {property.bathrooms ? <DetailSpec icon={<Bath />} label={`${property.bathrooms} Bathrooms`} /> : null}
                {property.parking ? <DetailSpec icon={<CarFront />} label={`${property.parking} Parking`} /> : null}
                <DetailSpec icon={<Ruler />} label={`${property.areaSqFt?.toLocaleString("en-IN") ?? property.plotSizeSqFt?.toLocaleString("en-IN")} sq.ft`} />
              </div>
            </div>

            <div className="rounded-lg border border-[#dbe7f5] bg-white p-6 dark:border-white/10 dark:bg-white/7">
              <h2 className="font-display text-4xl font-semibold">Trust Signals</h2>
              <div className="mt-5 space-y-3 text-sm text-[#5f6b7d] dark:text-white/66">
                <TrustLine icon={<ShieldCheck />} text="Verified listing and owner details" />
                <TrustLine icon={<CheckCircle2 />} text="RERA/license section ready for project data" />
                <TrustLine icon={<Building2 />} text="Site visit coordination by PropertyCrest team" />
              </div>
            </div>

            <QuickCallbackForm
              propertyOptions={propertyOptions}
              defaultPropertyId={property.id}
            />
          </aside>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1320px] gap-8 lg:grid-cols-3">
          <InfoPanel title="Highlights" items={property.highlights} />
          <InfoPanel title="Amenities" items={property.amenities} />
          <InfoPanel
            title="Nearby Places"
            items={["Metro corridor", "Premium schools", "Healthcare hub", "Retail high street"]}
          />
        </div>

        <div className="mx-auto mt-12 max-w-[1320px]">
          <EmiCalculator
            properties={properties.length ? properties : featuredProperties}
            defaultPropertyId={property.id}
            title={`${property.title} EMI Calculator`}
          />
        </div>

        <div className="mx-auto mt-12 max-w-[1320px] overflow-hidden rounded-lg border border-[#dbe7f5] bg-[#f7fbff] p-6 dark:border-white/10 dark:bg-white/6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-4xl font-semibold">Location Map</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6b7d] dark:text-white/62">
                Approximate private-site marker for {property.title}. Exact
                location is shared after visit confirmation.
              </p>
              <p className="mt-3 flex items-center gap-2 font-ui text-sm font-semibold text-[#334056] dark:text-white/76">
                <MapPin aria-hidden className="size-4 text-[#0193fd]" />
                {propertyMap.displayAddress}
              </p>
            </div>
            <LuxuryButton href={propertyMap.directionsUrl} variant="outline">
              Open In Maps
            </LuxuryButton>
          </div>
          <div className="mt-6 overflow-hidden rounded-lg border border-[#dbe7f5] bg-white shadow-[0_24px_70px_rgb(28_62_132_/_0.1)] dark:border-white/10 dark:bg-[#07111f]">
            <iframe
              title={`${property.title} location map`}
              src={propertyMap.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0 grayscale-[0.1] dark:brightness-[0.76] dark:contrast-[1.12] sm:h-[440px]"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DetailSpec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-h-20 flex-col justify-center rounded-md bg-[#f6f9fe] p-4 dark:bg-black/18">
      <span className="text-[#0193fd] [&>svg]:size-5">{icon}</span>
      <span className="mt-2 font-ui text-sm font-semibold text-[#334056] dark:text-white/76">
        {label}
      </span>
    </div>
  );
}

function TrustLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#0193fd] [&>svg]:size-5">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[#dbe7f5] bg-white p-6 dark:border-white/10 dark:bg-white/7">
      <h2 className="font-display text-4xl font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-[#5f6b7d] dark:text-white/66">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <CheckCircle2 aria-hidden className="size-5 text-[#0193fd]" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
