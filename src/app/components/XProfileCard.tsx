import type { OgpData } from '@/lib/ogp';
import type { PaletteConfig } from '@/lib/theme';

type XProfileCardProps = {
  url: string;
  data?: OgpData;
  config: PaletteConfig;
  isDark: boolean;
};

function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function getHandle(url: string) {
  try {
    return new URL(url).pathname.split('/').filter(Boolean)[0] ?? '';
  } catch {
    return '';
  }
}

// X's og:title for profile pages looks like "Name (@handle) on X" — the handle is
// already shown separately above, so strip it out to avoid repeating it twice.
function getDisplayName(title: string | undefined) {
  if (!title) return undefined;
  const match = title.match(/^(.*?)\s*\(@[^)]+\)\s*(?:on X|\/\s*X)?$/i);
  return match?.[1]?.trim() || title;
}

// A single tweet embeds quickly via the official widget, but the profile timeline widget
// pulls in a full scrollable feed and is noticeably slow to load. For account links we
// instead show a lightweight static preview built from the same build-time cached OGP
// data used elsewhere, giving just a glimpse of the profile (avatar, name, bio).
export default function XProfileCard({ url, data, config, isDark }: XProfileCardProps) {
  const handle = getHandle(url);
  const mediaBg = isDark ? 'bg-slate-800' : 'bg-gray-100';
  const hoverTitle = isDark ? 'group-hover:text-slate-200' : 'group-hover:text-gray-700';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-4 rounded-xl border ${config.surfaceBg} ${config.surfaceBorder} p-4 text-sm hover:shadow-md transition-transform hover:-translate-y-0.5 min-w-0`}
      title={url}
    >
      {data?.image ? (
        <img
          src={data.image}
          alt=""
          className={`h-14 w-14 shrink-0 rounded-full object-cover border ${config.surfaceBorder}`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${mediaBg} border ${config.surfaceBorder}`}>
          <XLogo className={`h-6 w-6 ${config.textMuted}`} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className={`inline-flex items-center gap-1.5 text-xs ${config.textMuted}`}>
          <XLogo className="h-3.5 w-3.5" />
          {handle ? `@${handle}` : 'X'}
        </p>
        <p className={`text-sm font-semibold ${config.textPrimary} ${hoverTitle} line-clamp-1`}>
          {getDisplayName(data?.title) ?? url}
        </p>
        {data?.description && (
          <p className={`text-xs ${config.textMuted} line-clamp-2`}>{data.description}</p>
        )}
      </div>
    </a>
  );
}
