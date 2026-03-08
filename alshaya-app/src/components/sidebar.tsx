"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function Sidebar({ items, collapsed = false, onToggle, className }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {!collapsed && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onToggle} />
      )}
      <aside
        className={cn(
          "fixed start-0 top-0 z-40 flex h-full flex-col border-e border-border bg-navy transition-all duration-200",
          "lg:sticky lg:top-0 lg:z-auto",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && <span className="text-lg font-bold text-cyan">آل شايع</span>}
          {onToggle && (
            <button
              onClick={onToggle}
              className="rounded p-1 text-text-muted hover:bg-surface-hover hover:text-text-primary"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={item.onClick}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                item.active
                  ? "bg-cyan/10 text-cyan font-medium"
                  : "text-text-muted hover:bg-surface-hover hover:text-text-primary",
                collapsed && "justify-center px-2"
              )}
            >
              {item.icon}
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <Badge variant="info" size="sm">{item.badge}</Badge>
              )}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
