import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, handleAuthError } from "@/lib/auth/middleware";
import { normalizeArabicText } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "basic"; // basic | autocomplete

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const normalizedQuery = normalizeArabicText(query);

    if (type === "autocomplete") {
      const results = await prisma.familyMember.findMany({
        where: {
          deletedAt: null,
          OR: [
            { fullNameAr: { contains: normalizedQuery, mode: "insensitive" } },
            { fullNameEn: { contains: query, mode: "insensitive" } },
            { firstName: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          fullNameAr: true,
          fullNameEn: true,
          generation: true,
        },
        take: 10,
        orderBy: { fullNameAr: "asc" },
      });

      return NextResponse.json({ results });
    }

    // Basic search
    const results = await prisma.familyMember.findMany({
      where: {
        deletedAt: null,
        OR: [
          { fullNameAr: { contains: normalizedQuery, mode: "insensitive" } },
          { fullNameEn: { contains: query, mode: "insensitive" } },
          { firstName: { contains: query, mode: "insensitive" } },
          { fatherName: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        fullNameAr: true,
        fullNameEn: true,
        gender: true,
        status: true,
        generation: true,
        branch: true,
      },
      take: 50,
      orderBy: { fullNameAr: "asc" },
    });

    return NextResponse.json({
      results,
      count: results.length,
      query,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
