"use client";

import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  size?: "sm" | "md";
  locale?: string;
}

export function TagBadge(props: TagBadgeProps) {
  const { tag, size = "md", locale = "en" } = props;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  const href = "/" + locale + "/tag/" + tag.toLowerCase();

  return (
    <Link
      href={href}
      locale={false}
      className={"inline-flex items-center rounded-full bg-surface border border-border text-text-muted hover:text-accent hover:border-accent transition-colors " + sizeClasses}
    >
      #{tag}
    </Link>
  );
}
