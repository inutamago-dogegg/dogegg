import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { LABELS, PROFILE } from '@/data/content';
import avatarIcon from '@/images/dogegg_icon.png';
import { themeConfig, type PaletteConfig, type ThemeKey } from '@/lib/theme';

type AboutIntroSectionProps = {
  config: PaletteConfig;
  theme: ThemeKey;
};

export default function AboutIntroSection({ config, theme }: AboutIntroSectionProps) {
  return (
    <section id="top" className="pt-32 pb-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`text-center rounded-2xl border-2 ${config.cardBorderStatic} ${config.surfaceBg} px-6 py-10 shadow-lg backdrop-blur`}
        >
          <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>About Me</h2>
          <div className="grid place-items-center gap-4 mb-6">
            <img
              src={avatarIcon.src}
              alt={PROFILE.iconAlt}
              className="h-20 w-20 rounded-full border border-white shadow-md object-cover"
              loading="lazy"
            />
            <div className="flex items-center gap-3 text-3xl">
              <span>{themeConfig[theme].emoji}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={`border-2 ${config.surfaceBorder} ${config.surfaceBg} hover:-translate-y-0.5`}
                  onClick={() => window.open('https://x.com/dogegg314', '_blank')}
                  title="https://x.com/dogegg314"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {LABELS.twitter}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`border-2 ${config.surfaceBorder} ${config.surfaceBg} hover:-translate-y-0.5`}
                  onClick={() => window.open('https://github.com/inutamago-dogegg', '_blank')}
                  title="https://github.com/inutamago-dogegg"
                >
                  <Github className="w-4 h-4 mr-2" />
                  {LABELS.github}
                </Button>
              </div>
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl mb-6 ${config.textPrimary}`}>{PROFILE.name}</h1>
          <p className={`text-xl ${config.textSecondary} mb-4`}>{PROFILE.tagline}</p>
          <p className={`text-lg ${config.textMuted} mb-8`}>
            {PROFILE.affiliation}
            <br />
            {PROFILE.clubs}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
