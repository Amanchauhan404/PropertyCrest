"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Home,
  Loader2,
  Mail,
  PhoneCall,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { LuxurySelect } from "@/components/ui/luxury-select";
import { cn } from "@/lib/utils";

type ChatRole = "assistant" | "user";
type LeadMode = "callback" | "site_visit" | "contact";
type ChatAction = "none" | LeadMode | "whatsapp";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  action?: ChatAction;
  propertySlug?: string | null;
  propertyTitle?: string | null;
};

type PropertyOption = {
  id: string;
  slug: string;
  label: string;
  location: string;
  purpose: "buy" | "rent";
  type: string;
};

type ChatApiResponse = {
  reply: string;
  action: ChatAction;
  propertySlug: string | null;
  propertyTitle: string | null;
};

type PropertyOptionsResponse = {
  ok: boolean;
  properties: PropertyOption[];
};

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Welcome to PropertyCrest. I can help you find properties, answer in English or Hindi, book a private site visit, or request a callback.",
    action: "none",
  },
];

const visitTimeOptions = [
  { value: "10:00 AM - 12:00 PM", label: "10:00 AM - 12:00 PM" },
  { value: "12:00 PM - 2:00 PM", label: "12:00 PM - 2:00 PM" },
  { value: "2:00 PM - 4:00 PM", label: "2:00 PM - 4:00 PM" },
  { value: "4:00 PM - 6:00 PM", label: "4:00 PM - 6:00 PM" },
];

export function AiConcierge({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadMode, setLeadMode] = useState<LeadMode | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/properties/options")
      .then((response) => response.json())
      .then((result: PropertyOptionsResponse) => {
        if (result.ok) setProperties(result.properties);
      })
      .catch(() => {
        setProperties([]);
      });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, leadMode, loading]);

  const propertySelectOptions = useMemo(
    () =>
      properties.map((property) => ({
        value: property.id,
        label: `${property.label} - ${property.location}`,
      })),
    [properties],
  );

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPath: window.location.pathname,
          messages: nextMessages
            .slice(-10)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      const result = (await response.json()) as ChatApiResponse;
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.reply,
        action: result.action,
        propertySlug: result.propertySlug,
        propertyTitle: result.propertyTitle,
      };

      setMessages((current) => [...current, assistantMessage]);

      if (result.action === "callback" || result.action === "site_visit" || result.action === "contact") {
        openLeadForm(result.action, result.propertySlug);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I could not reach the AI service right now, but I can still help you request a callback or book a site visit.",
          action: "callback",
        },
      ]);
      setLeadMode("callback");
    } finally {
      setLoading(false);
    }
  }

  function openLeadForm(mode: LeadMode, propertySlug?: string | null) {
    const property = propertySlug
      ? properties.find((item) => item.slug === propertySlug)
      : null;

    if (property) {
      setSelectedPropertyId(property.id);
    }

    setLeadMode(mode);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <div
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        onWheelCapture={(event) => event.stopPropagation()}
        onTouchMoveCapture={(event) => event.stopPropagation()}
        className={cn(
          "ai-concierge-panel w-[calc(100vw-40px)] max-w-[430px] origin-bottom-right overflow-hidden overscroll-contain rounded-lg border border-[#dbe7f5] bg-white/96 font-ui shadow-[0_28px_100px_rgb(16_35_75_/_0.24)] backdrop-blur-2xl transition duration-300 dark:border-white/10 dark:bg-[#07111f]/96 dark:shadow-[0_32px_120px_rgb(0_0_0_/_0.54)]",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-[0.98] opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="relative overflow-hidden border-b border-[#dbe7f5] bg-[#f7fbff] px-4 py-4 dark:border-white/10 dark:bg-white/6">
          <div
            aria-hidden
            className="absolute right-8 top-0 size-28 rounded-full bg-[#0193fd]/14 blur-3xl dark:bg-[#8bd5ff]/14"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-[#0193fd] text-white shadow-[0_18px_44px_rgb(1_147_253_/_0.28)] dark:bg-[#8bd5ff] dark:text-[#06111f]">
                <Sparkles aria-hidden className="size-5" />
              </span>
              <div>
                <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[#0193fd] dark:text-[#8bd5ff]">
                  AI Concierge
                </p>
                <h2 className="font-display text-2xl font-semibold leading-none text-[#11131a] dark:text-white">
                  PropertyCrest
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-9 place-items-center rounded-full border border-[#dce7f4] bg-white text-[#334056] transition hover:border-[#0193fd] hover:text-[#0193fd] dark:border-white/10 dark:bg-white/8 dark:text-white/76"
              aria-label="Close AI concierge"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheelCapture={(event) => event.stopPropagation()}
          onTouchMoveCapture={(event) => event.stopPropagation()}
          className="chatbot-scroll max-h-[56vh] space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
        >
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {loading ? (
            <div className="chat-message flex items-center gap-2 rounded-lg bg-[#f2f7ff] px-4 py-3 text-[13px] font-semibold text-[#50607a] dark:bg-white/7 dark:text-white/68">
              <Loader2 aria-hidden className="size-4 animate-spin text-[#0193fd] dark:text-[#8bd5ff]" />
              Thinking like a property advisor...
            </div>
          ) : null}

          {leadMode ? (
            <ChatLeadForm
              mode={leadMode}
              properties={properties}
              propertySelectOptions={propertySelectOptions}
              selectedPropertyId={selectedPropertyId}
              onSelectedPropertyChange={setSelectedPropertyId}
              onClose={() => setLeadMode(null)}
              onSubmitted={(message) => {
                setLeadMode(null);
                setMessages((current) => [
                  ...current,
                  {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: message,
                    action: "none",
                  },
                ]);
              }}
            />
          ) : null}
        </div>

        <div className="border-t border-[#dbe7f5] px-4 py-4 dark:border-white/10">
          <form
            className="flex items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
              rows={1}
              placeholder="Ask in English or Hindi..."
              className="max-h-24 min-h-12 flex-1 resize-none rounded-lg border border-[#dce7f4] bg-white px-4 py-3 font-ui text-sm leading-6 text-[#162033] outline-none transition placeholder:text-[#8d98aa] focus:border-[#0193fd] focus:ring-4 focus:ring-[#0193fd]/12 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/38"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid size-12 shrink-0 place-items-center rounded-full bg-[#0193fd] text-white shadow-[0_18px_42px_rgb(1_147_253_/_0.26)] transition hover:-translate-y-0.5 hover:bg-[#3f51f4] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#8bd5ff] dark:text-[#06111f]"
              aria-label="Send message"
            >
              <Send aria-hidden className="size-4" />
            </button>
          </form>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group relative grid size-16 place-items-center rounded-full bg-[#0193fd] text-white shadow-[0_24px_64px_rgb(1_147_253_/_0.34)] transition duration-300 hover:-translate-y-1 hover:bg-[#3f51f4] dark:bg-[#8bd5ff] dark:text-[#06111f] dark:shadow-[0_22px_80px_rgb(139_213_255_/_0.2)]"
        aria-label={open ? "Close AI concierge" : "Open AI concierge"}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-white/40 opacity-0 transition duration-500 group-hover:scale-125 group-hover:opacity-70"
        />
        {open ? <X aria-hidden className="size-6" /> : <Bot aria-hidden className="size-6" />}
      </button>
    </div>
  );
}

function ChatBubble({
  message,
}: {
  message: ChatMessage;
}) {
  const assistant = message.role === "assistant";

  return (
    <div className={cn("chat-message flex", assistant ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[88%] rounded-lg px-4 py-3 text-[14px] leading-6 tracking-[-0.005em]",
          assistant
            ? "border border-[#dce7f4] bg-[#f7fbff] text-[#273248] shadow-[0_14px_40px_rgb(28_62_132_/_0.08)] dark:border-white/10 dark:bg-white/8 dark:text-white/78"
            : "bg-[#0193fd] font-medium text-white shadow-[0_16px_40px_rgb(1_147_253_/_0.18)] dark:bg-[#8bd5ff] dark:text-[#06111f]",
        )}
      >
        {assistant ? (
          <p className="mb-1 font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0193fd] dark:text-[#8bd5ff]">
            PropertyCrest
          </p>
        ) : null}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function ChatLeadForm({
  mode,
  properties,
  propertySelectOptions,
  selectedPropertyId,
  onSelectedPropertyChange,
  onClose,
  onSubmitted,
}: {
  mode: LeadMode;
  properties: PropertyOption[];
  propertySelectOptions: Array<{ value: string; label: string }>;
  selectedPropertyId: string;
  onSelectedPropertyChange: (value: string) => void;
  onClose: () => void;
  onSubmitted: (message: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    preferredVisitDate: "",
    preferredVisitTime: "",
    message: "",
  });
  const minDate = new Date().toISOString().slice(0, 10);
  const isVisit = mode === "site_visit";
  const title =
    mode === "site_visit"
      ? "Book Site Visit"
      : mode === "callback"
        ? "Get a Callback"
        : "Send Inquiry";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Please add name, phone, and email.");
      return;
    }

    if (isVisit && (!selectedPropertyId || !form.preferredVisitDate || !form.preferredVisitTime)) {
      setError("Please choose property, visit date, and visit time.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mode,
          sourcePath: `${window.location.pathname}#ai-concierge`,
          payload:
            mode === "site_visit"
              ? {
                  name: form.name,
                  phone: form.phone,
                  email: form.email,
                  selectedPropertyId,
                  preferredVisitDate: form.preferredVisitDate,
                  preferredVisitTime: form.preferredVisitTime,
                  message: form.message,
                }
              : mode === "callback"
                ? {
                    name: form.name,
                    phone: form.phone,
                    email: form.email,
                    selectedPropertyId,
                    message: form.message,
                  }
                : {
                    name: form.name,
                    phone: form.phone,
                    email: form.email,
                    inquiryType: "AI concierge inquiry",
                    message: form.message,
                  },
        }),
      });
      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setError(result.message ?? "Please check your details and try again.");
        return;
      }

      toast.success(result.message ?? "Request submitted.");
      onSubmitted(result.message ?? "Thank you. Our team will contact you shortly.");
    } catch {
      setError("Network error. Please try again or use WhatsApp.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#cfe2f7] bg-white p-4 shadow-[0_18px_54px_rgb(28_62_132_/_0.13)] dark:border-white/10 dark:bg-white/7">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0193fd] dark:text-[#8bd5ff]">
            Concierge form
          </p>
          <h3 className="font-display text-2xl font-semibold text-[#11131a] dark:text-white">
            {title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 place-items-center rounded-full border border-[#dce7f4] text-[#50607a] transition hover:border-[#0193fd] hover:text-[#0193fd] dark:border-white/10 dark:text-white/68"
          aria-label="Close concierge form"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <ChatInput
          icon={<UserRound aria-hidden className="size-4" />}
          value={form.name}
          placeholder="Full name"
          autoComplete="name"
          onChange={(value) => setForm((current) => ({ ...current, name: value }))}
        />
        <ChatInput
          icon={<PhoneCall aria-hidden className="size-4" />}
          value={form.phone}
          placeholder="Phone number"
          autoComplete="tel"
          onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
        />
        <ChatInput
          icon={<Mail aria-hidden className="size-4" />}
          value={form.email}
          placeholder="Email address"
          autoComplete="email"
          type="email"
          onChange={(value) => setForm((current) => ({ ...current, email: value }))}
        />

        {mode !== "contact" ? (
          <LuxurySelect
            value={selectedPropertyId || undefined}
            onValueChange={onSelectedPropertyChange}
            placeholder={properties.length ? "Select property" : "Loading properties"}
            options={propertySelectOptions}
            icon={<Home aria-hidden className="size-4" />}
          />
        ) : null}

        {isVisit ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="date"
              min={minDate}
              value={form.preferredVisitDate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  preferredVisitDate: event.target.value,
                }))
              }
              className={chatInputClass}
            />
            <LuxurySelect
              value={form.preferredVisitTime || undefined}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, preferredVisitTime: value }))
              }
              placeholder="Visit time"
              options={visitTimeOptions}
            />
          </div>
        ) : null}

        <textarea
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          placeholder="Optional message"
          className="min-h-20 w-full resize-none rounded-md border border-[#dce7f4] bg-white px-3 py-3 font-ui text-sm leading-6 text-[#162033] outline-none transition placeholder:text-[#8d98aa] focus:border-[#0193fd] focus:ring-4 focus:ring-[#0193fd]/12 dark:border-white/10 dark:bg-black/18 dark:text-white"
        />

        {error ? (
          <p className="rounded-md bg-[#fff1f0] px-3 py-2 font-ui text-xs font-semibold text-[#b42318] dark:bg-[#ffb4a8]/10 dark:text-[#ffb4a8]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0193fd] px-5 font-ui text-sm font-semibold text-white shadow-[0_18px_42px_rgb(1_147_253_/_0.22)] transition hover:-translate-y-0.5 hover:bg-[#3f51f4] disabled:pointer-events-none disabled:opacity-60 dark:bg-[#8bd5ff] dark:text-[#06111f]"
        >
          {saving ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <CheckCircle2 aria-hidden className="size-4" />
          )}
          {saving ? "Submitting..." : title}
        </button>
      </form>

      {mode !== "contact" && selectedPropertyId ? (
        <PropertyShortcut properties={properties} selectedPropertyId={selectedPropertyId} />
      ) : null}
    </div>
  );
}

const chatInputClass =
  "h-11 w-full rounded-md border border-[#dce7f4] bg-white px-3 font-ui text-sm text-[#162033] outline-none transition placeholder:text-[#8d98aa] focus:border-[#0193fd] focus:ring-4 focus:ring-[#0193fd]/12 dark:border-white/10 dark:bg-black/18 dark:text-white dark:placeholder:text-white/38";

function ChatInput({
  icon,
  value,
  placeholder,
  autoComplete,
  type = "text",
  onChange,
}: {
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0193fd] dark:text-[#8bd5ff]">
        {icon}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        type={type}
        className={cn(chatInputClass, "pl-10")}
      />
    </div>
  );
}

function PropertyShortcut({
  properties,
  selectedPropertyId,
}: {
  properties: PropertyOption[];
  selectedPropertyId: string;
}) {
  const property = properties.find((item) => item.id === selectedPropertyId);

  if (!property) return null;

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="mt-3 inline-flex items-center gap-2 font-ui text-xs font-semibold text-[#0193fd] transition hover:text-[#3f51f4] dark:text-[#8bd5ff]"
    >
      View selected property
      <ArrowUpRight aria-hidden className="size-3.5" />
    </Link>
  );
}
