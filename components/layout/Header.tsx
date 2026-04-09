"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Blog.
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            About
          </Link>
          <Link
            href="/search"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Search
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-sm text-text-muted hover:text-accent transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm text-text-muted hover:text-accent transition-colors"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
