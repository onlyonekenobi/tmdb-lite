import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SearchBar } from "../components/search-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TMDB Lite",
  description:
    "A fast, ad-free TMDb-powered search for movies, TV, and people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-zinc-950 text-zinc-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-950 text-zinc-50`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-zinc-900 bg-black/80 px-4 py-3 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <Link href="/" className="flex items-baseline gap-2">
                <span className="text-lg font-semibold tracking-tight">
                  TMDB<span className="text-zinc-400">Lite</span>
                </span>
                <span className="hidden text-xs text-zinc-500 sm:inline">
                  Fast, ad-free search for movies, TV & people
                </span>
              </Link>
              <SearchBar />
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6">
            {children}
          </main>
          <footer className="border-t border-zinc-900 px-4 py-4 text-xs text-zinc-500">
            <div className="mx-auto flex max-w-5xl justify-between gap-4">
              <span>Data provided by TMDb.</span>
              <span className="text-right">
                This product uses the TMDb API but is not endorsed or certified
                by TMDb.
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

