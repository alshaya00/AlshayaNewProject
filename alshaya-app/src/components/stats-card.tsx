import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  color?: "cyan" | "purple" | "success" | "warning" | "error";
  className?: string;
}

const colorStyles = {
  cyan: "bg-cyan/10 text-cyan",
  purple: "bg-purple/10 text-purple",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
};

export function StatsCard({ title, value, description, icon, trend, color = "cyan", className }: StatsCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted">{title}</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{value}</p>
        </div>
        {icon && (
          <div className={cn("rounded-lg p-3", colorStyles[color])}>
            {icon}
          </div>
        )}
      </div>
      {(trend || description) && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          {trend && (
            <span className={cn("flex items-center gap-1 font-medium", trend.value >= 0 ? "text-success" : "text-error")}>
              {trend.value >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && <span className="text-text-muted">{description}</span>}
        </div>
      )}
    </div>
  );
}
