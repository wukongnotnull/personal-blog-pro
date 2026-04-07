"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/routing";

const socialLinks = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://twitter.com", label: "Twitter" },
];

export function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          {t("copyright", { year: currentYear })}
        </p>

        <nav className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/rss.xml"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            {t("rss")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
