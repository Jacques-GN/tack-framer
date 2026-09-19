"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Violet filled checkbox used across the wizard. */
export function GreenCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-150",
        checked ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white hover:border-violet-500"
      )}
    >
      {checked && <Check className="size-3.5" strokeWidth={3.5} />}
    </button>
  );
}

export type DropdownEntry = {
  id: string;
  title: string;
  desc: string;
  icon: ReactNode;
  badge?: string;
  disabled?: boolean;
};

/** Card dropdown (Formulaires / Livraison). */
export function CardDropdown({
  entries,
  value,
  onChange,
  ariaLabel,
}: {
  entries: DropdownEntry[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = entries.find((e) => e.id === value) || entries[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-slate-300"
      >
        <span className="text-slate-500">{current?.icon}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{current?.title}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          {entries.map((e) => (
            <button
              key={e.id}
              type="button"
              disabled={e.disabled}
              onClick={() => {
                if (!e.disabled) {
                  onChange(e.id);
                  setOpen(false);
                }
              }}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors",
                e.id === value ? "bg-slate-100" : "bg-white hover:bg-slate-50",
                e.disabled && "cursor-not-allowed opacity-50 hover:bg-white"
              )}
            >
              <span className="mt-0.5 text-slate-500">{e.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  {e.title}
                  {e.badge && (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      {e.badge}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{e.desc}</span>
              </span>
              {e.id === value && <Check className="mt-0.5 size-4 shrink-0 text-violet-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Toggle row (step 2). */
export function ToggleRow({
  icon,
  title,
  desc,
  checked,
  onToggle,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <span className="text-slate-500">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-violet-600" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

/** Collapsible section header. */
export function SectionHeader({
  title,
  right,
  open,
  onToggle,
  icon,
}: {
  title: ReactNode;
  right?: ReactNode;
  open: boolean;
  onToggle: () => void;
  icon?: ReactNode;
}) {
  return (
    <button type="button" onClick={onToggle} className="flex w-full items-center gap-2.5 text-left" aria-expanded={open}>
      {icon}
      <span className="flex-1 text-base font-bold text-slate-900">{title}</span>
      {right}
      <ChevronDown className={cn("size-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
    </button>
  );
}

/** Corner badge on selected mode cards. */
export function CheckBadge() {
  return (
    <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-violet-600 text-white shadow-md ring-2 ring-white">
      <Check className="size-3.5" strokeWidth={3.5} />
    </span>
  );
}
