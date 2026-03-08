import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Edit, Trash2, Users } from "lucide-react";

export interface MemberCardProps {
  name: string;
  relation?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  gender?: "male" | "female";
  status?: "active" | "deceased";
  childrenCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
}

export function MemberCard({
  name,
  relation,
  email,
  phone,
  location,
  avatar,
  gender,
  status = "active",
  childrenCount,
  onEdit,
  onDelete,
  onClick,
  className,
}: MemberCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-4 transition-colors",
        onClick && "cursor-pointer hover:bg-surface-hover",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start gap-3">
        <Avatar src={avatar} fallback={name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary truncate">{name}</h3>
            {status === "deceased" && <Badge variant="neutral" size="sm">Deceased</Badge>}
            {gender && (
              <Badge variant={gender === "male" ? "info" : "warning"} size="sm">
                {gender === "male" ? "M" : "F"}
              </Badge>
            )}
          </div>
          {relation && <p className="text-sm text-text-muted">{relation}</p>}
          <div className="mt-2 flex flex-col gap-1">
            {email && (
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Mail className="h-3 w-3" /><span className="truncate">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Phone className="h-3 w-3" /><span>{phone}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <MapPin className="h-3 w-3" /><span>{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {(childrenCount !== undefined || onEdit || onDelete) && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          {childrenCount !== undefined && (
            <span className="flex items-center gap-1 text-sm text-text-muted">
              <Users className="h-3 w-3" /> {childrenCount} children
            </span>
          )}
          <div className="flex gap-2 ms-auto">
            {onEdit && (
              <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1 text-text-muted hover:text-cyan transition-colors">
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-text-muted hover:text-error transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
