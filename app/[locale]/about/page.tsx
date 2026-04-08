import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <section className="py-section">
      <Container>
        <div className="max-w-prose">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
            {t("title")}
          </h1>

          <div className="prose prose-lg">
            <p>{t("hello")}</p>

            <h2>{t("background")}</h2>
            <p>{t("backgroundText")}</p>

            <h2>{t("whatIWriteAbout")}</h2>
            <ul>
              <li>{t("topics.webDev")}</li>
              <li>{t("topics.tooling")}</li>
              <li>{t("topics.architecture")}</li>
              <li>{t("topics.career")}</li>
            </ul>

            <h2>{t("getInTouch")}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: t("getInTouchText", {
                  twitter:
                    '<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>',
                  github:
                    '<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>',
                }),
              }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
