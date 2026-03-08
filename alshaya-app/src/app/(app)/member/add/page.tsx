"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Breadcrumb } from "@/components/breadcrumb";

export default function AddMemberPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      fatherName: formData.get("fatherName"),
      grandfatherName: formData.get("grandfatherName"),
      familyName: formData.get("familyName") || "آل شايع",
      fullNameAr: formData.get("fullNameAr"),
      fullNameEn: formData.get("fullNameEn"),
      gender: formData.get("gender"),
      birthYear: formData.get("birthYear") ? Number(formData.get("birthYear")) : null,
      status: formData.get("status") || "Living",
      phone: formData.get("phone") || null,
      email: formData.get("email") || null,
      generation: formData.get("generation") ? Number(formData.get("generation")) : null,
      notes: formData.get("notes") || null,
    };

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create member");
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: "Home", href: "/dashboard" },
        { label: "Members" },
        { label: "Add Member" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary">إضافة عضو - Add Member</h1>

      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="error" title="Error" description={error} className="mb-4" />}
          {success && <Alert variant="success" title="Success" description="Member added successfully!" className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="firstName" label="First Name (الاسم الأول)" required />
              <Input name="fatherName" label="Father Name (اسم الأب)" />
              <Input name="grandfatherName" label="Grandfather Name (اسم الجد)" />
              <Input name="familyName" label="Family Name" defaultValue="آل شايع" />
              <Input name="fullNameAr" label="Full Name (Arabic)" dir="rtl" />
              <Input name="fullNameEn" label="Full Name (English)" dir="ltr" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Gender</label>
                <Select name="gender" required>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male (ذكر)</SelectItem>
                    <SelectItem value="Female">Female (أنثى)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input name="birthYear" label="Birth Year" type="number" placeholder="e.g. 1990" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Status</label>
                <Select name="status" defaultValue="Living">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Living">Living (حي)</SelectItem>
                    <SelectItem value="Deceased">Deceased (متوفى)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input name="phone" label="Phone" type="tel" placeholder="+966..." />
              <Input name="email" label="Email" type="email" />
              <Input name="generation" label="Generation" type="number" placeholder="1-20" />
            </div>

            <Textarea name="notes" label="Notes" placeholder="Additional notes..." />

            <div className="flex gap-3">
              <Button type="submit" loading={loading}>Add Member</Button>
              <Button type="reset" variant="ghost">Reset</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
