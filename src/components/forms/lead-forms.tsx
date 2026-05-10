"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  PhoneCall,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { LuxurySelect } from "@/components/ui/luxury-select";
import { cn } from "@/lib/utils";
import {
  callbackLeadSchema,
  contactLeadSchema,
  siteVisitLeadSchema,
  type CallbackLeadInput,
  type ContactLeadInput,
  type SiteVisitLeadInput,
} from "@/lib/validation/leads";

export type PropertyOption = {
  id: string;
  label: string;
  location: string;
};

type LeadApiResponse = {
  ok: boolean;
  message: string;
  stored?: boolean;
};

const inputClass =
  "h-12 w-full rounded-md border border-[#dce7f4] bg-white px-4 font-ui text-sm text-[#162033] outline-none transition placeholder:text-[#8d98aa] focus:border-[#0193fd] focus:ring-4 focus:ring-[#0193fd]/12 dark:border-white/10 dark:bg-black/18 dark:text-white dark:placeholder:text-white/38";

const textareaClass =
  "min-h-28 w-full resize-none rounded-md border border-[#dce7f4] bg-white px-4 py-3 font-ui text-sm leading-6 text-[#162033] outline-none transition placeholder:text-[#8d98aa] focus:border-[#0193fd] focus:ring-4 focus:ring-[#0193fd]/12 dark:border-white/10 dark:bg-black/18 dark:text-white dark:placeholder:text-white/38";

const visitTimeOptions = [
  { value: "10:00 AM - 12:00 PM", label: "10:00 AM - 12:00 PM" },
  { value: "12:00 PM - 2:00 PM", label: "12:00 PM - 2:00 PM" },
  { value: "2:00 PM - 4:00 PM", label: "2:00 PM - 4:00 PM" },
  { value: "4:00 PM - 6:00 PM", label: "4:00 PM - 6:00 PM" },
];

const inquiryTypeOptions = [
  { value: "Property inquiry", label: "Property inquiry" },
  { value: "Site visit", label: "Site visit" },
  { value: "Investment guidance", label: "Investment guidance" },
  { value: "Commercial space", label: "Commercial space" },
];

export function QuickCallbackForm({
  propertyOptions,
  defaultPropertyId = "",
  className,
}: {
  propertyOptions: PropertyOption[];
  defaultPropertyId?: string;
  className?: string;
}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<CallbackLeadInput>({
    resolver: zodResolver(callbackLeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      selectedPropertyId: defaultPropertyId,
      message: "",
    },
  });

  async function onSubmit(values: CallbackLeadInput) {
    setSuccessMessage(null);
    const response = await submitLead("callback", values);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    setSuccessMessage("Thank you. Our team will contact you shortly.");
    toast.success("Thank you. Our team will contact you shortly.");
    form.reset({
      name: "",
      phone: "",
      email: "",
      selectedPropertyId: defaultPropertyId,
      message: "",
    });
  }

  return (
    <FormFrame
      className={className}
      eyebrow="Quick callback"
      title="Interested in this property?"
      description="We'll call you shortly."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldIcon icon={<UserRound aria-hidden className="size-4" />}>
          <input
            {...form.register("name")}
            className={inputClass}
            placeholder="Full name"
            autoComplete="name"
          />
        </FieldIcon>
        <FieldError message={form.formState.errors.name?.message} />

        <FieldIcon icon={<PhoneCall aria-hidden className="size-4" />}>
          <input
            {...form.register("phone")}
            className={inputClass}
            placeholder="Phone number"
            autoComplete="tel"
          />
        </FieldIcon>
        <FieldError message={form.formState.errors.phone?.message} />

        <FieldIcon icon={<Mail aria-hidden className="size-4" />}>
          <input
            {...form.register("email")}
            className={inputClass}
            placeholder="Email address"
            autoComplete="email"
          />
        </FieldIcon>
        <FieldError message={form.formState.errors.email?.message} />

        <Controller
          control={form.control}
          name="selectedPropertyId"
          render={({ field }) => (
            <LuxurySelect
              value={field.value || undefined}
              onValueChange={field.onChange}
              placeholder="Select property"
              options={propertyOptions.map((property) => ({
                value: property.id,
                label: `${property.label} - ${property.location}`,
              }))}
            />
          )}
        />
        <FieldError message={form.formState.errors.selectedPropertyId?.message} />

        <textarea
          {...form.register("message")}
          className={textareaClass}
          placeholder="Optional message"
        />
        <FieldError message={form.formState.errors.message?.message} />

        <SuccessNotice message={successMessage} />
        <SubmitButton
          loading={form.formState.isSubmitting}
          label="Get a Callback"
        />
      </form>
    </FormFrame>
  );
}

export function SiteVisitForm({
  propertyOptions,
  defaultPropertyId = "",
  className,
}: {
  propertyOptions: PropertyOption[];
  defaultPropertyId?: string;
  className?: string;
}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<SiteVisitLeadInput>({
    resolver: zodResolver(siteVisitLeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      selectedPropertyId: defaultPropertyId,
      preferredVisitDate: "",
      preferredVisitTime: "",
      message: "",
    },
  });

  const minDate = new Date().toISOString().slice(0, 10);

  async function onSubmit(values: SiteVisitLeadInput) {
    setSuccessMessage(null);
    const response = await submitLead("site_visit", values);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    setSuccessMessage(
      "Your visit request has been submitted. Our team will contact you shortly.",
    );
    toast.success(
      "Your visit request has been submitted. Our team will contact you shortly.",
    );
    form.reset({
      name: "",
      phone: "",
      email: "",
      selectedPropertyId: defaultPropertyId,
      preferredVisitDate: "",
      preferredVisitTime: "",
      message: "",
    });
  }

  return (
    <FormFrame
      className={className}
      eyebrow="Private appointment"
      title="Book a Site Visit"
      description="Share your preferred date and our team will confirm shortly."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldIcon icon={<UserRound aria-hidden className="size-4" />}>
              <input
                {...form.register("name")}
                className={inputClass}
                placeholder="Full name"
                autoComplete="name"
              />
            </FieldIcon>
            <FieldError message={form.formState.errors.name?.message} />
          </div>

          <div>
            <FieldIcon icon={<PhoneCall aria-hidden className="size-4" />}>
              <input
                {...form.register("phone")}
                className={inputClass}
                placeholder="Phone number"
                autoComplete="tel"
              />
            </FieldIcon>
            <FieldError message={form.formState.errors.phone?.message} />
          </div>
        </div>

        <FieldIcon icon={<Mail aria-hidden className="size-4" />}>
          <input
            {...form.register("email")}
            className={inputClass}
            placeholder="Email address"
            autoComplete="email"
          />
        </FieldIcon>
        <FieldError message={form.formState.errors.email?.message} />

        <Controller
          control={form.control}
          name="selectedPropertyId"
          render={({ field }) => (
            <LuxurySelect
              value={field.value || undefined}
              onValueChange={field.onChange}
              placeholder="Select property"
              options={propertyOptions.map((property) => ({
                value: property.id,
                label: `${property.label} - ${property.location}`,
              }))}
            />
          )}
        />
        <FieldError message={form.formState.errors.selectedPropertyId?.message} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldIcon icon={<CalendarDays aria-hidden className="size-4" />}>
              <input
                {...form.register("preferredVisitDate")}
                className={inputClass}
                type="date"
                min={minDate}
              />
            </FieldIcon>
            <FieldError
              message={form.formState.errors.preferredVisitDate?.message}
            />
          </div>

          <div>
            <Controller
              control={form.control}
              name="preferredVisitTime"
              render={({ field }) => (
                <LuxurySelect
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  placeholder="Preferred time"
                  options={visitTimeOptions}
                />
              )}
            />
            <FieldError
              message={form.formState.errors.preferredVisitTime?.message}
            />
          </div>
        </div>

        <textarea
          {...form.register("message")}
          className={textareaClass}
          placeholder="Message"
        />
        <FieldError message={form.formState.errors.message?.message} />

        <SuccessNotice message={successMessage} />
        <SubmitButton
          loading={form.formState.isSubmitting}
          label="Submit Visit Request"
        />
      </form>
    </FormFrame>
  );
}

export function ContactInquiryForm({ className }: { className?: string }) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<ContactLeadInput>({
    resolver: zodResolver(contactLeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      inquiryType: "Property inquiry",
      message: "",
    },
  });

  async function onSubmit(values: ContactLeadInput) {
    setSuccessMessage(null);
    const response = await submitLead("contact", values);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    setSuccessMessage("Thank you for contacting us. We will contact you shortly.");
    toast.success("Thank you for contacting us. We will contact you shortly.");
    form.reset({
      name: "",
      phone: "",
      email: "",
      inquiryType: "Property inquiry",
      message: "",
    });
  }

  return (
    <FormFrame
      className={className}
      eyebrow="Concierge desk"
      title="Contact PropertyCrest"
      description="Share your details and the right person will respond."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldIcon icon={<UserRound aria-hidden className="size-4" />}>
              <input
                {...form.register("name")}
                className={inputClass}
                placeholder="Full name"
                autoComplete="name"
              />
            </FieldIcon>
            <FieldError message={form.formState.errors.name?.message} />
          </div>

          <div>
            <FieldIcon icon={<PhoneCall aria-hidden className="size-4" />}>
              <input
                {...form.register("phone")}
                className={inputClass}
                placeholder="Phone number"
                autoComplete="tel"
              />
            </FieldIcon>
            <FieldError message={form.formState.errors.phone?.message} />
          </div>
        </div>

        <FieldIcon icon={<Mail aria-hidden className="size-4" />}>
          <input
            {...form.register("email")}
            className={inputClass}
            placeholder="Email address"
            autoComplete="email"
          />
        </FieldIcon>
        <FieldError message={form.formState.errors.email?.message} />

        <Controller
          control={form.control}
          name="inquiryType"
          render={({ field }) => (
            <LuxurySelect
              value={field.value || undefined}
              onValueChange={field.onChange}
              placeholder="Inquiry type"
              options={inquiryTypeOptions}
            />
          )}
        />

        <textarea
          {...form.register("message")}
          className={textareaClass}
          placeholder="How can we help? (optional)"
        />
        <FieldError message={form.formState.errors.message?.message} />

        <SuccessNotice message={successMessage} />
        <SubmitButton
          loading={form.formState.isSubmitting}
          label="Send Inquiry"
        />
      </form>
    </FormFrame>
  );
}

function FormFrame({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-[#dbe7f5] bg-white p-6 shadow-[0_24px_80px_rgb(28_62_132_/_0.12)] dark:border-white/10 dark:bg-white/7 dark:shadow-[0_28px_100px_rgb(0_0_0_/_0.34)]",
        className,
      )}
    >
      <div className="mb-6">
        <p className="font-ui text-xs font-semibold uppercase text-[#0193fd] dark:text-[#8bd5ff]">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold leading-none text-[#11131a] dark:text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#657187] dark:text-white/62">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function FieldIcon({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#0193fd] dark:text-[#8bd5ff]">
        {icon}
      </span>
      <div className="[&>input]:pl-11">{children}</div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 font-ui text-xs font-semibold text-[#b42318] dark:text-[#ffb4a8]">
      {message}
    </p>
  );
}

function SuccessNotice({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-md border border-[#c7ead8] bg-[#f0fbf5] px-4 py-3 text-sm leading-6 text-[#155c36] dark:border-[#8bd5ff]/18 dark:bg-[#8bd5ff]/8 dark:text-[#ccecff]">
      <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0193fd] px-6 font-ui text-sm font-semibold text-white shadow-[0_18px_42px_rgb(1_147_253_/_0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#3f51f4] disabled:pointer-events-none disabled:opacity-70 dark:bg-[#8bd5ff] dark:text-[#06111f] dark:hover:bg-white"
    >
      {loading ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <CheckCircle2 aria-hidden className="size-4" />
      )}
      {label}
    </button>
  );
}

async function submitLead(
  type: "callback" | "site_visit" | "contact",
  payload: CallbackLeadInput | SiteVisitLeadInput | ContactLeadInput,
): Promise<LeadApiResponse> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        payload,
        sourcePath: window.location.pathname,
      }),
    });

    const result = (await response.json()) as LeadApiResponse;

    if (!response.ok) {
      return {
        ok: false,
        message: result.message ?? "Please try again.",
      };
    }

    return result;
  } catch {
    return {
      ok: false,
      message: "Network error. Please call or WhatsApp us.",
    };
  }
}
