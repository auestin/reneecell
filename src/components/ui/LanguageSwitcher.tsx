'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, Locale } from '@/i18n';
import { useState } from 'react';

const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '繁體中文',
  ja: '日本語',
  es: 'Español',
  kr: '한국어',
  'zh-CN': '简体中文',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
  th: 'ไทย',
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = i18n.locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) || i18n.defaultLocale;

  const switchLanguage = (newLocale: Locale) => {
    if (!pathname) return;
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale === '' ? '' : pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', zIndex: 50 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(200, 200, 200, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          fontWeight: 500,
          color: 'var(--text-primary)'
        }}
      >
        {localeNames[currentLocale as Locale]} ▾
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '0.5rem',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem',
          minWidth: '150px'
        }}>
          {i18n.locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              style={{
                background: currentLocale === locale ? 'rgba(0,0,0,0.05)' : 'transparent',
                border: 'none',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: currentLocale === locale ? 600 : 400,
                color: 'var(--text-primary)'
              }}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
