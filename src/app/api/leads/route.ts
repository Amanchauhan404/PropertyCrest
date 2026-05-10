import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { sendLeadEmails } from "@/lib/email/brevo";
import { persistLead } from "@/lib/leads";
import { leadRequestSchema } from "@/lib/validation/leads";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = leadRequestSchema.parse(json);
    const result = await persistLead(parsed, { sourcePath: parsed.sourcePath });
    const emailResult = await sendLeadEmails(parsed);

    return NextResponse.json(
      {
        ok: true,
        stored: result.stored,
        emailed: emailResult.sent,
        message: successMessage(parsed.type),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please check the highlighted fields.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("[lead:submit]", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          process.env.NODE_ENV === "production"
            ? "We could not submit your request right now. Please call or WhatsApp us."
            : "Lead storage is not configured yet. Add Supabase keys to enable persistence.",
      },
      { status: process.env.NODE_ENV === "production" ? 500 : 503 },
    );
  }
}

function successMessage(type: "callback" | "site_visit" | "contact") {
  if (type === "site_visit") {
    return "Your visit request has been submitted. Our team will contact you shortly.";
  }

  if (type === "contact") {
    return "Thank you for contacting us. We will contact you shortly.";
  }

  return "Thank you. Our team will contact you shortly.";
}
