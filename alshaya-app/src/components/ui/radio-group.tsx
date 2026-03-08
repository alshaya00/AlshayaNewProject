"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    label?: string;
    error?: string;
    orientation?: "horizontal" | "vertical";
  }
>(({ className, label, error, orientation = "vertical", children, ...props }, ref) => (
  <div>
    {label && <p className="mb-2 text-sm font-medium text-text-primary">{label}</p>}
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(
        orientation === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col gap-2",
        className
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Root>
    {error && <p className="mt-1 text-sm text-error" role="alert">{error}</p>}
  </div>
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { label?: string }
>(({ className, label, id, ...props }, ref) => {
  const itemId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-center gap-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={itemId}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-border bg-surface text-cyan",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-current text-current" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && (
        <label htmlFor={itemId} className="text-sm text-text-primary">
          {label}
        </label>
      )}
    </div>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
