"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type LuxurySelectOption = {
  value: string;
  label: string;
};

export function LuxurySelect({
  value,
  onValueChange,
  options,
  placeholder = "Select",
  icon,
  className,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  options: LuxurySelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        aria-label={placeholder}
        className={cn(
          "group flex h-12 w-full items-center justify-between gap-3 rounded-md border border-[#dce7f4] bg-white/88 px-4 font-ui text-sm font-semibold text-[#162033] shadow-[0_14px_34px_rgb(28_62_132_/_0.07)] outline-none transition duration-300 hover:border-[#0193fd]/70 hover:bg-white focus:border-[#0193fd] focus:ring-4 focus:ring-[#0193fd]/12 data-[state=open]:border-[#0193fd] data-[state=open]:bg-white data-[state=open]:shadow-[0_18px_48px_rgb(1_147_253_/_0.13)] dark:border-white/10 dark:bg-black/18 dark:text-white dark:shadow-none dark:hover:border-[#8bd5ff]/50 dark:hover:bg-white/8 dark:focus:border-[#8bd5ff] dark:data-[state=open]:border-[#8bd5ff] dark:data-[state=open]:bg-[#0d1726]",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {icon ? (
            <span className="shrink-0 text-[#0193fd] dark:text-[#8bd5ff] [&>svg]:size-4">
              {icon}
            </span>
          ) : null}
          <Select.Value
            placeholder={placeholder}
            className="truncate text-left data-[placeholder]:text-[#8d98aa]"
          />
        </span>
        <Select.Icon asChild>
          <ChevronDown
            aria-hidden
            className="size-4 shrink-0 text-[#0193fd] transition duration-300 group-data-[state=open]:rotate-180 dark:text-[#8bd5ff]"
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="lux-select-content z-[90] max-h-[min(360px,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-[#dbe7f5] bg-white/96 p-1 shadow-[0_26px_80px_rgb(16_35_75_/_0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1220]/96 dark:shadow-[0_30px_90px_rgb(0_0_0_/_0.48)]"
        >
          <Select.Viewport className="max-h-[320px] overflow-y-auto p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="group relative flex min-h-11 cursor-pointer select-none items-center rounded-md py-2 pl-10 pr-3 font-ui text-sm font-semibold text-[#263348] outline-none transition data-[highlighted]:bg-[#f0f7ff] data-[highlighted]:text-[#0193fd] data-[state=checked]:bg-[#eef7ff] data-[state=checked]:text-[#1557f2] dark:text-white/76 dark:data-[highlighted]:bg-white/8 dark:data-[highlighted]:text-[#8bd5ff] dark:data-[state=checked]:bg-[#8bd5ff]/10 dark:data-[state=checked]:text-[#bfeaff]"
              >
                <Select.ItemIndicator className="absolute left-3 inline-flex size-5 items-center justify-center rounded-full bg-[#0193fd] text-white dark:bg-[#8bd5ff] dark:text-[#06111f]">
                  <Check aria-hidden className="size-3" />
                </Select.ItemIndicator>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
