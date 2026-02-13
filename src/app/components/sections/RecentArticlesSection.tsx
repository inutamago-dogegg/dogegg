import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { ARTICLES, PROFILE } from '@/data/content';
import type { OgpMap } from '@/app/types';
import type { PaletteConfig } from '@/lib/theme';

type RecentArticlesSectionProps = {
  config: PaletteConfig;
  ogpData: OgpMap;
  articlesPageUrl: string;
};

const getDateValue = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function RecentArticlesSection({
  config,
  ogpData,
  articlesPageUrl,
}: RecentArticlesSectionProps) {
  const recentArticles = [...ARTICLES]
    .sort((a, b) => getDateValue(b.date) - getDateValue(a.date))
    .slice(0, 3);

  return (
    <section id="recent-articles" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.recentArticlesTitle}</h2>
          <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.recentArticlesLead}</p>
        </motion.div>

        {recentArticles.length === 0 ? (
          <div className={`text-center ${config.textMuted}`}>
            <p>記事は準備中です。</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {recentArticles.map((article, index) => {
                const ogp = ogpData[article.url];
                const title = ogp?.title ?? article.title ?? article.url;
                const domain = (() => {
                  try {
                    return new URL(article.url).hostname;
                  } catch {
                    return article.url;
                  }
                })();
                const image = ogp?.image;

                return (
                  <motion.div
                    key={article.url}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      className={`border-2 ${config.cardBorder} transition-all duration-300 hover:shadow-xl ${config.surfaceBg} backdrop-blur h-full`}
                    >
                      <CardContent>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                          title={article.url}
                        >
                          {image ? (
                            <img
                              src={image}
                              alt=""
                              className={`h-44 w-full rounded-lg object-cover border ${config.surfaceBorder} ${config.surfaceBg} mb-4`}
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className={`h-44 w-full rounded-lg border ${config.surfaceBorder} ${config.surfaceBg} mb-4 flex items-center justify-center ${config.textMuted}`}
                            >
                              No Image
                            </div>
                          )}
                          <div className={`text-xl font-semibold ${config.textPrimary} mb-2`}>{title}</div>
                          <div className={`text-sm ${config.textMuted} flex items-center justify-between`}>
                            <span>{domain}</span>
                            <span>{article.date}</span>
                          </div>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline" className={`border-2 ${config.buttonOutline} w-full max-w-2xl`}>
                <a href={articlesPageUrl}>全ての記事を見る</a>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
