"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/property/property-card";
import { LuxurySelect } from "@/components/ui/luxury-select";
import type { Property, PropertyPurpose, PropertyType } from "@/types/property";
import { cn } from "@/lib/utils";

type PurposeFilter = "all" | PropertyPurpose;
type TypeFilter = "all" | PropertyType;

const purposes: Array<{ label: string; value: PurposeFilter }> = [
  { label: "All", value: "all" },
  { label: "Buy", value: "buy" },
  { label: "Rent", value: "rent" },
];

const types: Array<{ label: string; value: TypeFilter }> = [
  { label: "All Types", value: "all" },
  { label: "Villa", value: "villa" },
  { label: "Apartment", value: "apartment" },
  { label: "Commercial", value: "commercial" },
  { label: "Plot", value: "plot" },
];

export function PropertiesExplorer({ properties }: { properties: Property[] }) {
  const [purpose, setPurpose] = useState<PurposeFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return properties.filter((property) => {
      const purposeMatch = purpose === "all" || property.purpose === purpose;
      const typeMatch = type === "all" || property.type === type;
      const queryMatch =
        !normalized ||
        [property.title, property.location, property.address, property.type]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalized));

      return purposeMatch && typeMatch && queryMatch;
    });
  }, [properties, purpose, query, type]);

  return (
    <div className="space-y-10">
      <div className="scroll-reveal rounded-lg border border-[#dbe7f5] bg-white/86 p-4 shadow-[0_28px_90px_rgb(28_62_132_/_0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {purposes.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPurpose(option.value)}
                className={cn(
                  "h-10 rounded-full border px-5 font-ui text-sm font-semibold transition duration-300",
                  purpose === option.value
                    ? "border-[#0193fd] bg-[#0193fd] text-white shadow-[0_16px_36px_rgb(1_147_253_/_0.22)]"
                    : "border-[#dce7f4] bg-white/70 text-[#47566d] hover:border-[#0193fd] hover:text-[#0193fd] dark:border-white/10 dark:bg-white/6 dark:text-white/68",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-md bg-[#f6f9fe] px-4 dark:bg-black/20">
            <Search aria-hidden className="size-4 text-[#0193fd]" />
            <span className="sr-only">Search properties</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by location, property, or address"
              className="min-w-0 flex-1 bg-transparent font-ui text-sm text-[#1d2738] outline-none placeholder:text-[#8d98aa] dark:text-white"
            />
          </label>

          <div className="min-w-[190px]">
            <LuxurySelect
              value={type}
              onValueChange={(value) => setType(value as TypeFilter)}
              options={types}
              icon={<SlidersHorizontal aria-hidden />}
              placeholder="Property type"
              className="bg-[#f6f9fe] shadow-none dark:bg-black/20"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {filtered.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#ccd8ea] bg-white/70 px-6 py-16 text-center dark:border-white/12 dark:bg-white/5">
          <p className="font-display text-4xl font-semibold">No properties found</p>
          <p className="mt-3 text-sm text-[#697386] dark:text-white/60">
            Try another location, budget, or property type.
          </p>
        </div>
      ) : null}
    </div>
  );
}
