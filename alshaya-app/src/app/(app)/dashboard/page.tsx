"use client";

import { useAuth } from "@/contexts/auth-context";
import { StatsCard } from "@/components/stats-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GitBranch, BookOpen, ImageIcon, Plus, Search, Upload } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          مرحباً، {user?.fullName}
        </h1>
        <p className="mt-1 text-text-muted">Welcome to Al-Shaya Family Tree Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Members"
          value="0"
          icon={<Users className="h-5 w-5" />}
          color="cyan"
          description="Family members"
        />
        <StatsCard
          title="Generations"
          value="0"
          icon={<GitBranch className="h-5 w-5" />}
          color="purple"
          description="Tree depth"
        />
        <StatsCard
          title="Journals"
          value="0"
          icon={<BookOpen className="h-5 w-5" />}
          color="success"
          description="Published stories"
        />
        <StatsCard
          title="Photos"
          value="0"
          icon={<ImageIcon className="h-5 w-5" />}
          color="warning"
          description="Uploaded images"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/member/add">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" /> Add Member
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" /> Search Members
              </Button>
            </Link>
            <Link href="/tree">
              <Button variant="ghost" size="sm">
                <GitBranch className="h-4 w-4" /> View Tree
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <Upload className="h-4 w-4" /> Import Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted">No recent activity to display.</p>
        </CardContent>
      </Card>
    </div>
  );
}
