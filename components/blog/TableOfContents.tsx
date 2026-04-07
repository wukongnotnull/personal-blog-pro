"use client";

import { useState, useEffect } from "react";
import { type Heading } from "@/types";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="text-sm">
      <h3 className="font-semibold mb-4 text-text">On this page</h3>
      <ul className="space-y-2 border-l border-border">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "ml-3" : ""}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors ${
                heading.level === 3 ? "text-xs" : "text-sm"
              } ${
                activeId === heading.id
                  ? "text-accent border-l-2 border-accent -ml-[2px]"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
