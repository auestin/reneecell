const fs = require('fs');
const path = require('path');

const dictsDir = path.join(__dirname, '../src/dictionaries');
const files = fs.readdirSync(dictsDir);

const translations = {
  'en.json': 'View All Posts',
  'zh.json': '查看更多文章',
  'zh-CN.json': '查看更多文章',
  'ja.json': 'すべての記事を見る',
  'es.json': 'Ver todos los artículos',
  'kr.json': '모든 게시물 보기',
  'id.json': 'Lihat Semua Artikel',
  'vi.json': 'Xem tất cả bài viết',
  'th.json': 'ดูบทความทั้งหมด'
};

files.forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(dictsDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (content.home) {
      content.home.viewAllPosts = translations[file] || 'View All Posts';
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      console.log(`Updated ${file}`);
    }
  }
});
