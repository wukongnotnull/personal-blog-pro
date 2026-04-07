"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
});

export async function subscribe(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    name: formData.get("name") as string || undefined,
    source: formData.get("source") as string || undefined,
  };

  const validated = subscribeSchema.parse(rawData);

  // Generate unsubscribe token
  const token = crypto.randomUUID();

  const subscriber = await prisma.newsletter.upsert({
    where: { email: validated.email },
    update: {
      status: "ACTIVE",
      unsubscribedAt: null,
      token,
    },
    create: {
      email: validated.email,
      name: validated.name,
      source: validated.source,
      token,
    },
  });

  // TODO: Send confirmation email

  return { success: true, email: subscriber.email };
}

export async function unsubscribe(token: string) {
  const subscriber = await prisma.newsletter.findUnique({
    where: { token },
  });

  if (!subscriber) {
    return { error: "Invalid token" };
  }

  await prisma.newsletter.update({
    where: { id: subscriber.id },
    data: {
      status: "UNSUBSCRIBED",
      unsubscribedAt: new Date(),
    },
  });

  return { success: true };
}

export async function getSubscribers() {
  const subscribers = await prisma.newsletter.findMany({
    where: { status: "ACTIVE" },
    orderBy: { subscribedAt: "desc" },
  });

  return subscribers;
}

export async function getSubscriberStats() {
  const [total, active, unsubscribed] = await Promise.all([
    prisma.newsletter.count(),
    prisma.newsletter.count({ where: { status: "ACTIVE" } }),
    prisma.newsletter.count({ where: { status: "UNSUBSCRIBED" } }),
  ]);

  return { total, active, unsubscribed };
}
