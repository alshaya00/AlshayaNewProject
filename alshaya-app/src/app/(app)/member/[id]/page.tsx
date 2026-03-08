"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/breadcrumb";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Edit, Users, ImageIcon, BookOpen } from "lucide-react";

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: "Home", href: "/dashboard" },
        { label: "Members" },
        { label: `Member ${params.id}` },
      ]} />

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar fallback="Member" size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text-primary">Member {params.id}</h1>
                <Badge variant="success">Living</Badge>
              </div>
              <p className="text-text-muted">Generation 1 - آل شايع</p>
            </div>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="journals">Journals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Member Details</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">Member details will be loaded here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relations">
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={<Users className="h-12 w-12" />}
                title="No relations found"
                description="Add family relations for this member"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={<ImageIcon className="h-12 w-12" />}
                title="No photos"
                description="Upload photos for this member"
                actionLabel="Upload Photo"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journals">
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={<BookOpen className="h-12 w-12" />}
                title="No journals"
                description="Write a journal entry about this member"
                actionLabel="Add Journal"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
