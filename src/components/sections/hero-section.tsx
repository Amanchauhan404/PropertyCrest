import Image from "next/image";
import {
  ArrowDown,
  CalendarDays,
  MapPin,
  MessageCircle,
  Play,
  Search,
} from "lucide-react";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hello, I am interested in premium properties.",
  )}`;

  return (
    <section className="hero-stage relative isolate min-h-[780px] overflow-hidden bg-[#f5f8fc] dark:bg-[#05070d] sm:min-h-[820px]">
      <SiteHeader />

      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[700px] bg-[linear-gradient(118deg,#3f51f4_0%,#0193fd_100%)] dark:bg-[radial-gradient(ellipse_at_72%_22%,rgba(37,169,255,0.34),transparent_33%),linear-gradient(118deg,#0a1020_0%,#071d35_48%,#0b1225_100%)] sm:h-[681px]"
      />

      <div className="hero-wave-drift absolute inset-x-0 top-0 h-[700px] overflow-visible sm:h-[681px]">
        <Image
          src="/assets/figma/hero-wave-back.svg"
          alt=""
          fill
          className="object-fill opacity-45 dark:opacity-25"
        />
        <Image
          src="/assets/figma/hero-wave-mid.svg"
          alt=""
          fill
          className="translate-y-5 object-fill opacity-80 dark:opacity-30"
        />
        <Image
          src="/assets/figma/hero-wave-front.svg"
          alt=""
          fill
          priority
          className="object-fill dark:opacity-80"
        />
      </div>

      <div
        aria-hidden
        className="hero-villa-layer pointer-events-none absolute inset-x-0 top-0 z-10 h-[700px] [mask-image:url('/assets/figma/hero-mask.svg')] [mask-position:center_top] [mask-repeat:no-repeat] [mask-size:138%_100%] sm:h-[681px] sm:[mask-size:100%_100%]"
      >
        <div className="hero-villa-float absolute right-[-58px] top-[272px] h-[320px] w-[min(112vw,520px)] sm:right-[-90px] sm:top-[96px] sm:h-[592px] sm:w-[min(78vw,1018px)] lg:right-[-92px]">
          <div className="absolute bottom-12 right-8 h-28 w-[72vw] rounded-full bg-[#061a36]/16 blur-2xl dark:bg-[#0193fd]/14 sm:hidden" />
          <Image
            src="/assets/figma/hero-villa.png"
            alt="Luxury modern villa"
            fill
            priority
            fetchPriority="high"
            quality={68}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 58vw, 78vw"
            className="object-contain object-center dark:brightness-[0.82] dark:contrast-[1.08] sm:object-right sm:drop-shadow-[0_34px_70px_rgb(15_34_84_/_0.28)] sm:dark:drop-shadow-[0_36px_110px_rgb(1_147_253_/_0.22)]"
          />
        </div>
      </div>

      <div className="relative z-20 mx-auto flex min-h-[780px] max-w-[1320px] flex-col justify-between px-5 pb-8 pt-32 sm:min-h-[820px] sm:px-8 lg:px-12 lg:pt-40">
        <div className="hero-copy-drift max-w-[560px]">
          <h1 className="font-ui text-5xl font-extrabold leading-[0.94] text-white sm:text-6xl lg:text-7xl">
            Find Your Dream Property
          </h1>
          <p className="mt-5 max-w-[480px] text-base leading-7 text-white/88 sm:text-lg">
            Premium residential and commercial properties in prime locations.
          </p>

          <form className="mt-8 flex h-12 max-w-[420px] items-center gap-3 rounded-full bg-white px-4 shadow-[0_18px_48px_rgb(19_47_123_/_0.18)] ring-1 ring-white/70 dark:bg-white/94">
            <MapPin aria-hidden className="size-4 text-[#0193fd]" />
            <label className="sr-only" htmlFor="hero-location-search">
              Search by location
            </label>
            <input
              id="hero-location-search"
              type="search"
              placeholder="Find a location"
              className="min-w-0 flex-1 bg-transparent font-ui text-[13px] font-medium italic text-[#2a3450] outline-none placeholder:text-[#a7b0bf]"
            />
            <button
              type="submit"
              aria-label="Search properties"
              className="inline-flex size-8 items-center justify-center rounded-full text-[#0193fd] transition hover:bg-[#eaf7ff]"
            >
              <Search aria-hidden className="size-4" />
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LuxuryButton href="/properties">Explore Properties</LuxuryButton>
            <LuxuryButton
              href="/book-site-visit"
              variant="ghost"
              icon={<CalendarDays aria-hidden className="size-4" />}
            >
              Book Site Visit
            </LuxuryButton>
            <LuxuryButton
              href={whatsappHref}
              variant="glass"
              icon={<MessageCircle aria-hidden className="size-4" />}
            >
              WhatsApp Inquiry
            </LuxuryButton>
          </div>
        </div>

        <div className="grid items-end gap-8 lg:grid-cols-[1fr_430px]">
          <div className="lux-fade-up hidden items-center gap-4 text-[#1b2333] dark:text-white/88 sm:flex">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#dff3ff] text-[#0193fd] shadow-[0_14px_32px_rgb(1_147_253_/_0.2)] dark:bg-white/10 dark:text-[#8bd5ff]">
              <Play aria-hidden className="ml-0.5 size-4 fill-current" />
            </span>
            <span>
              <span className="block font-ui text-xs font-semibold italic">
                Watch how <span className="text-[#0193fd]">Property</span>
                <span className="text-[#3f51f4] dark:text-[#8b96ff]">
                  Crest
                </span>{" "}
                works
              </span>
              <span className="mt-1 block text-[11px] text-[#828282] dark:text-white/50">
                Presented by PropertyCrest CEO
              </span>
            </span>
          </div>

          <div className="lux-fade-up ml-auto hidden max-w-[420px] text-right lg:absolute lg:right-12 lg:top-[430px] lg:block">
            <h2 className="font-ui text-3xl font-bold leading-[1.08] text-white drop-shadow-[0_8px_24px_rgb(5_24_82_/_0.22)]">
              Prime Locations.
              <span className="block text-white/88">
                Curated With Care
              </span>
            </h2>
            <p className="ml-auto mt-6 max-w-[360px] text-[13px] leading-6 text-white/78 drop-shadow-[0_8px_22px_rgb(5_24_82_/_0.18)]">
              Explore verified premium homes, plots, and commercial spaces with
              a guided team that keeps every site visit calm, clear, and
              decision-ready.
            </p>
            <LuxuryButton
              href="/about"
              variant="ghost"
              className="mt-6 h-10 px-7"
            >
              Learn More
            </LuxuryButton>
          </div>
        </div>
      </div>

      <a
        href="#featured-properties"
        aria-label="Scroll to featured properties"
        className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-[#3f51f4]/20 bg-white/80 px-4 py-2 font-ui text-[11px] font-semibold uppercase text-[#3f51f4] shadow-[0_10px_40px_rgb(45_76_160_/_0.12)] backdrop-blur md:flex dark:border-white/12 dark:bg-white/8 dark:text-white/72"
      >
        <ArrowDown aria-hidden className="size-3 animate-bounce" />
        Scroll
      </a>
    </section>
  );
}
