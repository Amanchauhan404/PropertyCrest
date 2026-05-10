import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const statusSchema = z.object({
  table: z.enum(["callback_requests", "site_visit_bookings", "contact_inquiries"]),
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "follow-up", "closed"]),
});

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid status update." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from(parsed.data.table)
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id);

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
