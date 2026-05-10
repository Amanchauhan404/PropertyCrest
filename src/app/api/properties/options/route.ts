import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/property-data";

export const runtime = "nodejs";

export async function GET() {
  const properties = await getAllProperties();

  return NextResponse.json({
    ok: true,
    properties: properties.map((property) => ({
      id: property.id,
      slug: property.slug,
      label: property.title,
      location: property.location,
      price: property.price,
      purpose: property.purpose,
      type: property.type,
    })),
  });
}
