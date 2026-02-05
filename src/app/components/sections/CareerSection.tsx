import { motion } from 'motion/react';
import { Briefcase, Trophy, Users } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { CAREERS, PROFILE } from '@/data/content';
import type { PaletteConfig } from '@/lib/theme';

type CareerSectionProps = {
  config: PaletteConfig;
  staticButtonBg: string;
};

const getCareerIcon = (category: (typeof CAREERS)[number]['category']) => {
  switch (category) {
    case 'サークル':
      return Users;
    case 'インターン':
      return Briefcase;
    case 'イベント':
      return Trophy;
    default:
      return Briefcase;
  }
};

export default function CareerSection({ config, staticButtonBg }: CareerSectionProps) {
  return (
    <section id="career" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.careerTitle}</h2>
          <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.careerLead}</p>
        </motion.div>

        <div className="space-y-4">
          {CAREERS.map((career, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <Card
                className={`border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur transition-all duration-300`}
              >
                <CardHeader>
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="static" className={`${config.badgeBg} pointer-events-none`}>
                        {career.category}
                      </Badge>
                      <div className={`p-3 ${staticButtonBg} rounded-lg`}>
                        {(() => {
                          const Icon = getCareerIcon(career.category);
                          return <Icon className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                    </div>
                    <div className="min-w-0">
                      {career.url ? (
                        <CardTitle className={`text-xl md:text-1xl ${config.textPrimary}`}>
                          <a
                            href={career.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            title={career.url}
                          >
                            {career.company}
                          </a>
                        </CardTitle>
                      ) : (
                        <CardTitle className={`text-xl md:text-1xl ${config.textPrimary}`}>
                          {career.company}
                        </CardTitle>
                      )}
                      <CardDescription className={config.textMuted}>{career.period}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-2 text-sm ${config.textSecondary}`}>
                    {career.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                  {career.tech && career.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {career.tech.map((tech, techIndex) => (
                        <Badge
                          variant="static"
                          key={techIndex}
                          className={`${config.badgeBg} pointer-events-none`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
