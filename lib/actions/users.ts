"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(["ADMIN", "EDITOR", "AUTHOR", "SUBSCRIBER"]),
  password: z.string().min(6).optional(),
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function createUser(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const session = await requireAdmin();

  const rawData = {
    email: formData.get("email") as string,
    name: formData.get("name") as string || undefined,
    role: formData.get("role") as string,
    password: formData.get("password") as string || undefined,
  };

  const validated = userSchema.parse(rawData);

  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existing) {
    return { error: "Email already exists" };
  }

  let passwordHash: string | null = null;
  if (validated.password) {
    passwordHash = await bcrypt.hash(validated.password, 12);
  }

  await prisma.user.create({
    data: {
      email: validated.email,
      name: validated.name,
      role: validated.role as Role,
      passwordHash,
    },
  });

  return { success: true };
}

export async function updateUser(
  id: string,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const session = await requireAdmin();

  const rawData = {
    email: formData.get("email") as string,
    name: formData.get("name") as string || undefined,
    role: formData.get("role") as string,
    password: formData.get("password") as string || undefined,
  };

  const validated = userSchema.parse(rawData);

  // Check if email already exists for another user
  const existing = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existing && existing.id !== id) {
    return { error: "Email already exists" };
  }

  const data: {
    email: string;
    name?: string | null;
    role: Role;
    passwordHash?: string | null;
  } = {
    email: validated.email,
    name: validated.name || null,
    role: validated.role as Role,
  };

  if (validated.password) {
    data.passwordHash = await bcrypt.hash(validated.password, 12);
  }

  await prisma.user.update({
    where: { id },
    data,
  });

  return { success: true };
}

export async function deleteUser(
  id: string
): Promise<void> {
  const session = await requireAdmin();

  // Prevent deleting yourself
  if (session.user.id === id) {
    throw new Error("Cannot delete yourself");
  }

  await prisma.user.delete({
    where: { id },
  });
}

export async function getUsers() {
  await requireAdmin();

  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: { posts: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string) {
  await requireAdmin();

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}
