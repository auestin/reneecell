const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1615397323196-857e51fbb377?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556228720-1c2be2414d8c?q=80&w=1600&auto=format&fit=crop'
];

async function main() {
  console.log('Generating 10 test posts...');
  
  for (let i = 1; i <= 10; i++) {
    const coverImage = UNSPLASH_IMAGES[Math.floor(Math.random() * UNSPLASH_IMAGES.length)];
    const title = `測試文章 - Rene Cell 保養秘訣 ${i}`;
    const slug = `test-post-rene-cell-${Date.now()}-${i}`;
    const content = `## 這是測試文章 ${i}

Rene Cell 致力於提供最頂級的臉部保養體驗。這是一篇測試文章的內容，用來確認首頁的排版與分頁按鈕是否正常運作。

* 重點一：深層修復
* 重點二：逆齡抗老
* 重點三：保濕鎖水

感謝您的閱讀，這僅是測試用的假文。這僅是測試用的假文。這僅是測試用的假文。這僅是測試用的假文。這僅是測試用的假文。這僅是測試用的假文。這僅是測試用的假文。`;

    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage,
        published: true, // We publish them directly for testing
        translations: "{}"
      }
    });
    console.log(`Created post ${i}/10`);
  }
  
  console.log('Finished generating 10 posts.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
