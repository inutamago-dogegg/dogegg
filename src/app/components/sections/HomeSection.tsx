import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { PROFILE } from '@/data/content';
import avatarIcon from '@/images/dogegg_icon.png';
import { themeConfig, type PaletteConfig, type ThemeKey } from '@/lib/theme';

type HomeSectionProps = {
  config: PaletteConfig;
  theme: ThemeKey;
  aboutUrl: string;
  worksPageUrl: string;
};

export default function HomeSection({ config, theme, aboutUrl, worksPageUrl }: HomeSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <div className="relative inline-block mb-8">
            <img
              src={avatarIcon.src}
              alt={PROFILE.iconAlt}
              className={`h-28 w-28 md:h-36 md:w-36 rounded-full border-2 ${config.surfaceBorder} shadow-lg object-cover`}
              loading="lazy"
            />
            <span
              className="absolute top-[33%] left-1/2 -translate-x-1/2 rounded-ful px-2 py-0.5 text-xl md:text-base"
              aria-hidden="true"
            >
              {themeConfig[theme].emoji}
            </span>
          </div>
          <h1 className={`text-5xl md:text-6xl mb-6 ${config.textPrimary}`}>{PROFILE.title}</h1>
          <p className={`text-xl md:text-2xl ${config.textSecondary} mb-10`}>{PROFILE.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Button asChild size="lg" className={`${config.buttonBg} text-white shadow-lg text-lg py-6`}>
              <a href={aboutUrl}>About</a>
            </Button>
            <Button asChild size="lg" className={`${config.buttonBg} text-white shadow-lg text-lg py-6`}>
              <a href={worksPageUrl}>Works</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
