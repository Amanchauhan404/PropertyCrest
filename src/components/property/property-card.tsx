"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  CalendarDays,
  CarFront,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
} from "lucide-react";
import type { Property } from "@/types/property";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { formatPropertyPrice, titleCase } from "@/lib/property-format";
import { SmartFillImage } from "@/components/ui/smart-image";

export function PropertyCard({
  property,
  featured = false,
}: {
  property: Property;
  featured?: boolean;
}) {
  const primaryImage = property.images[0] ?? "/assets/figma/hero-villa.png";
  const whatsappHref = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        `Hello, I am interested in ${property.title}.`,
      )}`
    : "/contact";
  const callHref = siteConfig.callNumber ? `tel:${siteConfig.callNumber}` : "/contact";

  return (
    <article
      className={cn(
        "scroll-reveal group relative overflow-hidden rounded-lg border border-black/8 bg-white shadow-[0_24px_90px_rgb(23_39_75_/_0.12)] transition duration-300 will-change-transform hover:-translate-y-1 dark:border-white/10 dark:bg-[#0d1320] dark:shadow-[0_28px_100px_rgb(0_0_0_/_0.42)]",
        featured ? "lg:row-span-2" : "",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_12%,rgb(1_147_253_/_0.13),transparent_34%)] opacity-0 transition duration-500 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_50%_10%,rgb(91_188_255_/_0.1),transparent_36%)] dark:group-hover:opacity-70"
      />

      <div
        className={cn(
          "relative overflow-hidden bg-[#eaf2ff]",
          featured ? "aspect-[1.16] lg:aspect-[1.08]" : "aspect-[4/3]",
        )}
      >
        <SmartFillImage
          src={primaryImage}
          alt={`${property.title} in ${property.location}`}
          sizes={
            featured
              ? "(max-width: 640px) 64vw, (max-width: 1024px) 48vw, 50vw"
              : "(max-width: 640px) 58vw, (max-width: 1024px) 42vw, 33vw"
          }
          className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06111f]/82 via-[#06111f]/12 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/92 px-3 py-1.5 font-ui text-[11px] font-semibold text-[#1557f2] shadow-[0_12px_28px_rgb(0_0_0_/_0.16)]">
            {property.purpose === "buy" ? "For Sale" : "For Rent"}
          </span>
          <span className="rounded-full border border-white/40 bg-white/14 px-3 py-1.5 font-ui text-[11px] font-semibold text-white backdrop-blur">
            {titleCase(property.type)}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="font-ui text-sm font-semibold text-white/72">
            {formatPropertyPrice(property)}
          </p>
          <h3 className="mt-1 font-display text-3xl font-semibold leading-none sm:text-4xl">
            {property.title}
          </h3>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/82">
            <MapPin aria-hidden className="size-4" />
            {property.location}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="grid grid-cols-4 gap-2 text-[#4e5a70] dark:text-white/70">
          {property.bhk ? (
            <Spec icon={<BedDouble className="size-4" />} label={`${property.bhk} BHK`} />
          ) : (
            <Spec icon={<Ruler className="size-4" />} label="Open" />
          )}
          {property.bathrooms ? (
            <Spec icon={<Bath className="size-4" />} label={`${property.bathrooms} Bath`} />
          ) : null}
          {property.parking ? (
            <Spec icon={<CarFront className="size-4" />} label={`${property.parking} Park`} />
          ) : null}
          <Spec
            icon={<Ruler className="size-4" />}
            label={`${property.areaSqFt?.toLocaleString("en-IN") ?? property.plotSizeSqFt?.toLocaleString("en-IN")} sq.ft`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {property.highlights.slice(0, 3).map((highlight) => (
            <span
              key={highlight}
              className="rounded-full bg-[#f1f6ff] px-3 py-1.5 text-xs font-medium text-[#44516a] dark:bg-white/7 dark:text-white/72"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <CardAction href={`/properties/${property.slug}`} label="View Details" icon={<ArrowUpRight className="size-4" />} primary />
          <CardAction href={`/book-site-visit?property=${property.slug}`} label="Schedule Visit" icon={<CalendarDays className="size-4" />} />
          <CardAction href={whatsappHref} label="WhatsApp" icon={<MessageCircle className="size-4" />} />
          <CardAction href={callHref} label="Call Agent" icon={<Phone className="size-4" />} />
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md bg-[#f7f9fd] px-2 text-center dark:bg-white/6">
      <span className="text-[#0193fd] dark:text-[#8bd5ff]">{icon}</span>
      <span className="font-ui text-[11px] font-semibold leading-tight">{label}</span>
    </div>
  );
}

function CardAction({
  href,
  label,
  icon,
  primary = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-3 font-ui text-[12px] font-semibold transition duration-300",
        primary
          ? "border-[#0193fd] bg-[#0193fd] text-white hover:bg-[#3f51f4]"
          : "border-[#dfe7f5] bg-white text-[#273248] hover:border-[#0193fd] hover:text-[#0193fd] dark:border-white/10 dark:bg-white/5 dark:text-white/76 dark:hover:border-[#8bd5ff] dark:hover:text-[#8bd5ff]",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
