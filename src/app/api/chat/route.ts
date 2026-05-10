import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { getAllProperties } from "@/lib/property-data";
import { formatPropertyPrice } from "@/lib/property-format";
import type { Property } from "@/types/property";

export const runtime = "nodejs";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1600),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(12),
  currentPath: z.string().trim().max(240).optional(),
});

type ChatAction = "none" | "callback" | "site_visit" | "contact" | "whatsapp";

type ChatResponse = {
  reply: string;
  action: ChatAction;
  propertySlug: string | null;
  propertyTitle: string | null;
  provider: "groq" | "guided";
};

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request);

  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        reply:
          "I am getting many requests right now. Please try again in a minute, or use the callback form and our team will contact you shortly.",
        action: "callback",
        propertySlug: null,
        propertyTitle: null,
        provider: "guided",
      } satisfies ChatResponse,
      { status: 429 },
    );
  }

  try {
    const json = await request.json();
    const parsed = chatRequestSchema.parse(json);
    const properties = await getAllProperties();
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return NextResponse.json(guidedResponse(parsed.messages, properties));
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: 0.42,
        max_completion_tokens: 760,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: systemPrompt(properties),
          },
          ...parsed.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      console.error("[ai-chat:groq]", response.status, await response.text());
      return NextResponse.json(guidedResponse(parsed.messages, properties));
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;
    const ai = parseAiJson(content);

    if (!ai) {
      return NextResponse.json(guidedResponse(parsed.messages, properties));
    }

    return NextResponse.json({
      reply: ai.reply,
      action: ai.action,
      propertySlug: ai.propertySlug,
      propertyTitle: ai.propertyTitle,
      provider: "groq",
    } satisfies ChatResponse);
  } catch (error) {
    console.error("[ai-chat]", error);

    return NextResponse.json(
      {
        reply:
          "I can still help you with callbacks, site visits, property questions, and WhatsApp inquiries. What would you like to do?",
        action: "none",
        propertySlug: null,
        propertyTitle: null,
        provider: "guided",
      } satisfies ChatResponse,
      { status: 200 },
    );
  }
}

function systemPrompt(properties: Property[]) {
  return `You are PropertyCrest AI Concierge, the premium real estate AI advisor for ${siteConfig.name}.

Core personality:
- Sound like a polished luxury real-estate consultant, not a generic chatbot.
- Be calm, sharp, helpful, confident, warm, and conversion-focused.
- Use the user's language automatically: English, Hindi, Hinglish, or simple mixed language.
- Keep answers concise but useful. If the question is complex, use short elegant bullets.
- Never be pushy, but always guide toward the next useful action.

What you can answer:
- PropertyCrest website: what it does, how to explore properties, how forms work, how site visits/callbacks/contact/WhatsApp work.
- Real estate topics: residential vs commercial, buy vs rent, BHK, carpet/built-up/super area, plot size, amenities, location evaluation, site visit checklist, negotiation basics, RERA/license awareness, documents to ask for, EMI/down payment basics, investment/rental-yield thinking, and what a buyer should verify.
- Property recommendations from the current listings below.
- Booking and lead capture: callback, site visit, contact inquiry, WhatsApp.

Conversion behavior:
- If the user sounds interested, ask one smart follow-up: budget, location, buy/rent, BHK, commercial/residential, or visit timing.
- If the user says they want to book, visit, schedule, call, contact, inquire, WhatsApp, or share details, set the matching action immediately.
- If user asks for "call me", "callback", "talk to agent", set action "callback".
- If user asks for "site visit", "book visit", "schedule", "appointment", "property dekhna", set action "site_visit".
- If user asks for "contact", "inquiry", "enquiry", "details", set action "contact".
- If user asks for WhatsApp, set action "whatsapp".
- When recommending a specific property, include its slug and title in the JSON fields.

Truth and safety:
- Recommend real listings only from the property context below. Do not invent property names, prices, offers, discounts, availability, or guarantees.
- You may explain general real-estate concepts, but do not provide legal, tax, loan approval, or financial guarantees.
- Do not ask for payment details, OTP, card details, Aadhaar/PAN, passwords, or private documents.
- For legal/RERA/document verification, advise confirming with the PropertyCrest team and official records.
- If asked about unrelated topics, briefly steer back to real estate and PropertyCrest.

PropertyCrest facts:
- Premium residential and commercial properties in prime locations.
- Users can explore properties, request callback, book site visits, WhatsApp the team, and submit contact inquiries.
- WhatsApp number: +${siteConfig.whatsappNumber}.
- Admin panel is owner-only and protected.
- Lead forms save to Supabase and notify both customer and owner by email.
- The site has property listings, detail pages, callback forms, site visit booking, contact page, EMI calculator, testimonials/FAQ/trust sections, light/dark luxury theme, and owner property management.
- Brand feeling: minimal luxury, editorial, cinematic, architectural, premium, trustworthy.

Available properties:
${propertyContext(properties)}

Return ONLY valid JSON with this exact shape:
{
  "reply": "customer-facing answer in the user's language",
  "action": "none" | "callback" | "site_visit" | "contact" | "whatsapp",
  "propertySlug": "matching-property-slug-or-null",
  "propertyTitle": "matching-property-title-or-null"
}`;
}

function propertyContext(properties: Property[]) {
  return properties
    .slice(0, 10)
    .map((property) => {
      const specs = [
        property.bhk ? `${property.bhk} BHK` : null,
        property.areaSqFt ? `${property.areaSqFt.toLocaleString("en-IN")} sq.ft` : null,
        property.purpose === "buy" ? "For Sale" : "For Rent",
        property.type,
      ]
        .filter(Boolean)
        .join(", ");

      return `- ${property.title} (${property.slug}) in ${property.location}: ${formatPropertyPrice(property)}. ${specs}. Highlights: ${property.highlights.slice(0, 3).join(", ")}.`;
    })
    .join("\n");
}

function parseAiJson(content: unknown): Omit<ChatResponse, "provider"> | null {
  if (typeof content !== "string") return null;

  try {
    const parsed = JSON.parse(content) as Partial<Omit<ChatResponse, "provider">>;
    const action = normalizeAction(parsed.action);

    if (!parsed.reply || !action) return null;

    return {
      reply: String(parsed.reply).slice(0, 1200),
      action,
      propertySlug: typeof parsed.propertySlug === "string" ? parsed.propertySlug : null,
      propertyTitle: typeof parsed.propertyTitle === "string" ? parsed.propertyTitle : null,
    };
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      const parsed = JSON.parse(match[0]) as Partial<Omit<ChatResponse, "provider">>;
      const action = normalizeAction(parsed.action);

      if (!parsed.reply || !action) return null;

      return {
        reply: String(parsed.reply).slice(0, 1200),
        action,
        propertySlug: typeof parsed.propertySlug === "string" ? parsed.propertySlug : null,
        propertyTitle: typeof parsed.propertyTitle === "string" ? parsed.propertyTitle : null,
      };
    } catch {
      return null;
    }
  }
}

function normalizeAction(action: unknown): ChatAction | null {
  if (
    action === "none" ||
    action === "callback" ||
    action === "site_visit" ||
    action === "contact" ||
    action === "whatsapp"
  ) {
    return action;
  }

  return null;
}

function guidedResponse(
  messages: Array<z.infer<typeof chatMessageSchema>>,
  properties: Property[],
): ChatResponse {
  const latest = messages[messages.length - 1]?.content ?? "";
  const action = detectAction(latest);
  const property = findMentionedProperty(latest, properties);
  const hindi = /[\u0900-\u097F]|hindi|hinglish|namaste|batao|kaise|kya/i.test(latest);
  const propertyLine = property
    ? hindi
      ? `${property.title} ${property.location} mein ${formatPropertyPrice(property)} par available hai.`
      : `${property.title} is available in ${property.location} for ${formatPropertyPrice(property)}.`
    : properties.length
      ? `${hindi ? "Featured options" : "Featured options"}: ${properties
          .slice(0, 3)
          .map((item) => item.title)
          .join(", ")}.`
      : "";

  const reply = hindi
    ? `Bilkul. Main PropertyCrest ka AI concierge hoon. ${propertyLine} Aap property explore kar sakte hain, callback request bhej sakte hain, site visit book kar sakte hain, ya WhatsApp par team se baat kar sakte hain.`
    : `Absolutely. I am the PropertyCrest AI concierge. ${propertyLine} I can help you compare properties, estimate next steps, request a callback, book a site visit, or connect you on WhatsApp.`;

  return {
    reply,
    action,
    propertySlug: property?.slug ?? null,
    propertyTitle: property?.title ?? null,
    provider: "guided",
  };
}

function detectAction(text: string): ChatAction {
  if (/whatsapp|wa\.me|message/i.test(text)) return "whatsapp";
  if (/site\s*visit|visit|schedule|appointment|book|देख|विजिट|बुक|milna|dekhna/i.test(text)) {
    return "site_visit";
  }
  if (/callback|call\s*back|call me|phone|कॉल|फोन/i.test(text)) return "callback";
  if (/contact|inquiry|enquiry|query|संपर्क|पूछताछ/i.test(text)) return "contact";
  return "none";
}

function findMentionedProperty(text: string, properties: Property[]) {
  const normalized = text.toLowerCase();

  return (
    properties.find((property) => normalized.includes(property.title.toLowerCase())) ??
    properties.find((property) => normalized.includes(property.slug.toLowerCase())) ??
    null
  );
}

function checkRateLimit(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return { ok: true };
  }

  if (bucket.count >= 18) return { ok: false };

  bucket.count += 1;
  return { ok: true };
}
