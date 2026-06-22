import { NextResponse } from 'next/server';
import { generateAndSaveTranslations } from '@/lib/translations';
import prisma from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany({ where: { published: true } });
  
  for (const post of posts) {
    let needsTranslation = false;
    try {
      const parsed = JSON.parse(post.translations || "{}");
      if (!parsed.en || !parsed.ja) needsTranslation = true;
    } catch(e) {
      needsTranslation = true;
    }

    if (needsTranslation) {
      console.log(`Translating: ${post.id}`);
      await generateAndSaveTranslations(post.id);
    }
  }

  return NextResponse.json({ success: true });
}
