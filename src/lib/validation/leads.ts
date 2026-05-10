import { z } from "zod";

const phonePattern = /^[0-9+\-\s()]{7,20}$/;
const optionalMessage = z
  .string()
  .trim()
  .max(1000, "Please keep the message under 1000 characters.")
  .optional()
  .or(z.literal(""));

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(20, "Enter a valid phone number.")
  .regex(phonePattern, "Use digits, spaces, +, -, or brackets only.");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name.")
  .max(80, "Name is too long.");

const propertyIdSchema = z
  .string()
  .trim()
  .max(80, "Selected property is invalid.")
  .optional()
  .or(z.literal(""));

export const callbackLeadSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email address."),
  selectedPropertyId: propertyIdSchema,
  message: optionalMessage,
});

export const siteVisitLeadSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email address."),
  selectedPropertyId: z.string().trim().min(1, "Choose a property."),
  preferredVisitDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a visit date."),
  preferredVisitTime: z.string().trim().min(1, "Choose a visit time."),
  message: optionalMessage,
});

export const contactLeadSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email address."),
  inquiryType: z.string().trim().max(80).optional().or(z.literal("")),
  message: optionalMessage,
});

export const leadRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("callback"),
    payload: callbackLeadSchema,
    sourcePath: z.string().trim().max(240).optional(),
  }),
  z.object({
    type: z.literal("site_visit"),
    payload: siteVisitLeadSchema,
    sourcePath: z.string().trim().max(240).optional(),
  }),
  z.object({
    type: z.literal("contact"),
    payload: contactLeadSchema,
    sourcePath: z.string().trim().max(240).optional(),
  }),
]);

export type CallbackLeadInput = z.infer<typeof callbackLeadSchema>;
export type SiteVisitLeadInput = z.infer<typeof siteVisitLeadSchema>;
export type ContactLeadInput = z.infer<typeof contactLeadSchema>;
export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
