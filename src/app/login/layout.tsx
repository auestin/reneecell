import "../globals.css";

export const metadata = {
  title: "Login - Rene Cell",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
