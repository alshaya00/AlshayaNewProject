import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, requireAdmin, handleAuthError } from "@/lib/auth/middleware";
import { createMemberSchema, searchMembersSchema } from "@/lib/validations/member";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const params = searchMembersSchema.parse({
      query: searchParams.get("query") || undefined,
      gender: searchParams.get("gender") || undefined,
      status: searchParams.get("status") || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || "asc",
    });

    const where: Record<string, unknown> = {
      deletedAt: null,
    };

    if (params.query) {
      where.OR = [
        { fullNameAr: { contains: params.query, mode: "insensitive" } },
        { fullNameEn: { contains: params.query, mode: "insensitive" } },
        { firstName: { contains: params.query, mode: "insensitive" } },
      ];
    }
    if (params.gender) where.gender = params.gender;
    if (params.status) where.status = params.status;

    const [members, total] = await Promise.all([
      prisma.familyMember.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder } : { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          fullNameAr: true,
          fullNameEn: true,
          gender: true,
          status: true,
          generation: true,
          branch: true,
          createdAt: true,
        },
      }),
      prisma.familyMember.count({ where }),
    ]);

    return NextResponse.json({
      members,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const body = await request.json();
    const parsed = createMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Generate next member ID
    const lastMember = await prisma.familyMember.findFirst({
      where: { id: { startsWith: "P" } },
      orderBy: { id: "desc" },
      select: { id: true },
    });

    const nextNum = lastMember
      ? parseInt(lastMember.id.replace("P", ""), 10) + 1
      : 1;
    const newId = `P${String(nextNum).padStart(4, "0")}`;

    const { fatherId, ...memberData } = parsed.data;

    const member = await prisma.familyMember.create({
      data: {
        id: newId,
        ...memberData,
        ...(fatherId ? { father: { connect: { id: fatherId } } } : {}),
      },
    });

    // Create audit record
    await prisma.changeHistory.create({
      data: {
        memberId: member.id,
        changedBy: user.id,
        changedAt: new Date(),
        fieldName: "CREATED",
        oldValue: null,
        newValue: JSON.stringify(member),
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
