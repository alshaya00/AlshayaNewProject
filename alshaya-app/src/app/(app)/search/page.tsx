"use client";

import * as React from "react";
import { SearchInput } from "@/components/search-input";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = React.useState("");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">البحث - Search</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search members by name..."
              className="flex-1"
            />
            <Select>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Living">Living</SelectItem>
                <SelectItem value="Deceased">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-8">
          <EmptyState
            icon={<Search className="h-12 w-12" />}
            title="Search for family members"
            description="Enter a name or use filters to find family members"
          />
        </CardContent>
      </Card>
    </div>
  );
}
