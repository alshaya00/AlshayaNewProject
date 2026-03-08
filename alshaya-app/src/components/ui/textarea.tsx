"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxChars?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, showCount, maxChars, value, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxChars}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-surface px-3 py-2 text-sm text-text-primary",
            "placeholder:text-text-muted resize-y",
            "focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-1 focus:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-error" : "border-border",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        <div className="mt-1 flex justify-between">
          <div>
            {error && <p className="text-sm text-error" role="alert">{error}</p>}
            {helperText && !error && <p className="text-sm text-text-muted">{helperText}</p>}
          </div>
          {showCount && (
            <span className="text-xs text-text-muted">
              {charCount}{maxChars ? `/${maxChars}` : ""}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
