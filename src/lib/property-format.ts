import type { Property } from "@/types/property";

export function formatPropertyPrice(property: Property) {
  if (property.purpose === "rent") {
    return `${new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(property.price)}/mo`;
  }

  if (property.price >= 10000000) {
    return `₹${(property.price / 10000000).toFixed(2)} Cr`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(property.price);
}

export function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
