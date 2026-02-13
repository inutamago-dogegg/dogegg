import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { PROFILE } from '@/data/content';
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

  return (
    <section id="top" className="pt-32 pb-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <h2 className={`text-5xl mb-2 ${config.textPrimary}`}>About Me</h2>
          <p className={`text-xl ${config.textSecondary} mb-6`}>プロフィール</p>
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
                      <p className={`text-sm ${config.textMuted}`}>好きな技術</p>
                      <p className={`text-lg ${config.textSecondary}`}>ゲームクライアント全般</p>
                    </div>
                    <div>
                      <p className={`text-sm ${config.textMuted}`}>趣味</p>
                      <p className={`text-lg ${config.textSecondary}`}>ゲーム / 謎解き / 漫画</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 flex flex-col items-start justify-center">
                  <button
                    type="button"
                    onClick={() => window.open('https://x.com/dogegg314', '_blank')}
                    className={`w-full max-w-[220px] text-left rounded-lg border px-4 py-3 text-white shadow transition hover:brightness-110 cursor-pointer ${staticButtonBg} ${config.surfaceBorder}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs opacity-80">Twitter (X)</p>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">@dogegg314</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open('https://github.com/inutamago-dogegg', '_blank')}
                    className={`w-full max-w-[220px] text-left rounded-lg border px-4 py-3 text-white shadow transition hover:brightness-110 cursor-pointer ${staticButtonBg} ${config.surfaceBorder}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs opacity-80">GitHub</p>
                      <Github className="h-4 w-4" />
                    </div>
                    <p className="text-lg font-semibold">@inutamago-dogegg</p>
                  </button>
                </div>
              </div>

              <div>
                <h3 className={`text-3xl ${config.textPrimary} mb-4`}>考え方</h3>
                <p className={`text-lg ${config.textSecondary} leading-relaxed`}>整備中です</p>
              </div>

              <div>
                <h3 className={`text-3xl ${config.textPrimary} mb-4`}>目指すキャリア</h3>
                <p className={`text-lg ${config.textSecondary} leading-relaxed`}>整備中です</p>
              </div>

              <div>
                <h3 className={`text-3xl ${config.textPrimary} mb-4`}>コンタクト</h3>
                <div className={`text-xl ${config.textPrimary} font-mono text-center`}>
                  inutamago.dogegg@gmail.com
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
