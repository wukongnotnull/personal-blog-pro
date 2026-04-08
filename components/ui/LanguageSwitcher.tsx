"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Language");
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locale === "en" ? "zh" : "en";
  const otherLocaleLabel = locale === "en" ? "中文" : "EN";

  function handleSwitch() {
    // With localePrefix: "never", pathname doesn't include locale
    // We need to prepend the other locale to the current path
    const newPathname = `/${otherLocale}${pathname}`;
    router.push(newPathname);
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
