import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import {
  listAdminProperties,
  upsertPropertyFromFormData,
} from "@/lib/admin/properties";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

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
    const properties = await listAdminProperties(supabase);
    return NextResponse.json({ ok: true, properties });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: Request) {
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
    const property = await upsertPropertyFromFormData({
      supabase,
      formData: await request.formData(),
    });

    revalidatePropertyInventory(property.slug);

    return NextResponse.json({ ok: true, property }, { status: 201 });
  } catch (error) {
    return handleAdminError(error);
  }
}

function revalidatePropertyInventory(slug?: string) {
  revalidateTag("properties", "max");
  revalidatePath("/", "page");
  revalidatePath("/properties", "page");
  if (slug) revalidatePath(`/properties/${slug}`, "page");
}

function handleAdminError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { ok: false, message: "Please check the property fields.", issues: error.issues },
      { status: 400 },
    );
  }

  console.error("[admin:properties]", error);

  return NextResponse.json(
    { ok: false, message: error instanceof Error ? error.message : "Admin request failed." },
    { status: 500 },
  );
}
