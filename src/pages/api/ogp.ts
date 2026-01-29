import type { APIRoute } from 'astro';

const getMeta = (html: string, key: string, attr: 'property' | 'name' = 'property') => {
  const pattern = new RegExp(
    `<meta[^>]+${attr}=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    'i',
  );
  const match = html.match(pattern);
  return match?.[1];
};

const getTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim();
};

const resolveUrl = (value: string | undefined, base: string) => {
  if (!value) return undefined;
  try {
    return new URL(value, base).toString();
  } catch {
    return undefined;
  }
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const target = url.searchParams.get('url');

  if (!target || !/^https?:\/\//i.test(target)) {
    return new Response(JSON.stringify({ error: 'invalid url' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const response = await fetch(target, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Astro-OGP-Preview/1.0',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'fetch failed' }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      });
    }

    const html = await response.text();
    const title =
      getMeta(html, 'og:title') ??
      getMeta(html, 'twitter:title', 'name') ??
      getTitle(html);
    const description =
      getMeta(html, 'og:description') ??
      getMeta(html, 'twitter:description', 'name') ??
      getMeta(html, 'description', 'name');
    const image =
      getMeta(html, 'og:image') ??
      getMeta(html, 'twitter:image', 'name') ??
      getMeta(html, 'twitter:image:src', 'name');
    const siteName = getMeta(html, 'og:site_name') ?? new URL(target).hostname;

    return new Response(
      JSON.stringify({
        title,
        description,
        image: resolveUrl(image, target),
        siteName,
        url: target,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, max-age=86400',
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'unexpected error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
