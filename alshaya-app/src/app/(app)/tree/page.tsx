"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { GitBranch, ZoomIn, ZoomOut, Maximize } from "lucide-react";

export default function TreePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">شجرة العائلة - Family Tree</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm"><ZoomIn className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Maximize className="h-4 w-4" /></Button>
        </div>
      </div>
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={<GitBranch className="h-16 w-16" />}
            title="Family Tree Visualization"
            description="Add family members to visualize the tree. D3.js visualization will render here."
            actionLabel="Add First Member"
            actionHref="/member/add"
          />
        </CardContent>
      </Card>
    </div>
  );
}
