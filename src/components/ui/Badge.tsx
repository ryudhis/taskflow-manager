import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  default:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger:
    "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info:
    "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
