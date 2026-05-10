import { featuredProperties } from "@/data/properties";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LeadRequestInput } from "@/lib/validation/leads";

type PersistLeadResult = {
  stored: boolean;
};

type LeadContext = {
  sourcePath?: string;
};

export async function persistLead(
  request: LeadRequestInput,
  context: LeadContext = {},
): Promise<PersistLeadResult> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Supabase lead storage is not configured.");
    }

    console.info("[lead:not-persisted]", {
      type: request.type,
      payload: request.payload,
      sourcePath: context.sourcePath,
    });

    return { stored: false };
  }

  const { table, row } = mapLeadToTableRow(request, context);
  const { error } = await supabase.from(table).insert(row);

  if (error) {
    throw new Error(`Supabase lead insert failed: ${error.message}`);
  }

  return { stored: true };
}

function mapLeadToTableRow(
  request: LeadRequestInput,
  context: LeadContext,
): { table: string; row: Record<string, unknown> } {
  const sourcePath = context.sourcePath ?? request.sourcePath ?? null;
  const createdAt = new Date().toISOString();

  if (request.type === "callback") {
    const property = findProperty(request.payload.selectedPropertyId);

    return {
      table: "callback_requests",
      row: {
        full_name: request.payload.name,
        phone: request.payload.phone,
        email: request.payload.email,
        selected_property_id: property?.id ?? request.payload.selectedPropertyId ?? null,
        selected_property_title: property?.title ?? null,
        message: request.payload.message || null,
        status: "new",
        source_path: sourcePath,
        created_at: createdAt,
      },
    };
  }

  if (request.type === "site_visit") {
    const property = findProperty(request.payload.selectedPropertyId);

    return {
      table: "site_visit_bookings",
      row: {
        full_name: request.payload.name,
        phone: request.payload.phone,
        email: request.payload.email,
        selected_property_id: property?.id ?? request.payload.selectedPropertyId,
        selected_property_title: property?.title ?? null,
        preferred_visit_date: request.payload.preferredVisitDate,
        preferred_visit_time: request.payload.preferredVisitTime,
        message: request.payload.message || null,
        status: "new",
        source_path: sourcePath,
        created_at: createdAt,
      },
    };
  }

  return {
    table: "contact_inquiries",
    row: {
      full_name: request.payload.name,
      phone: request.payload.phone,
      email: request.payload.email || null,
      inquiry_type: request.payload.inquiryType || null,
      message: request.payload.message || "",
      status: "new",
      source_path: sourcePath,
      created_at: createdAt,
    },
  };
}

function findProperty(propertyId?: string) {
  if (!propertyId) return null;
  return featuredProperties.find((property) => property.id === propertyId) ?? null;
}
