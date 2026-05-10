import type { Metadata } from "next";
import {
  Building2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { ContactInquiryForm } from "@/components/forms/lead-forms";
import { SiteHeader } from "@/components/layout/site-header";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact PropertyCrest for premium property inquiries, callbacks, site visits, and agent support.",
};

export default function ContactPage() {
  const whatsappHref = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        "Hello, I am interested in premium properties.",
      )}`
    : "#";

  return (
    <main className="min-h-screen bg-white text-[#11131a] dark:bg-[#05070d] dark:text-white">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(118deg,#3f51f4_0%,#0193fd_100%)] px-5 pb-20 pt-32 dark:bg-[radial-gradient(ellipse_at_70%_20%,rgba(37,169,255,0.26),transparent_32%),linear-gradient(118deg,#0a1020_0%,#071d35_50%,#0b1225_100%)] sm:px-8 lg:px-12">
        <SiteHeader />
        <div className="absolute left-0 top-32 -z-10 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="font-ui text-sm font-semibold uppercase text-white/72">
              Concierge desk
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl">
              Speak with a property specialist.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
              For property inquiries, site visits, callbacks, and investment
              guidance, send a message or reach the team directly.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <LuxuryButton href="#contact-form" icon={<PhoneCall className="size-4" />}>
              Request Callback
            </LuxuryButton>
            <LuxuryButton
              href={whatsappHref}
              variant="ghost"
              icon={<MessageCircle className="size-4" />}
            >
              WhatsApp
            </LuxuryButton>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div id="contact-form">
            <ContactInquiryForm />
          </div>

          <aside className="space-y-5">
            <section className="rounded-lg border border-[#dbe7f5] bg-white p-6 dark:border-white/10 dark:bg-white/7">
              <h2 className="font-display text-4xl font-semibold">
                Office details
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-6 text-[#5f6b7d] dark:text-white/66">
                <ContactLine
                  icon={<Building2 />}
                  text={siteConfig.name}
                />
                <ContactLine
                  icon={<MapPin />}
                  text={
                    siteConfig.officeAddress ||
                    "Office address will be added during business setup."
                  }
                />
                <ContactLine
                  icon={<Clock3 />}
                  text="Mon - Sat, 10:00 AM - 7:00 PM"
                />
                <ContactLine
                  icon={<Mail />}
                  text="Admin email connects in the Brevo setup step."
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-[#dbe7f5] bg-[#f8fbff] dark:border-white/10 dark:bg-white/6">
              <div className="relative min-h-80">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#eef7ff_0%,#ffffff_52%,#f1f4ff_100%)] dark:bg-[linear-gradient(135deg,#07111f_0%,#0d1f36_54%,#121a2b_100%)]" />
                <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#0193fd]/28 to-transparent" />
                <div className="absolute left-1/2 top-8 h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#b89555]/32 to-transparent" />
                <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0193fd] text-white shadow-[0_20px_60px_rgb(1_147_253_/_0.28)]">
                  <MapPin aria-hidden className="size-7" />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ContactLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#0193fd] dark:text-[#8bd5ff] [&>svg]:size-5">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
