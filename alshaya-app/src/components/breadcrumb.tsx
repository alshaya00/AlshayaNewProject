import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ items, separator, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-text-muted">
                {separator || <ChevronRight className="h-3 w-3" />}
              </span>
            )}
            {isLast ? (
              <span className="font-medium text-text-primary" aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <a href={item.href} className="text-text-muted hover:text-cyan transition-colors">
                {item.label}
              </a>
            ) : (
              <button onClick={item.onClick} className="text-text-muted hover:text-cyan transition-colors">
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
