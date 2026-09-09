import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, ExternalLink, FileText, Github, Link2, X } from 'lucide-react';
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
import ProjectVideoEmbed from '@/app/components/ProjectVideoEmbed';
import { LABELS, type ProjectItem, type ProjectLink } from '@/data/content';
import { RELATED_LINK_METADATA } from '@/data/relatedLinkMetadata';
import MissileShiftDetail from '@/data/projects/missile-shift.md?raw';
import FlashelixDetail from '@/data/projects/flashelix.md?raw';
import type { PaletteConfig } from '@/lib/theme';

type ProjectDetailDialogProps = {
  project: ProjectItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PaletteConfig;
  isDark: boolean;
};

function getLinkHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function isArticleUrl(url: string) {
  return url.includes('trap.jp/post/');
}

export default function ProjectDetailDialog({
  project,
  open,
  onOpenChange,
  config,
  isDark,
}: ProjectDetailDialogProps) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!project) return null;

  const fallbackDetailMarkdown =
    project.title === 'MissileShift'
      ? MissileShiftDetail
      : project.title === 'Flashelix'
        ? FlashelixDetail
        : '';
  const detailMarkdown = project.detailMarkdown?.trim() || fallbackDetailMarkdown.trim();

  const relatedLinks = project.relatedLinks ?? [];
  const articleLinks = relatedLinks.filter((link) => isArticleUrl(link.url));
  const otherRelatedLinks = relatedLinks.filter((link) => !isArticleUrl(link.url));
  const primaryPlayLink =
    project.playLink && !isArticleUrl(project.playLink.url) ? project.playLink : undefined;

  const linkButtons: Array<{ label: string; url: string; icon?: ReactNode }> = [];
  if (primaryPlayLink) {
    linkButtons.push({
      label: primaryPlayLink.label,
      url: primaryPlayLink.url,
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
      label: LABELS.x,
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

  const renderRelatedCard = (link: ProjectLink, article: boolean) => {
    const metadata = RELATED_LINK_METADATA[link.url];
    const genericLabel = link.label === LABELS.related;
    const title = metadata?.title ?? (genericLabel ? getLinkHost(link.url) : link.label);
    const siteName = metadata?.siteName ?? getLinkHost(link.url);
    const Icon = article ? FileText : Link2;

    return (
      <a
        key={link.url}
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className={`group flex w-full items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm ${config.surfaceBg} ${config.cardBorder}`}
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${config.chipBg} ${config.surfaceBorder}`}
        >
          <Icon className={`h-5 w-5 ${config.textMuted}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-semibold leading-snug ${config.textPrimary}`}>{title}</div>
          <div className={`mt-1 flex flex-wrap items-center gap-x-2 text-xs ${config.textMuted}`}>
            <span>{siteName}</span>
            {metadata?.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>{metadata.date}</span>
              </>
            )}
          </div>
        </div>
        <ArrowUpRight
          className={`h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${config.textMuted}`}
        />
      </a>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'} max-w-2xl overflow-hidden`}
      >
        <div className="max-h-[85vh] overflow-y-auto">
          <div
            className={`sticky top-0 z-10 border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-3 top-3"
              onClick={() => onOpenChange(false)}
              aria-label="閉じる"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="px-6 pt-6 pb-4">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {primaryPlayLink ? (
                    <button
                      type="button"
                      onClick={() => window.open(primaryPlayLink.url, '_blank')}
                      className={`p-3 ${config.buttonBg} rounded-lg`}
                      aria-label={primaryPlayLink.label}
                    >
                      <ExternalLink className="w-6 h-6 text-white" />
                    </button>
                  ) : (
                    <div className={`p-3 ${config.buttonBg} rounded-lg`}>
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <DialogTitle className={`text-2xl ${config.textPrimary}`}>{project.title}</DialogTitle>
                    <DialogDescription className={`text-base ${config.textMuted} mt-1`}>
                      {project.period}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>
          </div>

          <div className="px-6 pb-6 pt-3 space-y-4">
            {project.videos && project.videos.length > 0 && (
              <div className="space-y-4">
                {project.videos.map((video, index) => (
                  <ProjectVideoEmbed
                    key={index}
                    video={video}
                    title={`${project.title} のプレイ映像`}
                    {...(project.steamUrl ? { fallbackUrl: project.steamUrl } : {})}
                  />
                ))}
              </div>
            )}

            <div>
              <h4 className={`text-sm font-semibold ${config.textMuted} mb-2`}>ジャンル</h4>
              <Badge className={`${config.badgeBg} border`}>{project.genre}</Badge>
            </div>

            <div>
              <h4 className={`text-sm font-semibold ${config.textMuted} mb-2`}>メンバー</h4>
              <p className={`text-sm ${config.textSecondary}`}>{project.member}</p>
            </div>

            <div>
              <h4 className={`text-sm font-semibold ${config.textMuted} mb-2`}>作品概要</h4>
              <p className={`text-sm ${config.textSecondary}`}>{project.outline}</p>
            </div>

            {detailMarkdown && (
              <div className="space-y-2">
                <h4 className={`text-sm font-semibold ${config.textMuted}`}>詳細</h4>
                <MarkdownContent content={detailMarkdown} config={config} />
              </div>
            )}

            {articleLinks.length > 0 && (
              <section className="pt-2 space-y-3">
                <h4 className={`text-sm font-semibold ${config.textMuted}`}>関連記事</h4>
                <div className="space-y-2">
                  {articleLinks.map((link) => renderRelatedCard(link, true))}
                </div>
              </section>
            )}

            {otherRelatedLinks.length > 0 && (
              <section className="pt-2 space-y-3">
                <h4 className={`text-sm font-semibold ${config.textMuted}`}>関連リンク</h4>
                <div className="space-y-2">
                  {otherRelatedLinks.map((link) => renderRelatedCard(link, false))}
                </div>
              </section>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
