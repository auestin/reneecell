import prisma from "@/lib/prisma";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from 'zod';

export async function generateAndSaveTranslations(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return;

  let hasTranslations = false;
  try {
    const parsed = JSON.parse(post.translations || "{}");
    if (parsed.en && parsed.ja) {
      hasTranslations = true;
    }
  } catch(e) {}

  if (!hasTranslations) {
    console.log('Generating translations for post:', post.id);
    try {
      const { object: translated } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: z.object({
          en: z.object({ title: z.string(), content: z.string() }),
          ja: z.object({ title: z.string(), content: z.string() }),
          es: z.object({ title: z.string(), content: z.string() }),
          kr: z.object({ title: z.string(), content: z.string() }),
          id: z.object({ title: z.string(), content: z.string() }),
          vi: z.object({ title: z.string(), content: z.string() }),
          th: z.object({ title: z.string(), content: z.string() }),
          'zh-CN': z.object({ title: z.string(), content: z.string() }),
          zh: z.object({ title: z.string(), content: z.string() })
        }),
        prompt: `Translate the following blog post from Traditional Chinese into the requested languages. Maintain markdown formatting exactly.
Original Title: ${post.title}
Original Content: ${post.content}`
      });

      await prisma.post.update({
        where: { id: postId },
        data: { translations: JSON.stringify(translated) }
      });
      console.log('Translations successfully saved.');
    } catch (err) {
      console.error('Translation failed', err);
    }
  }
}
