"use client";

import * as React from "react";
import { Sidebar, type SidebarItem } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { useAuth } from "@/contexts/auth-context";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  LayoutDashboard,
  GitBranch,
  Search,
  Users,
  ImageIcon,
  BookOpen,
  Calendar,
  Megaphone,
  User,
  Settings,
  HelpCircle,
  Shield,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading..." />;
  }

  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return <LoadingSpinner fullScreen label="Redirecting..." />;
  }

  const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard", active: pathname === "/dashboard" },
    { label: "Family Tree", icon: <GitBranch className="h-5 w-5" />, href: "/tree", active: pathname.startsWith("/tree") },
    { label: "Search", icon: <Search className="h-5 w-5" />, href: "/search", active: pathname.startsWith("/search") },
    { label: "Members", icon: <Users className="h-5 w-5" />, href: "/member/add", active: pathname.startsWith("/member") },
    { label: "Gallery", icon: <ImageIcon className="h-5 w-5" />, href: "/gallery", active: pathname.startsWith("/gallery") },
    { label: "Journals", icon: <BookOpen className="h-5 w-5" />, href: "/journals", active: pathname.startsWith("/journals") },
    { label: "Events", icon: <Calendar className="h-5 w-5" />, href: "/events", active: pathname.startsWith("/events") },
    { label: "Broadcasts", icon: <Megaphone className="h-5 w-5" />, href: "/broadcasts", active: pathname.startsWith("/broadcasts") },
    { label: "My Profile", icon: <User className="h-5 w-5" />, href: "/profile", active: pathname.startsWith("/profile") },
    { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/settings", active: pathname.startsWith("/settings") },
    ...(isAdmin ? [{ label: "Admin", icon: <Shield className="h-5 w-5" />, href: "/admin/dashboard", active: pathname.startsWith("/admin") }] : []),
    { label: "Help", icon: <HelpCircle className="h-5 w-5" />, href: "/help", active: pathname.startsWith("/help") },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-1 flex-col">
        <TopNav
          userName={user.fullName}
          userEmail={user.email}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={logout}
          onProfileClick={() => router.push("/profile")}
          onSettingsClick={() => router.push("/settings")}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
