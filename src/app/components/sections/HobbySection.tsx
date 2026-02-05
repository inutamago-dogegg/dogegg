import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import OgpCard from '@/app/components/OgpCard';
import { HOBBIES, PROFILE } from '@/data/content';
import type { OgpMap } from '@/app/types';
import type { PaletteConfig } from '@/lib/theme';

type HobbySectionProps = {
  config: PaletteConfig;
  ogpData: OgpMap;
  isDark: boolean;
};

export default function HobbySection({ config, ogpData, isDark }: HobbySectionProps) {
  return (
    <section id="hobby" className="py-20 px-4 relative overflow-x-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.hobbyTitle}</h2>
          <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.hobbyLead}</p>
        </motion.div>

        <div className="grid gap-6">
          {HOBBIES.map((hobby, index) => (
            <motion.div
              className="min-w-0"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <Card
                className={`min-w-0 border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur transition-all duration-300`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{hobby.icon}</span>
                    <CardTitle className={`text-xl ${config.textPrimary}`}>{hobby.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-2 text-sm ${config.textSecondary}`}>
                    {hobby.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                  {hobby.favorites && hobby.favorites.length > 0 && (
                    <div className="mt-4">
                      {hobby.favoritesLabel && (
                        <p className={`text-sm font-semibold ${config.textSecondary} mb-2`}>
                          {hobby.favoritesLabel}
                        </p>
                      )}
                      <div className="grid gap-3 sm:grid-cols-2 min-w-0">
                        {hobby.favorites.map((favorite) => {
                          const ogp = ogpData[favorite.url];
                          return (
                            <div key={favorite.url} className="space-y-1 min-w-0">
                              <OgpCard
                                label={favorite.label}
                                url={favorite.url}
                                config={config}
                                isDark={isDark}
                                {...(ogp ? { data: ogp } : {})}
                              />
                              {favorite.note && (
                                <p className={`text-xs ${config.textMuted} px-2`}>{favorite.note}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
