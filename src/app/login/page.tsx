'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Invalid username or password');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <form onSubmit={handleSubmit} style={{ 
        padding: '3rem', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: '8px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', color: 'var(--gold-accent)' }}>Admin Login</h1>
        
        {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}
            required
          />
        </div>
        
        <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '1rem' }}>
          Login
        </button>
      </form>
    </div>
  );
}
