"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Language");
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locale === "en" ? "zh" : "en";

  // With localePrefix: "as-needed", pathname includes locale prefix when not default
  // So we need to strip the current locale prefix if present
  const getLocaleFromPath = (path: string): string | null => {
    const segments = path.split("/").filter(Boolean);
    const first = segments[0];
    if (first === "en" || first === "zh") {
      return first;
    }
    return null;
  };

  function handleSwitch() {
    const pathLocale = getLocaleFromPath(pathname);

    if (pathLocale) {
      // Replace locale in path
      const segments = pathname.split("/");
      segments[1] = otherLocale;
      const newPath = segments.join("/");
      router.push(newPath);
    } else {
      // No locale in path, prepend the other locale
      router.push(`/${otherLocale}${pathname}`);
    }
  }

  const otherLocaleLabel = locale === "en" ? "中文" : "EN";

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
