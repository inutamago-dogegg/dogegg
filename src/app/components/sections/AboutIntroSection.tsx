import { useState } from 'react';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { ABOUT_CONTENT, PROFILE } from '@/data/content';
import avatarIcon from '@/images/dogegg_icon.png';
import unityroomIcon from '@/images/Unityroom_Icon.png';
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
    Object.fromEntries(collapsibleTitles.map((title) => [title, false])),
  );
  const [iconRotations, setIconRotations] = useState(0);

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
                  <motion.div
                    className={`h-48 w-48 rounded-full overflow-hidden border ${config.surfaceBorder} ${config.surfaceBg} cursor-default`}
                    animate={{ rotate: iconRotations * 360 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    onClick={() => setIconRotations((prev) => prev + 1)}
                    title="クリックして回す"
                  >
                    <img
                      src={avatarIcon.src}
                      alt={PROFILE.iconAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </div>
                <div className="space-y-4 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <span
                      className="inline-block w-8 h-8 rounded-sm shrink-0"
                      style={{ backgroundColor: themeConfig[theme].color }}
                    />
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
                        ) : social.icon === 'github' ? (
                          <Github className="h-4 w-4" />
                        ) : social.icon === 'pixiv' ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4.94 0A4.953 4.953 0 0 0 0 4.94v14.12A4.953 4.953 0 0 0 4.94 24h14.12A4.953 4.953 0 0 0 24 19.06c-.014 1.355 0-14.12 0-14.12A4.953 4.953 0 0 0 19.06 0Zm1.783 5.465h.904a.37.37 0 0 1 .31.17l.752 1.17a6.172 6.172 0 0 1 10.01 4.834 6.172 6.172 0 0 1-9.394 5.265v2.016a.37.37 0 0 1-.37.367H6.724a.37.37 0 0 1-.37-.367V5.834a.37.37 0 0 1 .37-.37m5.804 2.951a3.222 3.222 0 1 0-.002 6.443 3.222 3.222 0 0 0 .002-6.443" />
                          </svg>
                        ) : social.icon === 'qiita' ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0C5.3726 0 0 5.3726 0 12s5.3726 12 12 12c3.3984 0 6.4665-1.413 8.6498-3.6832-.383-.0574-.7746-.2062-1.1466-.4542-.7145-.4763-1.3486-.9263-1.6817-1.674-1.2945 1.3807-3.0532 1.835-5.1822 2.0503-4.311.4359-8.0456-1.4893-8.4979-6.2996-.1922-2.045.2628-3.989 1.1804-5.582l-.5342-2.1009c-.0862-.3652.2498-.7126.6057-.6262l1.8456.448c1.0974-.9012 2.4249-1.49 3.8892-1.638 1.2526-.1267 2.467.0834 3.571.5624l1.7348-1.0494c.3265-.1974.7399.0257.7711.4164l.1 2.4747v.0002c1.334 1.4084 2.2424 3.3319 2.4478 5.516.116 1.2339-.012 2.1776-.339 3.078-.1531.4215-.1992.7778.0776 1.1305.2674.3408.6915 1.0026 1.1644.8917.7107-.1666 1.4718-.1223 1.9422.1715C23.4925 15.9525 24 14.0358 24 12c0-6.6274-5.3726-12-12-12Zm-.0727 5.727a5.2731 5.2731 0 0 0-.6146.0273c-2.2084.2233-3.9572 1.8135-4.4937 3.8484l-1.3176-.1996-.014.2589 1.2972.1407c-.0352.1497-.0643.2384-.086.3923l-1.1319.0902.0103.2025 1.1032-.088c-.0194.1713-.031.2814-.0332.4565l-1.0078.412.0495.2499.9598-.4492c.002.1339.008.2053.0207.3407.2667 2.8371 2.6364 3.3981 5.4677 3.1118 2.8312-.2863 5.0517-1.3114 4.785-4.1486-.013-.1361-.0324-.2068-.0553-.3392l1.0397.2257.0242-.229-1.0906-.207c-.0342-.1687-.0765-.271-.1264-.4327l1.1208-.1374-.0158-.2019-1.1499.1409a5.1093 5.1093 0 0 0-.1665-.4259l1.2665-.4042-.0397-.2536-1.3471.4667c-.819-1.7168-2.5002-2.8224-4.4546-2.8482Z" />
                          </svg>
                        ) : social.icon === 'unityroom' ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white p-0.5 ring-1 ring-white/70">
                            <img src={unityroomIcon.src} alt="" className="h-full w-full rounded-full" aria-hidden="true" />
                          </span>
                        ) : null}
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
