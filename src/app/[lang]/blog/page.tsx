import { getDictionary, Locale } from '@/i18n';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function BlogListPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dict = await getDictionary(lang);

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <section style={{ padding: '5rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          {dict.home.blogTitle}
        </h1>
        <Link href={`/${resolvedParams.lang}`} style={{ color: 'var(--gold-accent)', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </section>

      <section style={{ marginTop: '5rem', padding: '0 5%' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{dict.home.noPosts}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {posts.map((post) => {
              let displayTitle = post.title;
              let displayContent = post.content;
              try {
                const translations = JSON.parse(post.translations || '{}');
                if (translations[resolvedParams.lang]) {
                  displayTitle = translations[resolvedParams.lang].title;
                  displayContent = translations[resolvedParams.lang].content;
                }
              } catch (e) {}

              return (
              <div key={post.id} className="glass-panel hover-lift" style={{ overflow: 'hidden', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                {post.coverImage ? (
                  <div style={{ width: '100%', height: '250px', position: 'relative', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={post.coverImage} alt={displayTitle} fill style={{ objectFit: 'contain', padding: '10px' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '250px', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '1.5rem', opacity: 0.8 }}>Rene Cell</span>
                  </div>
                )}
                
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', lineHeight: 1.3 }}>
                    {displayTitle}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {displayContent.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                  </p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <Link href={`/blog/${post.slug}`} className="btn-ghost" style={{ textDecoration: 'none', display: 'inline-block' }}>
                      {dict.home.readMore}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </section>
    </div>
  );
}
