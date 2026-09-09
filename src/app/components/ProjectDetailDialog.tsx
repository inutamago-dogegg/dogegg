import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, ExternalLink, Github, X } from 'lucide-react';
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
import OgpCard from '@/app/components/OgpCard';
import ProjectVideoEmbed from '@/app/components/ProjectVideoEmbed';
import XProfileCard, { XLogo } from '@/app/components/XProfileCard';
import { LABELS, type ProjectItem, type ProjectLink } from '@/data/content';
import { RELATED_LINK_METADATA } from '@/data/relatedLinkMetadata';
import MissileShiftDetail from '@/data/projects/missile-shift.md?raw';
import FlashelixDetail from '@/data/projects/flashelix.md?raw';
import steamIcon from '@/images/Steam_icon_logo.svg';
import type { HeaderImageMap, OgpMap } from '@/app/types';
import type { PaletteConfig } from '@/lib/theme';

type ProjectDetailDialogProps = {
  project: ProjectItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PaletteConfig;
  isDark: boolean;
  ogpData?: OgpMap;
  headerImages?: HeaderImageMap;
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

function isXUrl(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host === 'x.com' || host === 'twitter.com';
  } catch {
    return false;
  }
}

function isXTweetUrl(url: string) {
  try {
    return isXUrl(url) && /\/status\/\d+/.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

export default function ProjectDetailDialog({
  project,
  open,
  onOpenChange,
  config,
  isDark,
  ogpData = {},
  headerImages = {},
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

  const primaryPlayLink =
    project.playLink && !isArticleUrl(project.playLink.url) ? project.playLink : undefined;

  // A related link that points at the same URL as the play link card shown below is
  // redundant — keep only the play link card in that case. (Play links that are
  // themselves an article page render via the "関連記事" card instead, so they're
  // left alone here.)
  const relatedLinks = (project.relatedLinks ?? []).filter(
    (link) => link.url !== primaryPlayLink?.url,
  );
  const xRelatedLinks = relatedLinks.filter((link) => isXUrl(link.url));
  const nonXRelatedLinks = relatedLinks.filter((link) => !isXUrl(link.url));
  const articleLinks = nonXRelatedLinks.filter((link) => isArticleUrl(link.url));
  const otherRelatedLinks = nonXRelatedLinks.filter((link) => !isArticleUrl(link.url));
  const xUrls = Array.from(
    new Set([project.xUrl, ...xRelatedLinks.map((link) => link.url)].filter((url): url is string => Boolean(url))),
  );
  const xTweetUrls = xUrls.filter(isXTweetUrl);
  const xProfileUrls = xUrls.filter((url) => !isXTweetUrl(url));

  const quickLinks: Array<{ label: string; url: string; icon: ReactNode; emphasis: boolean }> = [];
  if (primaryPlayLink) {
    quickLinks.push({
      label: primaryPlayLink.label,
      url: primaryPlayLink.url,
      icon: <ExternalLink className="h-4 w-4" />,
      emphasis: true,
    });
  }
  if (project.githubUrl) {
    quickLinks.push({
      label: LABELS.github,
      url: project.githubUrl,
      icon: <Github className="h-4 w-4" />,
      emphasis: false,
    });
  }
  if (project.steamUrl) {
    quickLinks.push({
      label: 'Steam',
      url: project.steamUrl,
      icon: <img src={steamIcon.src} alt="" className="h-4 w-4" />,
      emphasis: false,
    });
  }
  xTweetUrls.forEach((url) => {
    quickLinks.push({
      label: LABELS.x,
      url,
      icon: <XLogo className="h-4 w-4" />,
      emphasis: false,
    });
  });

  const mediaFallbackBg = isDark ? 'bg-slate-800' : 'bg-gray-100';

  const renderRelatedCard = (link: ProjectLink) => {
    const metadata = RELATED_LINK_METADATA[link.url];
    const genericLabel = link.label === LABELS.related;
    const title = metadata?.title ?? (genericLabel ? getLinkHost(link.url) : link.label);
    const siteName = metadata?.siteName ?? getLinkHost(link.url);
    const previewImage = ogpData[link.url]?.image || project.headerImage?.src || headerImages[project.title];

    return (
      <a
        key={link.url}
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className={`group flex w-full overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-sm ${config.surfaceBg} ${config.cardBorder}`}
      >
        <div className={`w-32 shrink-0 border-r ${config.surfaceBorder} sm:w-40`}>
          {previewImage ? (
            <img
              src={previewImage}
              alt=""
              loading="lazy"
              className="h-full min-h-24 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
          ) : (
            <div className={`h-full min-h-24 w-full ${mediaFallbackBg}`} />
          )}
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-3 p-3">
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
        </div>
      </a>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'} max-w-2xl md:max-w-3xl lg:max-w-4xl overflow-hidden`}
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

            {(xProfileUrls.length > 0 || quickLinks.length > 0) && (
              <section className="pt-2 space-y-3">
                <h4 className={`text-sm font-semibold ${config.textMuted}`}>リンク</h4>
                <div className="space-y-4">
                  {xProfileUrls.map((url) => (
                    <XProfileCard
                      key={url}
                      url={url}
                      config={config}
                      isDark={isDark}
                      {...(ogpData[url] ? { data: ogpData[url] } : {})}
                    />
                  ))}
                  {quickLinks.map((link) => (
                    <OgpCard
                      key={link.url}
                      url={link.url}
                      label={link.label}
                      icon={link.icon}
                      emphasis={link.emphasis}
                      config={config}
                      isDark={isDark}
                      {...(ogpData[link.url] ? { data: ogpData[link.url] } : {})}
                    />
                  ))}
                </div>
              </section>
            )}

            {articleLinks.length > 0 && (
              <section className="pt-2 space-y-3">
                <h4 className={`text-sm font-semibold ${config.textMuted}`}>関連記事</h4>
                <div className="space-y-2">{articleLinks.map(renderRelatedCard)}</div>
              </section>
            )}

            {otherRelatedLinks.length > 0 && (
              <section className="pt-2 space-y-3">
                <h4 className={`text-sm font-semibold ${config.textMuted}`}>関連リンク</h4>
                <div className="space-y-2">{otherRelatedLinks.map(renderRelatedCard)}</div>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
