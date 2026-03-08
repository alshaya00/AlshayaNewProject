"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  suggestions?: { id: string; label: string; subtitle?: string }[];
  onSuggestionClick?: (id: string) => void;
  className?: string;
}

export function SearchInput({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = "Search...",
  debounceMs = 300,
  suggestions,
  onSuggestionClick,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(controlledValue || "");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledValue === undefined) setInternalValue(val);
    onChange?.(val);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch?.(val), debounceMs);
  };

  const handleClear = () => {
    if (controlledValue === undefined) setInternalValue("");
    onChange?.("");
    onSearch?.("");
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          value={value}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="h-10 w-full rounded-md border border-border bg-surface ps-9 pe-9 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-cyan"
          dir="auto"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-surface shadow-lg">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onMouseDown={() => onSuggestionClick?.(s.id)}
              className="flex w-full flex-col px-3 py-2 text-start hover:bg-surface-hover"
            >
              <span className="text-sm text-text-primary">{s.label}</span>
              {s.subtitle && <span className="text-xs text-text-muted">{s.subtitle}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
