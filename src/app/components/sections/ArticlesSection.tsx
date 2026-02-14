import { motion } from 'motion/react';
import { Card, CardContent } from '@/app/components/ui/card';
import { ARTICLES } from '@/data/content';
import type { OgpMap } from '@/app/types';
import type { PaletteConfig } from '@/lib/theme';

type ArticlesSectionProps = {
  config: PaletteConfig;
  ogpData: OgpMap;
};

export default function ArticlesSection({ config, ogpData }: ArticlesSectionProps) {
  return (
    <section className="pt-32 py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl mb-4 ${config.textPrimary}`}>Articles</h2>
          <p className={`text-xl ${config.textSecondary}`}>これまでに書いた記事</p>
        </motion.div>

        {ARTICLES.length === 0 ? (
          <div className={`text-center ${config.textMuted}`}>
            <p>記事は準備中です。</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {ARTICLES.map((article, index) => {
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
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
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
        )}
      </div>
    </section>
  );
}
