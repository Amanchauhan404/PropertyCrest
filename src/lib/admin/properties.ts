import type { SupabaseClient } from "@supabase/supabase-js";
import { mapPropertyRow } from "@/lib/property-data";
import {
  parseList,
  propertyFormSchema,
  slugify,
  type PropertyFormInput,
} from "@/lib/validation/properties";
import type { Property } from "@/types/property";

export async function listAdminProperties(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => mapPropertyRow(row));
}

export async function upsertPropertyFromFormData({
  supabase,
  formData,
  propertyId,
}: {
  supabase: SupabaseClient;
  formData: FormData;
  propertyId?: string;
}) {
  const parsed = propertyFormSchema.parse(Object.fromEntries(formData));
  const uploadedImages = await uploadPropertyImages(supabase, formData);
  const existingImages = parseExistingImages(parsed.existingImages);
  const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.title);
  const row = propertyInputToRow(parsed, slug, [
    ...existingImages,
    ...uploadedImages,
  ]);

  if (propertyId) {
    const { data, error } = await supabase
      .from("properties")
      .update(row)
      .eq("id", propertyId)
      .select("*")
      .single();

    if (error) throw error;
    return mapPropertyRow(data);
  }

  const { data, error } = await supabase
    .from("properties")
    .insert(row)
    .select("*")
    .single();

  if (error) throw error;
  return mapPropertyRow(data);
}

export async function deleteProperty(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
}

function propertyInputToRow(
  input: PropertyFormInput,
  slug: string,
  images: string[],
) {
  return {
    slug,
    title: input.title,
    location: input.location,
    address: input.address || null,
    price: input.price,
    purpose: input.purpose,
    type: input.type,
    bhk: normalizeNumber(input.bhk),
    bathrooms: normalizeNumber(input.bathrooms),
    parking: normalizeNumber(input.parking),
    area_sq_ft: normalizeNumber(input.areaSqFt),
    plot_size_sq_ft: normalizeNumber(input.plotSizeSqFt),
    highlights: parseList(input.highlights),
    amenities: parseList(input.amenities),
    images,
    featured: Boolean(input.featured),
    published: input.published !== false,
    updated_at: new Date().toISOString(),
  };
}

async function uploadPropertyImages(
  supabase: SupabaseClient,
  formData: FormData,
) {
  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (!files.length) return [];

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "property-images";
  await ensureBucket(supabase, bucket);

  const uploaded: string[] = [];

  for (const file of files) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `properties/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    uploaded.push(data.publicUrl);
  }

  return uploaded;
}

async function ensureBucket(supabase: SupabaseClient, bucket: string) {
  const { data } = await supabase.storage.getBucket(bucket);

  if (data) return;

  const { error } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw error;
  }
}

function parseExistingImages(value?: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function normalizeNumber(value: unknown) {
  if (value === "" || value === undefined || value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function propertyToAdminDefaults(property: Property) {
  return {
    ...property,
    areaSqFt: property.areaSqFt ?? "",
    plotSizeSqFt: property.plotSizeSqFt ?? "",
    bhk: property.bhk ?? "",
    bathrooms: property.bathrooms ?? "",
    parking: property.parking ?? "",
    highlights: property.highlights.join(", "),
    amenities: property.amenities.join(", "),
  };
}
