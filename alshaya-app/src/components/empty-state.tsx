import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && <div className="mb-4 text-text-muted">{icon}</div>}
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>}
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex gap-3">
          {actionLabel && (
            actionHref ? (
              <a href={actionHref}><Button variant="primary">{actionLabel}</Button></a>
            ) : (
              <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
            )
          )}
          {secondaryActionLabel && (
            <Button variant="ghost" onClick={onSecondaryAction}>{secondaryActionLabel}</Button>
          )}
        </div>
      )}
    </div>
  );
}
