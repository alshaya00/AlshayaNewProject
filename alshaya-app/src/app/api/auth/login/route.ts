import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ message: "Account is not active" }, { status: 403 });
    }

    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      return NextResponse.json({ message: "Account is temporarily locked. Try again later." }, { status: 423 });
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: { increment: 1 },
          ...(user.failedLoginAttempts >= 4 ? {
            accountLockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 min lockout
          } : {}),
        },
      });

      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Reset failed attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
      },
    });

    const ip = request.headers.get("x-forwarded-for") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    await createSession(user.id, rememberMe, ip, userAgent);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
