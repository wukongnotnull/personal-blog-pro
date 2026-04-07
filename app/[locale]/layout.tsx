import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/routing";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProviders } from "@/components/auth/AuthProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zh")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <AuthProviders>
            <NextIntlClientProvider messages={messages}>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </NextIntlClientProvider>
          </AuthProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
