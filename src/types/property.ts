export type PropertyPurpose = "buy" | "rent";

export type PropertyType =
  | "apartment"
  | "villa"
  | "plot"
  | "commercial"
  | "office"
  | "retail";

export type LeadStatus = "new" | "contacted" | "follow-up" | "closed";

export type Property = {
  id: string;
  slug: string;
  title: string;
  location: string;
  address?: string;
  price: number;
  purpose: PropertyPurpose;
  type: PropertyType;
  bhk?: number;
  bathrooms?: number;
  parking?: number;
  areaSqFt?: number;
  plotSizeSqFt?: number;
  highlights: string[];
  amenities: string[];
  featured: boolean;
  published: boolean;
  images: string[];
};
