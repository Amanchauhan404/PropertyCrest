import type { Metadata } from "next";
import { AdminProperties } from "@/components/admin/admin-properties";

export const metadata: Metadata = {
  title: "Admin Properties",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPropertiesPage() {
  return <AdminProperties />;
}
