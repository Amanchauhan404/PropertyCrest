import { z } from "zod";

export const propertyFormSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(120),
  slug: z.string().trim().min(2).max(140).optional().or(z.literal("")),
  location: z.string().trim().min(2, "Location is required.").max(120),
  address: z.string().trim().max(240).optional().or(z.literal("")),
  price: z.coerce.number().int().min(0, "Price is required."),
  purpose: z.enum(["buy", "rent"]),
  type: z.enum(["apartment", "villa", "plot", "commercial", "office", "retail"]),
  bhk: z.coerce.number().int().min(0).optional().or(z.literal("")),
  bathrooms: z.coerce.number().int().min(0).optional().or(z.literal("")),
  parking: z.coerce.number().int().min(0).optional().or(z.literal("")),
  areaSqFt: z.coerce.number().int().min(0).optional().or(z.literal("")),
  plotSizeSqFt: z.coerce.number().int().min(0).optional().or(z.literal("")),
  highlights: z.string().trim().max(1000).optional().or(z.literal("")),
  amenities: z.string().trim().max(1000).optional().or(z.literal("")),
  existingImages: z.string().trim().optional().or(z.literal("")),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
});

export type PropertyFormInput = z.infer<typeof propertyFormSchema>;

export function parseList(value?: string | null) {
  if (!value) return [];

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
