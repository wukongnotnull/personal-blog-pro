"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Language");
  const router = useRouter();

  const otherLocale = locale === "en" ? "zh" : "en";
  const otherLocaleLabel = locale === "en" ? "中文" : "EN";

  function handleSwitch() {
    // Get current pathname from window location
    const pathname = window.location.pathname;

    let newPath: string;

    if (locale === "en") {
      // Switching from English to Chinese: add /zh prefix
      newPath = `/zh${pathname}`;
    } else {
      // Switching from Chinese to English: remove /zh prefix
      // pathname could be /zh, /zh/blog, /zh/tag/xxx, etc.
      newPath = pathname.replace(/^\/zh/, "") || "/";
      if (newPath === "") newPath = "/";
    }

    router.push(newPath);
  }

  return (
    <button
      onClick={handleSwitch}
      aria-label={t("switchLanguage")}
      className="text-sm text-text-muted hover:text-accent transition-colors"
    >
      {otherLocaleLabel}
    </button>
  );
}
