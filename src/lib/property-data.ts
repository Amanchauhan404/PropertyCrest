import { featuredProperties } from "@/data/properties";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Property } from "@/types/property";

type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  location: string;
  address: string | null;
  price: number;
  purpose: Property["purpose"];
  type: Property["type"];
  bhk: number | null;
  bathrooms: number | null;
  parking: number | null;
  area_sq_ft: number | null;
  plot_size_sq_ft: number | null;
  highlights: string[] | null;
  amenities: string[] | null;
  featured: boolean | null;
  images: string[] | null;
  published: boolean | null;
};

export async function getAllProperties() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) return featuredProperties;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return featuredProperties;
  }

  return data.map(mapPropertyRow);
}

export async function getPropertyBySlug(slug: string) {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (!error && data) return mapPropertyRow(data as PropertyRow);
  }

  return featuredProperties.find((property) => property.slug === slug);
}

export function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    address: row.address ?? undefined,
    price: row.price,
    purpose: row.purpose,
    type: row.type,
    bhk: row.bhk ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    parking: row.parking ?? undefined,
    areaSqFt: row.area_sq_ft ?? undefined,
    plotSizeSqFt: row.plot_size_sq_ft ?? undefined,
    highlights: row.highlights ?? [],
    amenities: row.amenities ?? [],
    featured: Boolean(row.featured),
    published: row.published !== false,
    images: row.images ?? [],
  };
}
