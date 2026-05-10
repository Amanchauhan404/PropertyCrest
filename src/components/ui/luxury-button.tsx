import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type LuxuryButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "glass" | "outline";
  icon?: ReactNode;
} & ComponentPropsWithoutRef<"button">;

const variants = {
  primary:
    "bg-white text-[#1557f2] ring-white/70 shadow-[0_22px_50px_rgb(0_62_177_/_0.24)] hover:-translate-y-0.5 hover:bg-[#f5fbff] dark:bg-[#f7fbff] dark:text-[#08111f] dark:ring-white/55",
  ghost:
    "bg-white/13 text-white ring-white/34 hover:-translate-y-0.5 hover:bg-white/20 dark:bg-white/10 dark:ring-white/22",
  glass:
    "bg-white/92 text-[#182033] shadow-[0_20px_70px_rgb(14_27_56_/_0.16)] hover:-translate-y-0.5 hover:bg-white dark:bg-white/9 dark:text-white dark:ring-white/18",
  outline:
    "bg-transparent text-[#3f51f4] ring-[#3f51f4] hover:-translate-y-0.5 hover:bg-[#3f51f4] hover:text-white dark:text-[#8bcfff] dark:ring-[#8bcfff]/70 dark:hover:bg-[#8bcfff] dark:hover:text-[#07111f]",
};

export function LuxuryButton({
  children,
  href,
  variant = "primary",
  icon,
  className,
  ...props
}: LuxuryButtonProps) {
  const classes = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-ui text-[13px] font-semibold leading-none ring-1 transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-accent active:translate-y-0",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {icon}
      {children}
    </button>
  );
}
