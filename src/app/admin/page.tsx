import prisma from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { togglePublishPost } from './actions'

export default async function AdminDashboard() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Simple server action to delete post
  async function deletePost(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await prisma.post.delete({ where: { id } })
      revalidatePath('/admin')
      revalidatePath('/')
      revalidatePath('/[lang]', 'page')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Blog Posts</h2>
        <Link href="/admin/editor" style={{ background: 'var(--gold-accent)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}>
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p>No posts yet. Click "Create New Post" to get started.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{post.title}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    background: post.published ? '#e6f4ea' : '#fce8e6',
                    color: post.published ? '#137333' : '#c5221f'
                  }}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/editor?id=${post.id}`} style={{ color: '#1a73e8', textDecoration: 'none' }}>Edit</Link>
                  <form action={togglePublishPost}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="status" value={post.published.toString()} />
                    <button type="submit" style={{ color: post.published ? '#e6b800' : '#137333', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </form>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" style={{ color: '#c5221f', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
