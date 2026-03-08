"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  label?: string;
  showPercentage?: boolean;
  color?: "cyan" | "green" | "orange" | "red";
}

const colorStyles = {
  cyan: "bg-cyan",
  green: "bg-success",
  orange: "bg-warning",
  red: "bg-error",
};

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, label, showPercentage, color = "cyan", ...props }, ref) => (
  <div className="w-full">
    {(label || showPercentage) && (
      <div className="mb-1 flex justify-between text-sm">
        {label && <span className="text-text-primary">{label}</span>}
        {showPercentage && <span className="text-text-muted">{value ?? 0}%</span>}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-navy-light", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full transition-all duration-300", colorStyles[color])}
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;
