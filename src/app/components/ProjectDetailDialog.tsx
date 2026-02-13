import type { ReactNode } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import MarkdownContent from '@/app/components/MarkdownContent';
import { LABELS, type ProjectItem } from '@/data/content';
import type { PaletteConfig } from '@/lib/theme';

type ProjectDetailDialogProps = {
  project: ProjectItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PaletteConfig;
  isDark: boolean;
};

export default function ProjectDetailDialog({
  project,
  open,
  onOpenChange,
  config,
  isDark,
}: ProjectDetailDialogProps) {
  if (!project) return null;

  const detailMarkdown =
    project.detailMarkdown ??
    [
      project.outline ? `### 概要\n${project.outline}` : '',
      project.appeal ? `### やったこと\n${project.appeal}` : '',
      project.member ? `### メンバー\n${project.member}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

  const linkButtons: Array<{ label: string; url: string; icon?: ReactNode }> = [];
  if (project.playLink) {
    linkButtons.push({
      label: project.playLink.label,
      url: project.playLink.url,
      icon: <ExternalLink className="w-4 h-4 mr-2" />,
    });
  }
  if (project.githubUrl) {
    linkButtons.push({
      label: LABELS.github,
      url: project.githubUrl,
      icon: <Github className="w-4 h-4 mr-2" />,
    });
  }
  if (project.xUrl) {
    linkButtons.push({
      label: LABELS.twitter,
      url: project.xUrl,
      icon: <ExternalLink className="w-4 h-4 mr-2" />,
    });
  }
  if (project.steamUrl) {
    linkButtons.push({
      label: 'Steam',
      url: project.steamUrl,
      icon: <ExternalLink className="w-4 h-4 mr-2" />,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'} max-w-2xl`}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 ${config.buttonBg} rounded-lg`}>
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className={`text-2xl ${config.textPrimary}`}>{project.title}</DialogTitle>
              <DialogDescription className={`text-base ${config.textMuted} mt-1`}>
                {project.period}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className={`text-sm font-semibold ${config.textMuted} mb-2`}>ジャンル</h4>
            <Badge className={`${config.badgeBg} border`}>{project.genre}</Badge>
          </div>

          {detailMarkdown && (
            <div className="space-y-2">
              <MarkdownContent content={detailMarkdown} config={config} />
            </div>
          )}

          <div>
            <h4 className={`text-sm font-semibold ${config.textMuted} mb-2`}>使用技術</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <Badge key={index} className={`${config.badgeBg} border`}>
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {linkButtons.length > 0 && (
            <div className="pt-4 space-y-2">
              {linkButtons.map((link) => (
                <Button
                  key={link.url}
                  className={`${config.buttonBg} text-white w-full`}
                  onClick={() => window.open(link.url, '_blank')}
                >
                  {link.icon}
                  {link.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
