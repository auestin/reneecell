import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CursorGlow from "@/components/ui/CursorGlow";
import { i18n, Locale, getDictionary } from "@/i18n";

export const metadata: Metadata = {
  title: "Rene Cell | Premium Skincare",
  description: "Advanced dermatological science for your skin.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dict = await getDictionary(lang);

  return (
    <html lang={resolvedParams.lang}>
      <body suppressHydrationWarning={true}>
        <CursorGlow />
        <Header dict={dict} />
        <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
          {children}
        </main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
