import { featuredProperties } from "@/data/properties";
import { getAllProperties } from "@/lib/property-data";
import type { PropertyOption } from "@/components/forms/lead-forms";

export async function getPropertyOptions(): Promise<PropertyOption[]> {
  const properties = await getAllProperties();

  return properties.map((property) => ({
    id: property.id,
    label: property.title,
    location: property.location,
  }));
}

export async function getDefaultPropertyId(slug?: string) {
  if (!slug) return "";
  const properties = await getAllProperties();

  return (
    properties.find((property) => property.slug === slug)?.id ??
    properties.find((property) => property.id === slug)?.id ??
    featuredProperties.find((property) => property.slug === slug)?.id ??
    featuredProperties.find((property) => property.id === slug)?.id ??
    ""
  );
}
