import type { OgpData } from '@/lib/ogp';
import type { PaletteConfig } from '@/lib/theme';

type OgpCardProps = {
  url: string;
  label: string;
  data?: OgpData;
  emphasis?: boolean;
  config: PaletteConfig;
  isDark: boolean;
};

export default function OgpCard({
  url,
  label,
  data,
  emphasis = false,
  config,
  isDark,
}: OgpCardProps) {
  const baseClass = `block rounded-xl border ${config.surfaceBg} px-4 py-3 text-sm ${config.textSecondary} hover:shadow-md transition-transform hover:-translate-y-0.5 break-words min-w-0`;
  const highlightClass = emphasis ? 'border-primary/60 bg-primary/5 shadow-sm' : config.surfaceBorder;
  const labelClass = emphasis ? 'text-primary font-semibold' : config.textMuted;
  const hoverTitle = isDark ? 'group-hover:text-slate-200' : 'group-hover:text-gray-700';
  const mediaBg = isDark ? 'bg-slate-800' : 'bg-gray-100';

  if (!data) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${highlightClass}`}
        title={url}
      >
        <span className={`font-medium ${labelClass}`}>{label}</span>
        <span className={`block text-xs ${config.textMuted} break-all`}>{url}</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${baseClass} ${highlightClass} p-0`}
      title={url}
    >
      <div className="flex gap-4 p-4">
        {data.image ? (
          <img
            src={data.image}
            alt=""
            className={`h-16 w-16 rounded-lg object-cover border ${config.surfaceBorder}`}
            loading="lazy"
          />
        ) : (
          <div className={`h-16 w-16 rounded-lg ${mediaBg} border ${config.surfaceBorder}`} />
        )}
        <div className="min-w-0">
          <p className={`text-xs ${labelClass}`}>{label}</p>
          <p className={`text-sm font-semibold ${config.textPrimary} ${hoverTitle} line-clamp-2`}>
            {data.title ?? data.url}
          </p>
          <p className={`text-xs ${config.textMuted} line-clamp-2`}>
            {data.description ?? data.siteName ?? new URL(data.url).hostname}
          </p>
        </div>
      </div>
    </a>
  );
}
