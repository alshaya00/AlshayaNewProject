import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const SESSION_COOKIE = "alshaya_session";
const SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds
const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function createSession(userId: string, rememberMe: boolean = false, ip?: string, userAgent?: string) {
  const token = uuidv4();
  const maxAge = rememberMe ? REMEMBER_ME_MAX_AGE : SESSION_MAX_AGE;
  const expiresAt = new Date(Date.now() + maxAge * 1000);

  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
      ipAddress: ip || null,
      userAgent: userAgent || null,
      rememberMe,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function deleteAllUserSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}
