const SITE_FALLBACK_ICONS: Record<string, string> = {
  'qiita.com': 'qiita-icon.png',
  'zenn.dev': 'zenn-icon.png',
};

export const getSiteFallbackImage = (hostname: string): string | null => {
  const filename = SITE_FALLBACK_ICONS[hostname];
  if (!filename) return null;
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${filename}`;
};
