'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
          setCoverImage(data.coverImage || '');
          setPublished(data.published);
        });
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setCoverImage(data.url);
    } else {
      alert('Upload failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const postData = { title, slug, content, coverImage, published };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/posts/${id}` : '/api/posts';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });

    setIsSaving(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      alert('Failed to save post');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>{id ? 'Edit Post' : 'Create New Post'}</h2>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Slug (URL identifier)</label>
          <input 
            type="text" 
            value={slug} 
            onChange={e => setSlug(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="e.g. new-product-launch"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cover Image</label>
          {coverImage && (
            <div style={{ marginBottom: '1rem', position: 'relative', width: '200px', height: '120px' }}>
              <Image src={coverImage} alt="Cover" fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Content (Markdown Supported)</label>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            required 
            rows={15}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'monospace' }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={published} 
              onChange={e => setPublished(e.target.checked)} 
              style={{ width: '1.2rem', height: '1.2rem' }}
            />
            Publish immediately
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" disabled={isSaving} style={{ background: 'var(--gold-accent)', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
          <button type="button" onClick={() => router.push('/admin')} style={{ background: '#eee', color: '#333', border: 'none', padding: '0.8rem 2rem', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
