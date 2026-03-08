"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bell, Menu, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TopNavProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

export function TopNav({
  userName,
  userEmail,
  userAvatar,
  notificationCount = 0,
  onMenuClick,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
  className,
}: TopNavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-navy px-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded p-2 text-text-muted hover:bg-surface-hover hover:text-text-primary lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="relative hidden sm:block">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-border bg-surface ps-9 pe-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-cyan"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNotificationClick}
          className="relative rounded p-2 text-text-muted hover:bg-surface-hover hover:text-text-primary"
          aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute end-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md p-1.5 hover:bg-surface-hover">
              <Avatar src={userAvatar} fallback={userName || "U"} size="sm" />
              <div className="hidden text-start sm:block">
                <p className="text-sm font-medium text-text-primary">{userName}</p>
                <p className="text-xs text-text-muted">{userEmail}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onProfileClick}>My Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-error focus:text-error">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
