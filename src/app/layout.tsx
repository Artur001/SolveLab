import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolveLab | Dein Mathe Workspace",
  description: "Ein moderner, interaktiver Mathematik-Workspace für Schule und Studium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        />
      </head>
      <body className={`${inter.className} h-screen flex overflow-hidden`}>
        <LanguageProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background p-6">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
