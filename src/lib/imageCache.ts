import { createHash } from 'node:crypto';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

// `astro build` copies public/ into dist/ before page frontmatter runs, so anything
// written to public/ during rendering would be missing from the final output. Write
// straight into dist/ for production builds; public/ is fine for `astro dev`, where
// the dev server serves that directory directly and there is no dist/ output.
const CACHE_DIR = path.join(
  process.cwd(),
  import.meta.env.PROD ? 'dist' : 'public',
  'cache',
  'images',
);

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/x-icon': '.ico',
};

const extFromUrl = (url: string) => {
  try {
    const ext = path.extname(new URL(url).pathname);
    return /^\.[a-z0-9]{2,5}$/i.test(ext) ? ext.toLowerCase() : undefined;
  } catch {
    return undefined;
  }
};

const extFromContentType = (contentType: string | null) => {
  const normalized = contentType?.split(';')[0]?.trim().toLowerCase();
  return (normalized && EXT_BY_CONTENT_TYPE[normalized]) || undefined;
};

const getBasePath = () => {
  const base = import.meta.env.BASE_URL ?? '/';
  return base.endsWith('/') ? base : `${base}/`;
};

const toPublicPath = (filename: string) => `${getBasePath()}cache/images/${filename}`;

const inFlight = new Map<string, Promise<string | undefined>>();

/**
 * Downloads a remote image at build time and stores it under cache/images so pages
 * never hotlink third-party image hosts at runtime (some, like trap.jp's blog CDN,
 * reject browser-origin requests with an authorization error).
 */
export function cacheRemoteImage(url: string | undefined): Promise<string | undefined> {
  if (!url || !/^https?:\/\//i.test(url)) return Promise.resolve(undefined);

  const cached = inFlight.get(url);
  if (cached) return cached;

  const task = downloadAndCache(url);
  inFlight.set(url, task);
  return task;
}

async function downloadAndCache(url: string): Promise<string | undefined> {
  const hash = createHash('sha1').update(url).digest('hex');
  const knownExt = extFromUrl(url);

  if (knownExt) {
    const filename = `${hash}${knownExt}`;
    try {
      await stat(path.join(CACHE_DIR, filename));
      return toPublicPath(filename);
    } catch {
      // not cached yet
    }
  }

  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'Astro-OGP-Preview/1.0' },
    });
    if (!response.ok) return undefined;

    const ext = knownExt ?? extFromContentType(response.headers.get('content-type')) ?? '.jpg';
    const filename = `${hash}${ext}`;
    const filePath = path.join(CACHE_DIR, filename);

    const buffer = Buffer.from(await response.arrayBuffer());
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(filePath, buffer);

    return toPublicPath(filename);
  } catch {
    return undefined;
  }
}
