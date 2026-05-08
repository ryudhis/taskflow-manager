import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function Checkbox({ label, className = "", id, ...props }: CheckboxProps) {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={checkboxId}
        className={`h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-800 cursor-pointer accent-violet-600 ${className}`}
        {...props}
      />
      {label && (
        <label
          htmlFor={checkboxId}
          className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
