export const siteConfig = {
  name: "PropertyCrest",
  description:
    "Premium residential and commercial properties in prime locations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917000221580",
  callNumber: process.env.NEXT_PUBLIC_CALL_NUMBER ?? "",
  officeAddress: process.env.NEXT_PUBLIC_OFFICE_ADDRESS ?? "",
  nav: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
