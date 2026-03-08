import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, requireAdmin, handleAuthError } from "@/lib/auth/middleware";
import { updateMemberSchema } from "@/lib/validations/member";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const member = await prisma.familyMember.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        father: { select: { id: true, fullNameAr: true, fullNameEn: true } },
        children: {
          where: { deletedAt: null },
          select: { id: true, fullNameAr: true, fullNameEn: true, gender: true, status: true },
        },
        photos: { where: { isPublic: true }, take: 10 },
        journals: { where: { status: "PUBLISHED" }, take: 5 },
      },
    });

    if (!member) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAdmin();

    const body = await request.json();
    const parsed = updateMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.familyMember.findUnique({
      where: { id: params.id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    const member = await prisma.familyMember.update({
      where: { id: params.id },
      data: parsed.data,
    });

    // Track changes
    for (const [key, value] of Object.entries(parsed.data)) {
      const oldVal = (existing as Record<string, unknown>)[key];
      if (JSON.stringify(oldVal) !== JSON.stringify(value)) {
        await prisma.changeHistory.create({
          data: {
            memberId: member.id,
            changedBy: user.id,
            changedAt: new Date(),
            fieldName: key,
            oldValue: oldVal != null ? String(oldVal) : null,
            newValue: value != null ? String(value) : null,
          },
        });
      }
    }

    return NextResponse.json({ member });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAdmin();

    const existing = await prisma.familyMember.findUnique({
      where: { id: params.id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    // Soft delete
    await prisma.familyMember.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        deletedBy: user.id,
      },
    });

    await prisma.changeHistory.create({
      data: {
        memberId: params.id,
        changedBy: user.id,
        changedAt: new Date(),
        fieldName: "DELETED",
        oldValue: JSON.stringify(existing),
        newValue: null,
      },
    });

    return NextResponse.json({ message: "Member deleted" });
  } catch (error) {
    return handleAuthError(error);
  }
}
