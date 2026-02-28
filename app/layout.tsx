import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dillma — test AI moral reasoning",
  description:
    "A game where you pit AI models against moral dilemmas and discover how differently they reason.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-void text-slate-200 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-border px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-mono text-lg font-medium tracking-tight text-white hover:text-accent transition-colors">
              dillma
            </a>
            <a
              href="/leaderboard"
              className="text-sm text-muted hover:text-slate-200 transition-colors font-mono"
            >
              leaderboard
            </a>
          </header>
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
