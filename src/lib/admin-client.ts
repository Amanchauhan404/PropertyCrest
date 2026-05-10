"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export async function getAdminAccessToken() {
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function adminFetch<T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const token = await getAdminAccessToken();

  if (!token) {
    throw new Error("Please sign in again.");
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  const result = (await response.json()) as T & { ok?: boolean; message?: string };

  if (!response.ok || result.ok === false) {
    throw new Error(result.message ?? "Admin request failed.");
  }

  return result;
}
