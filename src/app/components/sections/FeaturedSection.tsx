import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import ProjectCard from '@/app/components/ProjectCard';
import { PROFILE, type ProjectItem } from '@/data/content';
import type { OgpMap } from '@/app/types';
import type { PaletteConfig } from '@/lib/theme';

type FeaturedSectionProps = {
  config: PaletteConfig;
  isDark: boolean;
  ogpData: OgpMap;
  worksPageUrl: string;
  featuredProjects: ProjectItem[];
};

export default function FeaturedSection({
  config,
  isDark,
  ogpData,
  worksPageUrl,
  featuredProjects,
}: FeaturedSectionProps) {
  return (
    <section id="featured" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.featuredTitle}</h2>
          <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.featuredLead}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={`featured-${project.title}-${index}`}
              project={project}
              index={index}
              config={config}
              isDark={isDark}
              ogpData={ogpData}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className={`border-2 ${config.buttonOutline} w-full max-w-2xl`}>
            <a href={worksPageUrl}>全ての制作物を見る</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
