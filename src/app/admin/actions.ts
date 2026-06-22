'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function togglePublishPost(formData: FormData) {
  const id = formData.get('id') as string;
  const currentStatus = formData.get('status') === 'true';

  if (!id) return;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return;

  // If publishing, check translations and generate if missing
  if (!currentStatus) {
    const { generateAndSaveTranslations } = await import("@/lib/translations");
    await generateAndSaveTranslations(post.id);
  }

  await prisma.post.update({
    where: { id },
    data: { published: !currentStatus }
  });

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/[lang]', 'page');
}
