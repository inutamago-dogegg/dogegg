import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import ProjectCard from '@/app/components/ProjectCard';
import ProjectDetailDialog from '@/app/components/ProjectDetailDialog';
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
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const makeHash = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug.length > 0 ? slug : encodeURIComponent(value);
  };
  const openProjectDetail = (project: ProjectItem) => {
    setSelectedProject(project);
    const hash = `#work-${makeHash(project.title)}`;
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
  };
  const closeProjectDetail = () => {
    setSelectedProject(null);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  };
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#work-')) {
        setSelectedProject(null);
        return;
      }
      const slug = hash.replace('#work-', '');
      const target = featuredProjects.find((project) => makeHash(project.title) === slug);
      if (target) {
        setSelectedProject(target);
      } else {
        window.location.assign(`${baseUrl}404/`);
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [baseUrl, featuredProjects]);

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
              onSelect={openProjectDetail}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className={`border-2 ${config.buttonOutline} w-full max-w-2xl`}>
            <a href={worksPageUrl}>全ての制作物を見る</a>
          </Button>
        </div>

        <ProjectDetailDialog
          project={selectedProject}
          open={selectedProject !== null}
          onOpenChange={(open) => !open && closeProjectDetail()}
          config={config}
          isDark={isDark}
        />
      </div>
    </section>
  );
}
