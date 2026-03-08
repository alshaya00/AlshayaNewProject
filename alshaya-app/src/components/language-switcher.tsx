"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  variant?: "button" | "dropdown" | "inline";
  className?: string;
}

const languages = [
  { code: "ar", label: "العربية", nativeLabel: "Arabic" },
  { code: "en", label: "English", nativeLabel: "English" },
];

export function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  variant = "button",
  className,
}: LanguageSwitcherProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1 text-sm", className)}>
        {languages.map((lang, i) => (
          <React.Fragment key={lang.code}>
            {i > 0 && <span className="text-text-muted">/</span>}
            <button
              onClick={() => onLanguageChange(lang.code)}
              className={cn(
                "transition-colors",
                currentLanguage === lang.code ? "font-bold text-cyan" : "text-text-muted hover:text-text-primary"
              )}
            >
              {lang.code.toUpperCase()}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (variant === "button") {
    const next = currentLanguage === "ar" ? "en" : "ar";
    return (
      <button
        onClick={() => onLanguageChange(next)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors",
          className
        )}
      >
        <Globe className="h-4 w-4" />
        {currentLanguage === "ar" ? "EN" : "عربي"}
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-surface-hover",
          className
        )}>
          <Globe className="h-4 w-4" />
          {languages.find((l) => l.code === currentLanguage)?.label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuCheckboxItem
            key={lang.code}
            checked={currentLanguage === lang.code}
            onCheckedChange={() => onLanguageChange(lang.code)}
          >
            {lang.label} ({lang.nativeLabel})
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
