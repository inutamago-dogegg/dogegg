import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { PROFILE, SKILLS } from '@/data/content';
import type { PaletteConfig } from '@/lib/theme';

type SkillsSectionProps = {
  config: PaletteConfig;
};

export default function SkillsSection({ config }: SkillsSectionProps) {
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

        <div className="grid gap-6 sm:grid-cols-2">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <Card
                className={`border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur transition-all duration-300 h-full`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={skill.icon.src}
                        alt={`${skill.name} のアイコン`}
                        className="h-8 w-8 rounded-md object-contain"
                        loading="lazy"
                      />
                      <CardTitle className={`text-xl ${config.textPrimary}`}>{skill.name}</CardTitle>
                    </div>
                    <span className={`text-sm font-semibold ${config.textSecondary}`}>{'★'.repeat(skill.level)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${config.textSecondary}`}>{skill.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
