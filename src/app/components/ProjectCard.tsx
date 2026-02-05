import { motion } from 'motion/react';
import { Award, Github } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import OgpCard from '@/app/components/OgpCard';
import { LABELS, type ProjectItem } from '@/data/content';
import steamIcon from '@/images/Steam_icon_logo.svg';
import type { OgpMap } from '@/app/types';
import type { PaletteConfig } from '@/lib/theme';

type ProjectCardProps = {
  project: ProjectItem;
  index: number;
  config: PaletteConfig;
  isDark: boolean;
  ogpData: OgpMap;
};

export default function ProjectCard({ project, index, config, isDark, ogpData }: ProjectCardProps) {
  const primaryLink = project.playLink?.url;
  const xUrl = project.xUrl;
  const githubUrl = project.githubUrl;
  const steamUrl = project.steamUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="min-w-0"
    >
      <Card
        className={`border-2 ${config.cardBorderStatic} transition-all duration-300 ${config.surfaceBg} backdrop-blur h-full min-w-0`}
      >
        <CardHeader>
          <div className="mb-2">
            <span
              className={`inline-flex items-center rounded-md border ${config.surfaceBorder} ${config.chipBg} px-2 py-0.5 text-xs font-medium ${config.chipText}`}
            >
              {project.genre}
            </span>
          </div>
          <div className="mb-2 min-w-0">
            <CardTitle className={`text-xl ${config.textPrimary} break-words`}>{project.title}</CardTitle>
          </div>
          <CardDescription className={`text-sm ${config.textMuted}`}>{project.period}</CardDescription>
        </CardHeader>
        <CardContent className="min-w-0">
          {project.headerImage && (
            <div className="relative mb-4">
              {primaryLink ? (
                <a
                  href={primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform hover:-translate-y-0.5"
                  aria-label={`${project.title} の${LABELS.play}へ移動`}
                  title={primaryLink}
                >
                  <img
                    src={project.headerImage.src}
                    alt={`${project.title} のヘッダー画像`}
                    className={`h-44 w-full rounded-lg object-contain border ${config.surfaceBorder} ${config.surfaceBg}`}
                    loading="lazy"
                  />
                </a>
              ) : (
                <img
                  src={project.headerImage.src}
                  alt={`${project.title} のヘッダー画像`}
                  className={`h-44 w-full rounded-lg object-contain border ${config.surfaceBorder} ${config.surfaceBg}`}
                  loading="lazy"
                />
              )}
              {(xUrl || githubUrl || steamUrl) && (
                <div className="absolute left-2 bottom-2 flex items-center gap-1">
                  {xUrl && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${config.surfaceBg} ${config.surfaceBorder} border shadow-sm ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => window.open(xUrl, '_blank')}
                      aria-label="X"
                      title={xUrl}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </Button>
                  )}
                  {githubUrl && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${config.surfaceBg} ${config.surfaceBorder} border shadow-sm ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => window.open(githubUrl, '_blank')}
                      aria-label={LABELS.github}
                      title={githubUrl}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                  {steamUrl && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${config.surfaceBg} ${config.surfaceBorder} border shadow-sm ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => window.open(steamUrl, '_blank')}
                      aria-label="Steam"
                      title={steamUrl}
                    >
                      <span className="relative inline-flex">
                        <img src={steamIcon.src} alt="" className="h-4 w-4" />
                        <span className="absolute -top-2 -right-2 text-[14px] leading-none">®</span>
                      </span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          {!project.headerImage && (xUrl || githubUrl || steamUrl) && (
            <div className="flex items-center gap-1 mb-4">
              {xUrl && (
                <Button
                  size="icon"
                  variant="ghost"
                  className={isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
                  onClick={() => window.open(xUrl, '_blank')}
                  aria-label="X"
                  title={xUrl}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Button>
              )}
              {githubUrl && (
                <Button
                  size="icon"
                  variant="ghost"
                  className={isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
                  onClick={() => window.open(githubUrl, '_blank')}
                  aria-label={LABELS.github}
                  title={githubUrl}
                >
                  <Github className="h-4 w-4" />
                </Button>
              )}
              {steamUrl && (
                <Button
                  size="icon"
                  variant="ghost"
                  className={isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
                  onClick={() => window.open(steamUrl, '_blank')}
                  aria-label="Steam"
                  title={steamUrl}
                >
                  <span className="relative inline-flex">
                    <img src={steamIcon.src} alt="" className="h-4 w-4" />
                    <span className="absolute -top-2 -right-2 text-[14px] leading-none">®</span>
                  </span>
                </Button>
              )}
            </div>
          )}
          <div className="space-y-3 mb-4">
            {project.member && (
              <div>
                <p className={`text-xs font-semibold ${config.textMuted}`}>メンバー</p>
                <p className={`text-sm ${config.textSecondary} break-words`}>{project.member}</p>
              </div>
            )}
            {project.outline && (
              <div>
                <p className={`text-xs font-semibold ${config.textMuted}`}>概要</p>
                <p className={`text-sm ${config.textSecondary} break-words`}>{project.outline}</p>
              </div>
            )}
            {project.appeal && (
              <div>
                <p className={`text-xs font-semibold ${config.textMuted}`}>やったこと</p>
                <p className={`text-sm ${config.textSecondary} break-words`}>{project.appeal}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech, techIndex) => (
              <Badge variant="static" key={techIndex} className={`${config.badgeBg} pointer-events-none`}>
                {tech}
              </Badge>
            ))}
          </div>

          {project.playLink && (
            <div className="mb-4">
              <OgpCard
                label={project.playLink.label}
                url={project.playLink.url}
                emphasis
                config={config}
                isDark={isDark}
                {...(ogpData[project.playLink.url] ? { data: ogpData[project.playLink.url] } : {})}
              />
            </div>
          )}

          {project.relatedLinks && project.relatedLinks.length > 0 && (
            <div className="space-y-2 mb-6">
              {project.relatedLinks.map((link) => {
                const ogp = ogpData[link.url];
                return (
                  <OgpCard
                    key={`${project.title}-${link.url}`}
                    label={link.label}
                    url={link.url}
                    config={config}
                    isDark={isDark}
                    {...(ogp ? { data: ogp } : {})}
                  />
                );
              })}
            </div>
          )}

          {project.awards && project.awards.length > 0 && (
            <div className="space-y-2">
              {project.awards.map((award, awardIndex) => (
                <div key={awardIndex} className={`flex items-center gap-2 text-sm ${config.textMuted}`}>
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span>{award}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
