"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, description, id, ...props }, ref) => {
  const switchId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-center justify-between gap-3">
      {(label || description) && (
        <div>
          {label && <label htmlFor={switchId} className="text-sm font-medium text-text-primary">{label}</label>}
          {description && <p className="text-xs text-text-muted">{description}</p>}
        </div>
      )}
      <SwitchPrimitive.Root
        ref={ref}
        id={switchId}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-cyan data-[state=unchecked]:bg-border",
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
            "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
            "rtl:data-[state=checked]:-translate-x-4"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;
