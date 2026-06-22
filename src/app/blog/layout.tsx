import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css';

export const metadata = {
  title: "Blog - Rene Cell",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* We reuse the components but pass a default dict or similar. Wait, Header requires a dict. 
            Since it's server-rendered and we don't have dict here, we'll just render children for now 
            or a simplified header. For simplicity, we just render children. */}
        <main style={{ flex: 1, backgroundColor: '#fff', color: '#333' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
