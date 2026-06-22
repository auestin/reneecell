import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import "../globals.css"

export const metadata = {
  title: "Rene Cell Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <html lang="en">
      <body style={{ margin: 0 }} suppressHydrationWarning>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <header style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#111', 
            color: '#fff', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-accent)' }}>
              Rene Cell Admin
            </div>
            <nav style={{ display: 'flex', gap: '2rem' }}>
              <Link href="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Posts</Link>
              <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>View Site ↗</Link>
            </nav>
          </header>
          
          <main style={{ flex: 1, backgroundColor: '#f5f5f5', padding: '2rem', color: '#333' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
