"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CalendarDays, MessageSquare, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { LuxurySelect } from "@/components/ui/luxury-select";
import { adminFetch } from "@/lib/admin-client";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type Lead = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  selected_property_title?: string;
  message?: string;
  status: "new" | "contacted" | "follow-up" | "closed";
  created_at: string;
};

type LeadsResponse = {
  ok: boolean;
  leads: {
    callbacks: Lead[];
    siteVisits: Lead[];
    contacts: Lead[];
  };
};

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow-up", label: "Follow-up" },
  { value: "closed", label: "Closed" },
];

export function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadsResponse["leads"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin/login");
        return;
      }

      loadLeads();
    });
  }, [router]);

  async function loadLeads() {
    try {
      const result = await adminFetch<LeadsResponse>("/api/admin/leads");
      setLeads(result.leads);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load leads.");
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const callbacks = leads?.callbacks.length ?? 0;
    const visits = leads?.siteVisits.length ?? 0;
    const contacts = leads?.contacts.length ?? 0;

    return { callbacks, visits, contacts, total: callbacks + visits + contacts };
  }, [leads]);

  return (
    <AdminShell title="Owner Dashboard" eyebrow="PropertyCrest admin">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={<PhoneCall />} label="Callbacks" value={stats.callbacks} />
        <Stat icon={<CalendarDays />} label="Site Visits" value={stats.visits} />
        <Stat icon={<MessageSquare />} label="Inquiries" value={stats.contacts} />
        <Stat icon={<Building2 />} label="Total Leads" value={stats.total} />
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          href="/admin/properties"
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#0193fd] px-5 font-ui text-sm font-semibold text-white shadow-[0_18px_42px_rgb(1_147_253_/_0.22)] transition hover:bg-[#3f51f4]"
        >
          Manage Properties
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-[#657187] dark:text-white/62">
          Loading leads...
        </p>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <LeadPanel
            title="Callback Requests"
            table="callback_requests"
            leads={leads?.callbacks ?? []}
            onStatusChange={loadLeads}
          />
          <LeadPanel
            title="Site Visits"
            table="site_visit_bookings"
            leads={leads?.siteVisits ?? []}
            onStatusChange={loadLeads}
          />
          <LeadPanel
            title="Contact Inquiries"
            table="contact_inquiries"
            leads={leads?.contacts ?? []}
            onStatusChange={loadLeads}
          />
        </div>
      )}
    </AdminShell>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <section className="rounded-lg border border-[#dbe7f5] bg-white p-5 dark:border-white/10 dark:bg-white/7">
      <span className="text-[#0193fd] dark:text-[#8bd5ff] [&>svg]:size-5">
        {icon}
      </span>
      <p className="mt-5 font-display text-4xl font-semibold">{value}</p>
      <p className="mt-1 font-ui text-xs font-semibold uppercase text-[#657187] dark:text-white/54">
        {label}
      </p>
    </section>
  );
}

function LeadPanel({
  title,
  table,
  leads,
  onStatusChange,
}: {
  title: string;
  table: "callback_requests" | "site_visit_bookings" | "contact_inquiries";
  leads: Lead[];
  onStatusChange: () => void;
}) {
  async function updateStatus(id: string, status: string) {
    try {
      await adminFetch("/api/admin/leads/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id, status }),
      });
      toast.success("Lead status updated.");
      onStatusChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update status.");
    }
  }

  return (
    <section className="rounded-lg border border-[#dbe7f5] bg-white p-5 dark:border-white/10 dark:bg-white/7">
      <h2 className="font-display text-3xl font-semibold">{title}</h2>
      <div className="mt-5 space-y-4">
        {leads.length ? (
          leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-md border border-[#e4edf7] bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-black/16"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-ui text-sm font-bold">{lead.full_name}</p>
                  <p className="mt-1 text-xs text-[#657187] dark:text-white/56">
                    {lead.phone} {lead.email ? `· ${lead.email}` : ""}
                  </p>
                </div>
                <LuxurySelect
                  value={lead.status}
                  onValueChange={(value) => updateStatus(lead.id, value)}
                  options={statusOptions}
                  placeholder="Status"
                  className="h-9 min-w-32 text-xs"
                />
              </div>
              {lead.selected_property_title ? (
                <p className="mt-3 text-xs font-semibold text-[#0193fd]">
                  {lead.selected_property_title}
                </p>
              ) : null}
              {lead.message ? (
                <p className="mt-3 text-sm leading-6 text-[#5f6b7d] dark:text-white/62">
                  {lead.message}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <p className="text-sm text-[#657187] dark:text-white/58">
            No leads yet.
          </p>
        )}
      </div>
    </section>
  );
}
