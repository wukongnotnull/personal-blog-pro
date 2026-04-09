"use client";

import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  size?: "sm" | "md";
}

export function TagBadge(props: TagBadgeProps) {
  const { tag, size = "md" } = props;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  const href = "/tag/" + tag.toLowerCase();

  return (
    <Link
      href={href}
      className={"inline-flex items-center rounded-full bg-surface border border-border text-text-muted hover:text-accent hover:border-accent transition-colors " + sizeClasses}
    >
      #{tag}
    </Link>
  );
}
