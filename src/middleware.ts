import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n';

function getLocale(request: NextRequest): string {
  // Try to get locale from cookie or accept-language header
  // For now, default to 'en'
  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Skip Next.js internal requests, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/uploads') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
