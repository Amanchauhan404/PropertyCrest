"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(118deg,#3f51f4_0%,#0193fd_100%)] px-5 py-12 dark:bg-[radial-gradient(ellipse_at_70%_20%,rgba(37,169,255,0.24),transparent_32%),linear-gradient(118deg,#0a1020_0%,#071d35_50%,#0b1225_100%)]">
      <section className="w-full max-w-md rounded-lg border border-white/20 bg-white/94 p-7 shadow-[0_30px_100px_rgb(6_24_82_/_0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1220]/88">
        <p className="font-ui text-xs font-semibold uppercase text-[#0193fd] dark:text-[#8bd5ff]">
          Owner only
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-none text-[#11131a] dark:text-white">
          Admin Login
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#657187] dark:text-white/62">
          Sign in with the owner account to manage leads and properties.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="flex h-12 items-center gap-3 rounded-md border border-[#dce7f4] bg-white px-4 text-[#0193fd] dark:border-white/10 dark:bg-black/18 dark:text-[#8bd5ff]">
            <Mail aria-hidden className="size-4" />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Owner email"
              autoComplete="email"
              className="min-w-0 flex-1 bg-transparent font-ui text-sm text-[#162033] outline-none placeholder:text-[#8d98aa] dark:text-white"
            />
          </label>

          <label className="flex h-12 items-center gap-3 rounded-md border border-[#dce7f4] bg-white px-4 text-[#0193fd] dark:border-white/10 dark:bg-black/18 dark:text-[#8bd5ff]">
            <LockKeyhole aria-hidden className="size-4" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="min-w-0 flex-1 bg-transparent font-ui text-sm text-[#162033] outline-none placeholder:text-[#8d98aa] dark:text-white"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0193fd] px-6 font-ui text-sm font-semibold text-white shadow-[0_18px_42px_rgb(1_147_253_/_0.24)] transition hover:bg-[#3f51f4] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
