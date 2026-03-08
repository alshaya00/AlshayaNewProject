import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.fullName,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
