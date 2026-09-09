import { useEffect, useMemo, useRef, useState } from 'react';

type TwitterWidgets = {
  createTweet?: (
    tweetId: string,
    element: HTMLElement,
    options?: Record<string, string | boolean | number>,
  ) => Promise<HTMLElement | undefined>;
  createTimeline?: (
    dataSource: { sourceType: 'profile'; screenName: string },
    element: HTMLElement,
    options?: Record<string, string | boolean | number>,
  ) => Promise<HTMLElement | undefined>;
};

type TwitterApi = {
  widgets?: TwitterWidgets;
};

declare global {
  interface Window {
    twttr?: TwitterApi;
  }
}

type XEmbedProps = {
  url: string;
};

const WIDGET_SCRIPT_ID = 'twitter-widgets-script';
const WIDGET_SCRIPT_URL = 'https://platform.twitter.com/widgets.js';

let widgetsPromise: Promise<TwitterApi> | null = null;

function normalizeForTwitterWidgets(url: string) {
  return url.replace(/^https:\/\/(?:www\.)?x\.com\//, 'https://twitter.com/');
}

function getHandle(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.split('/').filter(Boolean)[0] ?? '';
  } catch {
    return '';
  }
}

function getTweetId(url: string) {
  const match = url.match(/\/status\/(\d+)/);
  return match?.[1] ?? null;
}

function waitForWidgets(timeoutMs = 10000): Promise<TwitterApi> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      const api = window.twttr;
      if (api?.widgets?.createTweet && api.widgets.createTimeline) {
        resolve(api);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('X widgets API did not become ready in time.'));
        return;
      }

      window.setTimeout(check, 50);
    };

    check();
  });
}

function loadWidgets(): Promise<TwitterApi> {
  if (window.twttr?.widgets?.createTweet && window.twttr.widgets.createTimeline) {
    return Promise.resolve(window.twttr);
  }

  if (widgetsPromise) return widgetsPromise;

  widgetsPromise = new Promise<TwitterApi>((resolve, reject) => {
    const finish = () => {
      waitForWidgets().then(resolve).catch(reject);
    };

    const existing = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.twttr?.widgets?.createTweet && window.twttr.widgets.createTimeline) {
        resolve(window.twttr);
      } else {
        existing.addEventListener('load', finish, { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load X widgets script.')), {
          once: true,
        });
        // The script may already have fired its load event before this component mounted.
        finish();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = WIDGET_SCRIPT_ID;
    script.src = WIDGET_SCRIPT_URL;
    script.async = true;
    script.charset = 'utf-8';
    script.addEventListener('load', finish, { once: true });
    script.addEventListener('error', () => reject(new Error('Failed to load X widgets script.')), {
      once: true,
    });
    document.body.appendChild(script);
  }).catch((error) => {
    widgetsPromise = null;
    throw error;
  });

  return widgetsPromise;
}

export default function XEmbed({ url }: XEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedUrl = useMemo(() => normalizeForTwitterWidgets(url), [url]);
  const tweetId = useMemo(() => getTweetId(normalizedUrl), [normalizedUrl]);
  const handle = useMemo(() => getHandle(normalizedUrl), [normalizedUrl]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    const render = async () => {
      const container = containerRef.current;
      if (!container) return;

      container.replaceChildren();

      try {
        const api = await loadWidgets();
        if (cancelled || !containerRef.current) return;

        let result: HTMLElement | undefined;
        if (tweetId) {
          result = await api.widgets?.createTweet?.(tweetId, containerRef.current, {
            dnt: true,
            align: 'center',
            conversation: 'none',
            width: 550,
          });
        } else if (handle) {
          result = await api.widgets?.createTimeline?.(
            { sourceType: 'profile', screenName: handle },
            containerRef.current,
            {
              dnt: true,
              height: 420,
              chrome: 'noheader nofooter transparent',
            },
          );
        }

        if (!cancelled && !result) setFailed(true);
      } catch (error) {
        console.error('Failed to render X embed:', error);
        if (!cancelled) setFailed(true);
      }
    };

    void render();

    return () => {
      cancelled = true;
    };
  }, [handle, tweetId]);

  return (
    <div className="overflow-hidden rounded-xl">
      <div ref={containerRef} className="flex min-h-12 justify-center" />
      {failed && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block rounded-xl border border-slate-300 px-4 py-3 text-sm underline dark:border-slate-700"
        >
          Xで表示する
        </a>
      )}
    </div>
  );
}
