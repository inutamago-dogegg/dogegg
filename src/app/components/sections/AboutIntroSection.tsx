import { useState } from 'react';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { ABOUT_CONTENT, PROFILE } from '@/data/content';
import avatarIcon from '@/images/dogegg_icon.png';
import { themeConfig, type PaletteConfig, type ThemeKey } from '@/lib/theme';

type AboutIntroSectionProps = {
  config: PaletteConfig;
  theme: ThemeKey;
};

export default function AboutIntroSection({ config, theme }: AboutIntroSectionProps) {
  const staticButtonBg = config.buttonBg
    .split(' ')
    .filter((item) => !item.startsWith('hover:'))
    .join(' ');
  const collapsibleTitles = ['考え方', '目指すキャリア'] as const;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(collapsibleTitles.map((title) => [title, true])),
  );

  return (
    <section id="top" className="pt-32 pb-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <h2 className={`text-5xl mb-2 ${config.textPrimary}`}>{PROFILE.sections.abaoutMeTitle}</h2>
          <p className={`text-xl ${config.textSecondary} mb-6`}>{ABOUT_CONTENT.subtitle}</p>
          <Card className={`border-2 ${config.cardBorderStatic} ${config.surfaceBg} shadow-lg backdrop-blur`}>
            <CardContent className="px-6 py-10 space-y-10">
              <div className="grid gap-10 lg:grid-cols-[220px_1fr_240px] items-start text-left">
                <div className="flex justify-center lg:justify-start">
                  <div className={`h-48 w-48 rounded-full overflow-hidden border ${config.surfaceBorder} ${config.surfaceBg}`}>
                    <img
                      src={avatarIcon.src}
                      alt={PROFILE.iconAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="space-y-4 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <span className="text-3xl">{themeConfig[theme].emoji}</span>
                    <h1 className={`text-4xl md:text-5xl ${config.textPrimary}`}>{PROFILE.name}</h1>
                  </div>
                  <div className={`text-xl ${config.textSecondary}`}>{PROFILE.tagline}</div>
                  <div className="space-y-3">
                    <div>
                      <p className={`text-sm ${config.textMuted}`}>所属</p>
                      <p className={`text-lg ${config.textSecondary}`}>{PROFILE.affiliation}</p>
                      {PROFILE.clubs.map((club) => (
                        <p key={club} className={`text-lg ${config.textSecondary}`}>{club}</p>
                      ))}
                    </div>
                    <div>
                      <p className={`text-sm ${config.textMuted}`}>{ABOUT_CONTENT.favoriteTechLabel}</p>
                      <p className={`text-lg ${config.textSecondary}`}>{ABOUT_CONTENT.favoriteTechText}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${config.textMuted}`}>{ABOUT_CONTENT.hobbyLabel}</p>
                      <p className={`text-lg ${config.textSecondary}`}>{ABOUT_CONTENT.hobbyText}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 flex flex-col items-center lg:items-start justify-center">
                  {ABOUT_CONTENT.socials.map((social) => (
                    <button
                      key={social.label}
                      type="button"
                      onClick={() => window.open(social.url, '_blank')}
                      className={`w-full max-w-[220px] text-left rounded-lg border px-4 py-3 text-white shadow transition hover:brightness-110 cursor-pointer mx-auto lg:mx-0 ${staticButtonBg} ${config.surfaceBorder}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs opacity-80">{social.label}</p>
                        {social.icon === 'x' ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        ) : (
                          <Github className="h-4 w-4" />
                        )}
                      </div>
                      <p className="text-lg font-semibold">{social.handle}</p>
                    </button>
                  ))}
                </div>
              </div>

              {ABOUT_CONTENT.sections.map((section) => {
                const isCollapsible = collapsibleTitles.includes(section.title as (typeof collapsibleTitles)[number]);
                const isOpen = openSections[section.title] ?? true;

                return (
                  <div key={section.title}>
                    {isCollapsible ? (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSections((prev) => ({ ...prev, [section.title]: !isOpen }))
                        }
                        className={`w-full text-left text-3xl ${config.textPrimary} font-bold whitespace-nowrap inline-flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] hover:-translate-y-0.5 mb-4`}
                        aria-expanded={isOpen}
                      >
                        {section.title}
                        <span
                          className={`text-2xl ${config.textMuted} transition-transform ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                          aria-hidden="true"
                        >
                          ▼
                        </span>
                      </button>
                    ) : (
                      <h3 className={`text-3xl ${config.textPrimary} mb-4`}>{section.title}</h3>
                    )}
                    {(!isCollapsible || isOpen) && (
                      <div className="space-y-3">
                        {section.paragraphs?.map((paragraph) => (
                          <p
                            key={paragraph}
                            className={`text-lg ${config.textSecondary} leading-relaxed`}
                          >
                            {paragraph}
                          </p>
                        ))}
                        {section.email && (
                          <div className={`text-lg sm:text-xl ${config.textPrimary} font-mono text-center break-words`}>
                            <span className="whitespace-nowrap">Mail:</span>{' '}
                            <a
                              href={`mailto:${section.email}`}
                              className={`inline-flex items-center rounded-md border border-slate-300/70 px-2 py-0.5 transition bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/60 hover:dark:bg-slate-700/60 ${config.textPrimary}`}
                            >
                              {section.email}
                            </a>{' '}
                            <span className="whitespace-nowrap">{ABOUT_CONTENT.contactDisplayName}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
