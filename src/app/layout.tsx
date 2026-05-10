import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist_Mono,
  Montserrat,
  Raleway,
} from "next/font/google";
import { Providers } from "@/components/providers";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "PropertyCrest | Premium Real Estate",
    template: "%s | PropertyCrest",
  },
  description:
    "Premium residential and commercial properties in prime locations.",
  applicationName: "PropertyCrest",
  keywords: [
    "premium real estate",
    "luxury properties",
    "residential properties",
    "commercial properties",
    "site visit booking",
  ],
  openGraph: {
    title: "PropertyCrest | Premium Real Estate",
    description:
      "Premium residential and commercial properties in prime locations.",
    type: "website",
    locale: "en_IN",
    siteName: "PropertyCrest",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyCrest | Premium Real Estate",
    description:
      "Premium residential and commercial properties in prime locations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${raleway.variable} ${montserrat.variable} ${cormorant.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <LocalBusinessJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
