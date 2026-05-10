"use client";

import { useMemo, useState } from "react";
import { Calculator, IndianRupee, Percent, TimerReset } from "lucide-react";
import { LuxurySelect } from "@/components/ui/luxury-select";
import type { Property } from "@/types/property";
import { formatPropertyPrice } from "@/lib/property-format";

export function EmiCalculator({
  properties,
  defaultPropertyId,
  title = "EMI Calculator",
}: {
  properties: Property[];
  defaultPropertyId?: string;
  title?: string;
}) {
  const initialProperty =
    properties.find((property) => property.id === defaultPropertyId) ??
    properties[0];
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    initialProperty?.id ?? "",
  );
  const selectedProperty =
    properties.find((property) => property.id === selectedPropertyId) ??
    initialProperty;
  const [price, setPrice] = useState(initialProperty?.price ?? 5000000);
  const [downPayment, setDownPayment] = useState(
    Math.round((initialProperty?.price ?? 5000000) * 0.2),
  );
  const [interestRate, setInterestRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const monthlyEmi = useMemo(() => {
    const principal = Math.max(price - downPayment, 0);
    const monthlyRate = interestRate / 12 / 100;
    const months = years * 12;

    if (!principal || !monthlyRate || !months) return 0;

    return Math.round(
      (principal * monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1),
    );
  }, [downPayment, interestRate, price, years]);

  function handlePropertyChange(propertyId: string) {
    const property = properties.find((item) => item.id === propertyId);
    setSelectedPropertyId(propertyId);

    if (!property) return;

    setPrice(property.price);
    setDownPayment(Math.round(property.price * 0.2));
  }

  return (
    <section className="rounded-lg border border-[#dbe7f5] bg-white p-6 shadow-[0_24px_80px_rgb(28_62_132_/_0.1)] dark:border-white/10 dark:bg-white/7 dark:shadow-[0_28px_100px_rgb(0_0_0_/_0.32)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-ui text-xs font-semibold uppercase text-[#0193fd] dark:text-[#8bd5ff]">
            Financing estimate
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold leading-none">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#657187] dark:text-white/62">
            Estimate monthly payments before booking a visit. Final values
            depend on lender terms, taxes, and eligibility.
          </p>
        </div>
        <div className="rounded-lg bg-[#f1f6ff] px-5 py-4 text-right dark:bg-black/20">
          <p className="font-ui text-xs font-semibold uppercase text-[#657187] dark:text-white/50">
            Estimated EMI
          </p>
          <p className="mt-1 font-display text-4xl font-semibold text-[#0193fd] dark:text-[#8bd5ff]">
            ₹{monthlyEmi.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-[#657187] dark:text-white/50">
            per month
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="font-ui text-xs font-semibold uppercase text-[#657187] dark:text-white/54">
            Property
          </span>
          <LuxurySelect
            value={selectedPropertyId}
            onValueChange={handlePropertyChange}
            placeholder="Choose property"
            options={properties.map((property) => ({
              value: property.id,
              label: `${property.title} - ${formatPropertyPrice(property)}`,
            }))}
            className="bg-[#f8fbff] shadow-none dark:bg-black/18"
          />
        </label>

        <NumberInput
          icon={<IndianRupee />}
          label="Property price"
          value={price}
          min={100000}
          step={100000}
          onChange={setPrice}
        />
        <NumberInput
          icon={<IndianRupee />}
          label="Down payment"
          value={downPayment}
          min={0}
          step={50000}
          onChange={setDownPayment}
        />
        <NumberInput
          icon={<Percent />}
          label="Interest rate"
          value={interestRate}
          min={1}
          step={0.1}
          onChange={setInterestRate}
        />
        <NumberInput
          icon={<TimerReset />}
          label="Years"
          value={years}
          min={1}
          step={1}
          onChange={setYears}
        />
      </div>

      {selectedProperty ? (
        <div className="mt-6 flex items-start gap-3 rounded-md bg-[#f8fbff] px-4 py-3 text-sm leading-6 text-[#5f6b7d] dark:bg-black/18 dark:text-white/62">
          <Calculator
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-[#0193fd]"
          />
          <p>
            Current estimate is based on {selectedProperty.title}. You can
            adjust the numbers to match your financing plan.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function NumberInput({
  icon,
  label,
  value,
  min,
  step,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="font-ui text-xs font-semibold uppercase text-[#657187] dark:text-white/54">
        {label}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-md border border-[#dce7f4] bg-[#f8fbff] px-4 text-[#0193fd] focus-within:border-[#0193fd] focus-within:ring-4 focus-within:ring-[#0193fd]/12 dark:border-white/10 dark:bg-black/18 dark:text-[#8bd5ff]">
        <span className="[&>svg]:size-4">{icon}</span>
        <input
          value={Number.isFinite(value) ? value : ""}
          min={min}
          step={step}
          type="number"
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 bg-transparent font-ui text-sm font-semibold text-[#162033] outline-none dark:text-white"
        />
      </span>
    </label>
  );
}
