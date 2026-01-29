export type OgpData = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url: string;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getMeta = (html: string, key: string, attr: 'property' | 'name' = 'property') => {
  const metaTags = html.match(/<meta\s+[^>]*>/gi) ?? [];
  for (const tag of metaTags) {
    const attrs: Record<string, string> = {};
    const attrRegex = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(tag))) {
      const [, rawKey, doubleQuoted, singleQuoted, unquoted] = match;
      const attrKey = rawKey.trim().toLowerCase();
      const attrValue = (doubleQuoted ?? singleQuoted ?? unquoted ?? '').trim();
      if (attrKey) {
        attrs[attrKey] = attrValue;
      }
    }
    if (attrs[attr]?.toLowerCase() === key.toLowerCase()) {
      return attrs.content;
    }
  }
  const escapedKey = escapeRegExp(key);
  const escapedAttr = escapeRegExp(attr);
  const patterns = [
    new RegExp(
      `<meta[^>]*${escapedAttr}\\s*=\\s*["']?${escapedKey}["']?[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*>`,
      'i',
    ),
    new RegExp(
      `<meta[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*${escapedAttr}\\s*=\\s*["']?${escapedKey}["']?[^>]*>`,
      'i',
    ),
    new RegExp(
      `<meta[^>]*${escapedAttr}\\s*=\\s*${escapedKey}[^>]*content\\s*=\\s*([^\\s"'>]+)[^>]*>`,
      'i',
    ),
    new RegExp(
      `<meta[^>]*content\\s*=\\s*([^\\s"'>]+)[^>]*${escapedAttr}\\s*=\\s*${escapedKey}[^>]*>`,
      'i',
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return undefined;
};

const getTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim();
};

const decodeHtmlEntities = (value: string | undefined) => {
  if (!value) return value;
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`')
    .replace(/&#x3D;/g, '=');
};

const resolveUrl = (value: string | undefined, base: string) => {
  if (!value) return undefined;
  try {
    return new URL(value, base).toString();
  } catch {
    return undefined;
  }
};

export const fetchOgp = async (target: string): Promise<OgpData | null> => {
  if (!/^https?:\/\//i.test(target)) return null;

  try {
    const response = await fetch(target, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Astro-OGP-Preview/1.0',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const title = decodeHtmlEntities(
      getMeta(html, 'og:title') ??
        getMeta(html, 'twitter:title', 'name') ??
        getTitle(html),
    );
    const description = decodeHtmlEntities(
      getMeta(html, 'og:description') ??
        getMeta(html, 'twitter:description', 'name') ??
        getMeta(html, 'description', 'name'),
    );
    const image =
      getMeta(html, 'og:image') ??
      getMeta(html, 'og:image:secure_url') ??
      getMeta(html, 'twitter:image', 'name') ??
      getMeta(html, 'twitter:image:src', 'name');
    const siteName = decodeHtmlEntities(
      getMeta(html, 'og:site_name') ?? new URL(target).hostname,
    );

    return {
      title,
      description,
      image: resolveUrl(image, target),
      siteName,
      url: target,
    };
  } catch {
    return null;
  }
};
