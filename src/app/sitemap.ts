import type { MetadataRoute } from "next";
import { getAllProperties } from "@/lib/property-data";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getAllProperties();
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/properties",
    "/book-site-visit",
    "/contact",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...properties.map((property) => ({
      url: `${siteConfig.url}/properties/${property.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: property.featured ? 0.9 : 0.75,
    })),
  ];
}
