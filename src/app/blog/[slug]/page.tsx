import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Configure react-markdown if needed, or just dangerouslySetInnerHTML for now
import ReactMarkdown from 'react-markdown';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <Link href="/" style={{ color: 'var(--gold-accent)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        ← 回到首頁 (Back to Home)
      </Link>
      
      {post.coverImage && (
        <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
        </div>
      )}
      
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          {post.title}
        </h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          發布時間：{new Date(post.createdAt).toLocaleDateString()}
        </div>
      </header>
      
      <div className="blog-content" style={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#444' }}>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
