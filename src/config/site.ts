export const siteConfig = {
  name: "PropertyCrest",
  description:
    "Premium residential and commercial properties in prime locations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917000221580",
  callNumber: process.env.NEXT_PUBLIC_CALL_NUMBER ?? "",
  officeAddress:
    process.env.NEXT_PUBLIC_OFFICE_ADDRESS ||
    "Rai Colony, near Shri 1008 Pandri Wale Baba Mandir, 474010, Purani Chawani, Gwalior (M.P.)",
  officeEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "chauhanarun838@gmail.com",
  nav: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
