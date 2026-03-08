"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
  value,
  onChange,
  label,
  error,
  minDate,
  maxDate,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(value || new Date());
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const isSelected = (day: number) =>
    value && value.getFullYear() === year && value.getMonth() === month && value.getDate() === day;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && <label className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-md border bg-surface px-3 text-sm",
          error ? "border-error" : "border-border",
          value ? "text-text-primary" : "text-text-muted"
        )}
      >
        <Calendar className="h-4 w-4" />
        {value ? value.toLocaleDateString() : placeholder}
      </button>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}

      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-md border border-border bg-surface p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-1 text-text-muted hover:text-text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-text-primary">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-1 text-text-muted hover:text-text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAY_NAMES.map((d) => (
              <div key={d} className="py-1 text-xs font-medium text-text-muted">{d}</div>
            ))}
            {days.map((day, i) => (
              <div key={i}>
                {day === null ? (
                  <div className="h-8" />
                ) : (
                  <button
                    type="button"
                    disabled={isDisabled(day)}
                    onClick={() => {
                      onChange?.(new Date(year, month, day));
                      setOpen(false);
                    }}
                    className={cn(
                      "h-8 w-8 rounded text-sm transition-colors",
                      isSelected(day) ? "bg-cyan text-navy-dark font-bold" : "text-text-primary hover:bg-surface-hover",
                      isDisabled(day) && "opacity-30 pointer-events-none"
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
