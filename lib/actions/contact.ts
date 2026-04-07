"use server";

import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

export async function submitContact(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string || undefined,
    message: formData.get("message") as string,
  };

  const validated = contactSchema.parse(rawData);

  await prisma.contact.create({
    data: {
      name: validated.name,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
    },
  });

  return { success: true };
}

export async function getContacts(status?: ContactStatus) {
  const where = status ? { status } : {};

  const contacts = await prisma.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return contacts;
}

export async function updateContactStatus(
  id: string,
  newStatus: ContactStatus
): Promise<void> {
  const data: { status: ContactStatus; repliedAt?: Date } = { status: newStatus };
  if (newStatus === "REPLIED") {
    data.repliedAt = new Date();
  }

  await prisma.contact.update({
    where: { id },
    data,
  });
}

export async function getUnreadContactCount() {
  const count = await prisma.contact.count({
    where: { status: "NEW" },
  });

  return count;
}
