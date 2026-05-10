import { siteConfig } from "@/config/site";
import type { Property } from "@/types/property";

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    telephone: siteConfig.callNumber || "+917000221580",
    address: siteConfig.officeAddress || undefined,
    areaServed: "India",
  };

  return <JsonLd data={jsonLd} />;
}

export function PropertyJsonLd({ property }: { property: Property }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: property.title,
    url: `${siteConfig.url}/properties/${property.slug}`,
    price: property.price,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Residence",
      name: property.title,
      address: property.address || property.location,
      floorSize: property.areaSqFt
        ? {
            "@type": "QuantitativeValue",
            value: property.areaSqFt,
            unitCode: "FTK",
          }
        : undefined,
      image: property.images,
    },
  };

  return <JsonLd data={jsonLd} />;
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
