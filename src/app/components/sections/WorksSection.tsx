import type { Dispatch, SetStateAction } from 'react';
import { motion } from 'motion/react';
import ProjectCard from '@/app/components/ProjectCard';
import { PROFILE, type ProjectYearGroup } from '@/data/content';
import type { OgpMap } from '@/app/types';
import type { PaletteConfig } from '@/lib/theme';

type WorksSectionProps = {
  config: PaletteConfig;
  isDark: boolean;
  ogpData: OgpMap;
  projects: ProjectYearGroup[];
  openYears: Record<string, boolean>;
  setOpenYears: Dispatch<SetStateAction<Record<string, boolean>>>;
};

export default function WorksSection({
  config,
  isDark,
  ogpData,
  projects,
  openYears,
  setOpenYears,
}: WorksSectionProps) {
  return (
    <section id="works" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.worksTitle}</h2>
          <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.worksLead}</p>
        </motion.div>

        {projects.map((yearGroup, yearIndex) => (
          <div key={yearGroup.year} id={`works-${yearGroup.year}`} className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: yearIndex * 0.06 }}
              className="flex items-center justify-between mb-8 gap-4"
            >
              <button
                type="button"
                onClick={() => setOpenYears((prev) => ({ ...prev, [yearGroup.year]: !prev[yearGroup.year] }))}
                className={`text-left text-4xl ${config.textPrimary} font-bold whitespace-nowrap inline-flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.03] hover:-translate-y-0.5`}
                aria-expanded={openYears[yearGroup.year]}
                aria-controls={`projects-${yearGroup.year}`}
              >
                {yearGroup.year}年度
                <span
                  className={`text-2xl transition-transform ${
                    openYears[yearGroup.year] ? 'rotate-180' : 'rotate-0'
                  }`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>
            </motion.div>

            <motion.div
              id={`projects-${yearGroup.year}`}
              initial={false}
              animate={{
                height: openYears[yearGroup.year] ? 'auto' : 0,
                opacity: openYears[yearGroup.year] ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {yearGroup.items.map((project, index) => (
                  <ProjectCard
                    key={`${yearGroup.year}-${project.title}-${index}`}
                    project={project}
                    index={index}
                    config={config}
                    isDark={isDark}
                    ogpData={ogpData}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
