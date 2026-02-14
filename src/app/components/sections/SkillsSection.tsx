import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { PROFILE, SKILL_SECTIONS } from '@/data/content';
import type { PaletteConfig } from '@/lib/theme';

type SkillsSectionProps = {
  config: PaletteConfig;
};

export default function SkillsSection({ config }: SkillsSectionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [SKILL_SECTIONS.gameProgram.title]: true,
    [SKILL_SECTIONS.graphic.title]: false,
    [SKILL_SECTIONS.others.title]: false,
  });

  return (
    <section id="skills" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.skillsTitle}</h2>
          <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.skillsLead}</p>
        </motion.div>

        <div className="space-y-12">
          {[SKILL_SECTIONS.gameProgram, SKILL_SECTIONS.graphic, SKILL_SECTIONS.others].map((section) => {
            const isOpen = openSections[section.title] ?? false;
            return (
              <div key={section.title}>
                <div className="flex items-center justify-center mb-6">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSections((prev) => ({ ...prev, [section.title]: !isOpen }))
                    }
                    className={`text-left text-4xl ${config.textPrimary} font-bold whitespace-nowrap inline-flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.03] hover:-translate-y-0.5`}
                    aria-expanded={isOpen}
                    aria-controls={`skills-${section.title}`}
                  >
                    {section.title}
                    <span
                      className={`text-2xl transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </button>
                </div>
                <motion.div
                  id={`skills-${section.title}`}
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {section.items.map((skill, index) => (
                      <motion.div
                        key={`${section.title}-${skill.name}`}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                      >
                        <Card
                          className={`border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur transition-all duration-300 h-full`}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between gap-4">
                              {(() => {
                                const icon = 'icon' in skill ? skill.icon : undefined;
                                return (
                                  <div className={`flex items-center ${icon ? 'gap-2' : ''}`}>
                                    {icon && (
                                      <img
                                        src={icon.src}
                                        alt={`${skill.name} のアイコン`}
                                        className="h-8 w-8 rounded-md object-contain"
                                        loading="lazy"
                                      />
                                    )}
                                    <CardTitle className={`text-xl ${config.textPrimary}`}>
                                      {skill.name}
                                    </CardTitle>
                                  </div>
                                );
                              })()}
                              <span className={`text-sm font-semibold ${config.textSecondary}`}>
                                {'★'.repeat(skill.level)}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className={`text-sm ${config.textSecondary}`}>{skill.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
