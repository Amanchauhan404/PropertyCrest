import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import {
  deleteProperty,
  upsertPropertyFromFormData,
} from "@/lib/admin/properties";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type PropertyRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: PropertyRouteProps) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { id } = await params;

  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase is not configured." },
      { status: 500 },
    );
  }

  try {
    const property = await upsertPropertyFromFormData({
      supabase,
      formData: await request.formData(),
      propertyId: id,
    });

    return NextResponse.json({ ok: true, property });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(request: Request, { params }: PropertyRouteProps) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { id } = await params;

  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase is not configured." },
      { status: 500 },
    );
  }

  try {
    await deleteProperty(supabase, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

function handleAdminError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { ok: false, message: "Please check the property fields.", issues: error.issues },
      { status: 400 },
    );
  }

  console.error("[admin:property]", error);

  return NextResponse.json(
    { ok: false, message: error instanceof Error ? error.message : "Admin request failed." },
    { status: 500 },
  );
}
