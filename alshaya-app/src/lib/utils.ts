import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function normalizeArabicText(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // Remove diacritics (tashkeel)
    .replace(/[أإآ]/g, "ا") // Normalize hamza variants
    .replace(/ة/g, "ه") // Normalize taa marbouta
    .replace(/ى/g, "ي") // Normalize alef maqsura
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

export function generateMemberId(sequence: number): string {
  return `P${String(sequence).padStart(4, "0")}`;
}
