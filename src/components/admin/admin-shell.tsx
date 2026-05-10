"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, LayoutDashboard, LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminShell({
  children,
  title,
  eyebrow,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
}) {
  const router = useRouter();

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#11131a] dark:bg-[#05070d] dark:text-white">
      <header className="border-b border-[#dbe7f5] bg-white/86 px-5 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1220]/86 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-ui text-xs font-semibold uppercase text-[#0193fd] dark:text-[#8bd5ff]">
              {eyebrow}
            </p>
            <h1 className="mt-1 font-display text-4xl font-semibold leading-none">
              {title}
            </h1>
          </div>

          <nav className="flex flex-wrap gap-2">
            <AdminLink href="/admin" icon={<LayoutDashboard />}>
              Dashboard
            </AdminLink>
            <AdminLink href="/admin/properties" icon={<Building2 />}>
              Properties
            </AdminLink>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dce7f4] bg-white px-4 font-ui text-xs font-semibold text-[#334056] transition hover:border-[#0193fd] hover:text-[#0193fd] dark:border-white/10 dark:bg-white/6 dark:text-white/76"
            >
              <LogOut aria-hidden className="size-4" />
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <section className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1320px]">{children}</div>
      </section>
    </main>
  );
}

function AdminLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dce7f4] bg-white px-4 font-ui text-xs font-semibold text-[#334056] transition hover:border-[#0193fd] hover:text-[#0193fd] dark:border-white/10 dark:bg-white/6 dark:text-white/76 dark:hover:text-[#8bd5ff] [&>svg]:size-4"
    >
      {icon}
      {children}
    </Link>
  );
}
