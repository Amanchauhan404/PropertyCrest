import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const leadTables = [
  "callback_requests",
  "site_visit_bookings",
  "contact_inquiries",
] as const;

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase is not configured." },
      { status: 500 },
    );
  }

  try {
    const [callbacks, siteVisits, contacts] = await Promise.all(
      leadTables.map((table) =>
        supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
      ),
    );

    for (const result of [callbacks, siteVisits, contacts]) {
      if (result.error) throw result.error;
    }

    return NextResponse.json({
      ok: true,
      leads: {
        callbacks: callbacks.data ?? [],
        siteVisits: siteVisits.data ?? [],
        contacts: contacts.data ?? [],
      },
    });
  } catch (error) {
    console.error("[admin:leads]", error);

    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not load leads." },
      { status: 500 },
    );
  }
}
