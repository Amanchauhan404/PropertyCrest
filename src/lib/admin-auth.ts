import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type AdminUser = {
  id: string;
  email: string;
};

export async function requireAdmin(request: Request) {
  const supabase = getSupabaseAdminClient();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!supabase || !token || !adminEmail) {
    return {
      user: null,
      response: NextResponse.json(
        { ok: false, message: "Admin authentication is not configured." },
        { status: 401 },
      ),
    };
  }

  const { data, error } = await supabase.auth.getUser(token);
  const email = data.user?.email;

  if (error || !data.user || email !== adminEmail) {
    return {
      user: null,
      response: NextResponse.json(
        { ok: false, message: "Owner access only." },
        { status: 403 },
      ),
    };
  }

  return {
    user: { id: data.user.id, email } satisfies AdminUser,
    response: null,
  };
}
