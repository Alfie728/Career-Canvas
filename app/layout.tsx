import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Career Canvas",
  description: "Create your career roadmap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@901&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <header className="p-4 flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <span className="logo-text font-bold text-2xl tracking-wide">
                  Career Canvas
                </span>
              </Link>
              <ThemeToggle />
            </header>
            <main className="flex-grow">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
