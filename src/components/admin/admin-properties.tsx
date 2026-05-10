"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, ImagePlus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { LuxurySelect } from "@/components/ui/luxury-select";
import { SmartFillImage } from "@/components/ui/smart-image";
import { adminFetch } from "@/lib/admin-client";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Property, PropertyPurpose, PropertyType } from "@/types/property";

type PropertiesResponse = {
  ok: boolean;
  properties: Property[];
};

const inputClass =
  "h-11 w-full rounded-md border border-[#dce7f4] bg-white px-3 font-ui text-sm text-[#162033] outline-none transition placeholder:text-[#8d98aa] focus:border-[#0193fd] focus:ring-4 focus:ring-[#0193fd]/12 dark:border-white/10 dark:bg-black/18 dark:text-white";

const textareaClass =
  "min-h-24 w-full resize-none rounded-md border border-[#dce7f4] bg-white px-3 py-3 font-ui text-sm leading-6 text-[#162033] outline-none transition placeholder:text-[#8d98aa] focus:border-[#0193fd] focus:ring-4 focus:ring-[#0193fd]/12 dark:border-white/10 dark:bg-black/18 dark:text-white";

const purposeOptions = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
];

const typeOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
];

export function AdminProperties() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [editing, setEditing] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purpose, setPurpose] = useState<PropertyPurpose>("buy");
  const [type, setType] = useState<PropertyType>("apartment");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin/login");
        return;
      }

      loadProperties();
    });
  }, [router]);

  async function loadProperties() {
    try {
      const result = await adminFetch<PropertiesResponse>("/api/admin/properties");
      setProperties(result.properties);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load properties.");
    } finally {
      setLoading(false);
    }
  }

  function beginEdit(property: Property) {
    setEditing(property);
    setPurpose(property.purpose);
    setType(property.type);
    setFeatured(property.featured);
    setPublished(property.published);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm(form?: HTMLFormElement | null) {
    form?.reset();
    setEditing(null);
    setPurpose("buy");
    setType("apartment");
    setFeatured(false);
    setPublished(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("purpose", purpose);
    formData.set("type", type);
    if (featured) formData.set("featured", "true");
    if (published) formData.set("published", "true");
    formData.set("existingImages", JSON.stringify(editing?.images ?? []));

    try {
      await adminFetch(
        editing ? `/api/admin/properties/${editing.id}` : "/api/admin/properties",
        {
          method: editing ? "PUT" : "POST",
          body: formData,
        },
      );

      toast.success(editing ? "Property updated." : "Property added.");
      resetForm(form);
      await loadProperties();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save property.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(property: Property) {
    if (!window.confirm(`Delete ${property.title}?`)) return;

    try {
      await adminFetch(`/api/admin/properties/${property.id}`, {
        method: "DELETE",
      });
      toast.success("Property deleted.");
      await loadProperties();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete property.");
    }
  }

  return (
    <AdminShell title="Property Management" eyebrow="Owner inventory">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-[#dbe7f5] bg-white p-5 shadow-[0_24px_80px_rgb(28_62_132_/_0.1)] dark:border-white/10 dark:bg-white/7"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-ui text-xs font-semibold uppercase text-[#0193fd] dark:text-[#8bd5ff]">
              {editing ? "Edit property" : "Add property"}
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold">
              {editing ? editing.title : "New Listing"}
            </h2>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <button
                type="button"
                onClick={() => resetForm(document.querySelector("form"))}
                className="h-11 rounded-full border border-[#dce7f4] bg-white px-5 font-ui text-sm font-semibold text-[#334056] dark:border-white/10 dark:bg-white/6 dark:text-white/76"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0193fd] px-5 font-ui text-sm font-semibold text-white shadow-[0_18px_42px_rgb(1_147_253_/_0.22)] transition hover:bg-[#3f51f4] disabled:opacity-60"
            >
              <Plus aria-hidden className="size-4" />
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Property"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Input name="title" label="Title" defaultValue={editing?.title} required />
          <Input name="slug" label="Slug" defaultValue={editing?.slug} />
          <Input name="location" label="Location" defaultValue={editing?.location} required />
          <Input name="address" label="Address" defaultValue={editing?.address} />
          <Input name="price" label="Price" type="number" defaultValue={editing?.price} required />
          <div>
            <Label>Purpose</Label>
            <LuxurySelect
              value={purpose}
              onValueChange={(value) => setPurpose(value as PropertyPurpose)}
              options={purposeOptions}
              placeholder="Purpose"
            />
          </div>
          <div>
            <Label>Type</Label>
            <LuxurySelect
              value={type}
              onValueChange={(value) => setType(value as PropertyType)}
              options={typeOptions}
              placeholder="Type"
            />
          </div>
          <Input name="bhk" label="BHK" type="number" defaultValue={editing?.bhk} />
          <Input name="bathrooms" label="Bathrooms" type="number" defaultValue={editing?.bathrooms} />
          <Input name="parking" label="Parking" type="number" defaultValue={editing?.parking} />
          <Input name="areaSqFt" label="Area sq.ft" type="number" defaultValue={editing?.areaSqFt} />
          <Input name="plotSizeSqFt" label="Plot sq.ft" type="number" defaultValue={editing?.plotSizeSqFt} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TextArea
            name="highlights"
            label="Highlights"
            defaultValue={editing?.highlights.join(", ")}
            placeholder="Private terrace, Club view, Corner plot"
          />
          <TextArea
            name="amenities"
            label="Amenities"
            defaultValue={editing?.amenities.join(", ")}
            placeholder="Security, Pool, Gym"
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
          <label className="rounded-lg border border-dashed border-[#bcd5ef] bg-[#f8fbff] p-5 dark:border-white/12 dark:bg-black/16">
            <span className="flex items-center gap-2 font-ui text-sm font-semibold text-[#334056] dark:text-white/76">
              <ImagePlus aria-hidden className="size-5 text-[#0193fd]" />
              Upload property images
            </span>
            <input
              name="images"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="mt-4 block w-full text-sm text-[#657187] file:mr-4 file:rounded-full file:border-0 file:bg-[#0193fd] file:px-4 file:py-2 file:font-ui file:text-sm file:font-semibold file:text-white dark:text-white/62"
            />
          </label>
          <div className="flex flex-col justify-center gap-3 rounded-lg border border-[#dbe7f5] bg-[#f8fbff] p-5 dark:border-white/10 dark:bg-black/16">
            <label className="flex items-center gap-3 font-ui text-sm font-semibold">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="size-4"
              />
              Featured
            </label>
            <label className="flex items-center gap-3 font-ui text-sm font-semibold">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="size-4"
              />
              Published
            </label>
          </div>
        </div>
      </form>

      <section className="mt-8 rounded-lg border border-[#dbe7f5] bg-white p-5 dark:border-white/10 dark:bg-white/7">
        <h2 className="font-display text-4xl font-semibold">Listings</h2>
        {loading ? (
          <p className="mt-5 text-sm text-[#657187] dark:text-white/62">
            Loading properties...
          </p>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {properties.map((property) => (
              <PropertyListItem
                key={property.id}
                property={property}
                onEdit={beginEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function PropertyListItem({
  property,
  onEdit,
  onDelete,
}: {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}) {
  const image = property.images[0] ?? "/assets/figma/hero-villa.png";

  return (
    <article className="grid gap-4 rounded-lg border border-[#e4edf7] bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-black/16 sm:grid-cols-[140px_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#eaf2ff]">
        <SmartFillImage
          src={image}
          alt={property.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div>
        <p className="font-display text-3xl font-semibold">
          {property.title}
        </p>
        <p className="mt-1 text-sm text-[#657187] dark:text-white/62">
          {property.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit(property)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#dce7f4] bg-white px-4 font-ui text-xs font-semibold text-[#334056] transition hover:border-[#0193fd] hover:text-[#0193fd] dark:border-white/10 dark:bg-white/6 dark:text-white/76"
          >
            <Edit3 aria-hidden className="size-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(property)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#ffd6d2] bg-white px-4 font-ui text-xs font-semibold text-[#b42318] transition hover:bg-[#fff1f0] dark:border-[#ffb4a8]/20 dark:bg-white/6 dark:text-[#ffb4a8]"
          >
            <Trash2 aria-hidden className="size-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block font-ui text-xs font-semibold uppercase text-[#657187] dark:text-white/54">
      {children}
    </span>
  );
}

function Input({
  name,
  label,
  type = "text",
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <label>
      <Label>{label}</Label>
      <input
        key={`${name}-${defaultValue ?? ""}`}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={inputClass}
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label>
      <Label>{label}</Label>
      <textarea
        key={`${name}-${defaultValue ?? ""}`}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={textareaClass}
      />
    </label>
  );
}
