import { NextResponse } from "next/server";
import { getSession } from "./session";

export type UserRole = "MEMBER" | "BRANCH_LEADER" | "ADMIN" | "SUPER_ADMIN";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await getSession();

  if (!session || !session.user) {
    throw new AuthError("Not authenticated", 401);
  }

  return {
    id: session.user.id,
    email: session.user.email,
    fullName: session.user.fullName,
    role: session.user.role as UserRole,
  };
}

export async function requireRole(...roles: UserRole[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    throw new AuthError("Insufficient permissions", 403);
  }

  return user;
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  return requireRole("ADMIN", "SUPER_ADMIN");
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}

export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  console.error("Unexpected error:", error);
  return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}
