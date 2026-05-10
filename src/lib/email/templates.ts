import { featuredProperties } from "@/data/properties";
import type { LeadRequestInput } from "@/lib/validation/leads";

type EmailTemplate = {
  subject: string;
  html: string;
};

export function customerEmailTemplate(request: LeadRequestInput): EmailTemplate {
  if (request.type === "site_visit") {
    const property = propertyTitle(request.payload.selectedPropertyId);

    return {
      subject: "Site Visit Request Received",
      html: frameEmail({
        eyebrow: "Site visit request received",
        title: "Thank you.",
        intro:
          "We have received your site visit request. Our team will confirm shortly.",
        rows: [
          ["Selected property", property],
          ["Preferred date", request.payload.preferredVisitDate],
          ["Preferred time", request.payload.preferredVisitTime],
        ],
      }),
    };
  }

  if (request.type === "contact") {
    return {
      subject: "Thank You for Contacting Us",
      html: frameEmail({
        eyebrow: "Inquiry received",
        title: "Thank you for contacting us.",
        intro: "We will contact you shortly.",
        rows: [
          ["Name", request.payload.name],
          ["Phone", request.payload.phone],
          ["Inquiry type", request.payload.inquiryType || "Property inquiry"],
        ],
      }),
    };
  }

  return {
    subject: "We Received Your Inquiry",
    html: frameEmail({
      eyebrow: "Callback request received",
      title: "Thank you for your interest.",
      intro:
        "We have received your callback request. Our team will contact you shortly.",
      rows: [
        ["Name", request.payload.name],
        ["Phone", request.payload.phone],
        ["Selected property", propertyTitle(request.payload.selectedPropertyId)],
      ],
    }),
  };
}

export function ownerEmailTemplate(request: LeadRequestInput): EmailTemplate {
  const timestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  if (request.type === "site_visit") {
    return {
      subject: "New Site Visit Booking",
      html: frameEmail({
        eyebrow: "New high-intent lead",
        title: "New Site Visit Booking",
        intro: "A visitor submitted a site visit request from the website.",
        rows: [
          ["Customer name", request.payload.name],
          ["Phone", request.payload.phone],
          ["Email", request.payload.email],
          ["Selected property", propertyTitle(request.payload.selectedPropertyId)],
          ["Visit date", request.payload.preferredVisitDate],
          ["Visit time", request.payload.preferredVisitTime],
          ["Message", request.payload.message || "No message"],
          ["Timestamp", timestamp],
        ],
      }),
    };
  }

  if (request.type === "contact") {
    return {
      subject: "New Contact Inquiry",
      html: frameEmail({
        eyebrow: "New website inquiry",
        title: "New Contact Inquiry",
        intro: "A visitor submitted the contact form.",
        rows: [
          ["Customer name", request.payload.name],
          ["Phone", request.payload.phone],
          ["Email", request.payload.email],
          ["Inquiry type", request.payload.inquiryType || "Property inquiry"],
          ["Message", request.payload.message || "No message"],
          ["Timestamp", timestamp],
        ],
      }),
    };
  }

  return {
    subject: "New Callback Request",
    html: frameEmail({
      eyebrow: "New callback lead",
      title: "New Callback Request",
      intro: "A visitor requested a quick callback.",
      rows: [
        ["Customer name", request.payload.name],
        ["Phone", request.payload.phone],
        ["Email", request.payload.email],
        ["Selected property", propertyTitle(request.payload.selectedPropertyId)],
        ["Message", request.payload.message || "No message"],
        ["Timestamp", timestamp],
      ],
    }),
  };
}

function frameEmail({
  eyebrow,
  title,
  intro,
  rows,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  rows: Array<[string, string]>;
}) {
  const details = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:14px 0;color:#6b7280;font:600 12px Arial,sans-serif;text-transform:uppercase;">${escapeHtml(label)}</td>
          <td style="padding:14px 0;color:#111827;font:500 15px Arial,sans-serif;text-align:right;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f5f8fc;padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe7f5;border-radius:16px;overflow:hidden;box-shadow:0 28px 90px rgba(28,62,132,.12);">
          <tr>
            <td style="background:linear-gradient(118deg,#3f51f4 0%,#0193fd 100%);padding:34px 34px 42px;color:#fff;">
              <div style="font:800 16px Arial,sans-serif;font-style:italic;">PropertyCrest</div>
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.36),transparent);margin:30px 0;"></div>
              <div style="font:700 12px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.76);">${escapeHtml(eyebrow)}</div>
              <h1 style="margin:14px 0 0;font:600 42px Georgia,serif;line-height:1;color:#fff;">${escapeHtml(title)}</h1>
              <p style="margin:18px 0 0;font:400 16px Arial,sans-serif;line-height:1.7;color:rgba(255,255,255,.86);">${escapeHtml(intro)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 34px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                ${details}
              </table>
              <div style="margin-top:28px;padding:18px 20px;border-radius:12px;background:#f1f6ff;color:#334056;font:500 14px Arial,sans-serif;line-height:1.6;">
                Premium residential and commercial properties in prime locations.
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function propertyTitle(propertyId?: string) {
  if (!propertyId) return "Not selected";
  return (
    featuredProperties.find((property) => property.id === propertyId)?.title ??
    propertyId
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
