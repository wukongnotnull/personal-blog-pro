"use client";

import Link from "next/link";

const socialLinks = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://twitter.com", label: "Twitter" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          © {currentYear} Personal Blog. All rights reserved.
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
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}
