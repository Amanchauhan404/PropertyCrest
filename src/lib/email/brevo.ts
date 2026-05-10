import type { LeadRequestInput } from "@/lib/validation/leads";
import { customerEmailTemplate, ownerEmailTemplate } from "@/lib/email/templates";

type BrevoEmailPayload = {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  htmlContent: string;
  replyTo?: {
    email: string;
    name?: string;
  };
};

const ownerEmail = process.env.ADMIN_EMAIL || "chauhanarun838@gmail.com";

export async function sendLeadEmails(request: LeadRequestInput) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "PropertyCrest";

  if (!apiKey || !senderEmail) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Brevo transactional email is not configured.");
    }

    console.info("[email:not-sent]", {
      reason: "Missing BREVO_API_KEY or BREVO_SENDER_EMAIL",
      type: request.type,
    });

    return { sent: false };
  }

  const customerEmail = getCustomerEmail(request);
  const customerTemplate = customerEmailTemplate(request);
  const ownerTemplate = ownerEmailTemplate(request);

  await Promise.all([
    sendBrevoEmail(apiKey, {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: customerEmail, name: request.payload.name }],
      subject: customerTemplate.subject,
      htmlContent: customerTemplate.html,
    }),
    sendBrevoEmail(apiKey, {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: ownerEmail, name: "PropertyCrest Owner" }],
      subject: ownerTemplate.subject,
      htmlContent: ownerTemplate.html,
      replyTo: {
        email: customerEmail,
        name: request.payload.name,
      },
    }),
  ]);

  return { sent: true };
}

async function sendBrevoEmail(apiKey: string, payload: BrevoEmailPayload) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Brevo email failed: ${response.status} ${text}`);
  }
}

function getCustomerEmail(request: LeadRequestInput) {
  return request.payload.email;
}
