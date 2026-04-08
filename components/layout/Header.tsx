"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/routing";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function Header() {
  const t = useTranslations("Navigation");
  const tAuth = useTranslations("Auth");
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
            {t("home")}
          </Link>
          <Link
            href="/blog"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            {t("blog")}
          </Link>
          <Link
            href="/about"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            {t("about")}
          </Link>
          <Link
            href="/search"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            {t("search")}
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-sm text-text-muted hover:text-accent transition-colors"
            >
              {tAuth("signOut")}
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm text-text-muted hover:text-accent transition-colors"
            >
              {tAuth("login")}
            </Link>
          )}
          <ThemeToggle />
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
