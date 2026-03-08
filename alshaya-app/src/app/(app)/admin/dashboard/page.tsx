"use client";

import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";

import { Users, Shield, AlertTriangle, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">لوحة التحكم - Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value="0" icon={<Users className="h-5 w-5" />} color="cyan" />
        <StatsCard title="Active Sessions" value="0" icon={<Activity className="h-5 w-5" />} color="success" />
        <StatsCard title="Pending Items" value="0" icon={<AlertTriangle className="h-5 w-5" />} color="warning" />
        <StatsCard title="Security Issues" value="0" icon={<Shield className="h-5 w-5" />} color="error" />
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Audit Logs</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: "action", label: "Action" },
              { key: "user", label: "User" },
              { key: "resource", label: "Resource" },
              { key: "timestamp", label: "Time" },
            ]}
            data={[]}
            emptyMessage="No audit logs yet"
          />
        </CardContent>
      </Card>
    </div>
  );
}
