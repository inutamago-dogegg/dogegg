import { useEffect, useMemo, useRef, useState } from 'react';

type TwitterWidgets = {
  createTweet?: (
    tweetId: string,
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

function getTweetId(url: string) {
  const match = url.match(/\/status\/(\d+)/);
  return match?.[1] ?? null;
}

function waitForWidgets(timeoutMs = 10000): Promise<TwitterApi> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      const api = window.twttr;
      if (api?.widgets?.createTweet) {
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
  if (window.twttr?.widgets?.createTweet) {
    return Promise.resolve(window.twttr);
  }

  if (widgetsPromise) return widgetsPromise;

  widgetsPromise = new Promise<TwitterApi>((resolve, reject) => {
    const finish = () => {
      waitForWidgets().then(resolve).catch(reject);
    };

    const existing = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.twttr?.widgets?.createTweet) {
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

// Renders a single tweet. Account/profile links are intentionally not handled here —
// the profile timeline widget pulls a full scrollable feed and is slow to load, so
// those render via the lightweight XProfileCard instead.
export default function XEmbed({ url }: XEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedUrl = useMemo(() => normalizeForTwitterWidgets(url), [url]);
  const tweetId = useMemo(() => getTweetId(normalizedUrl), [normalizedUrl]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    const render = async () => {
      const container = containerRef.current;
      if (!container || !tweetId) {
        setFailed(true);
        return;
      }

      container.replaceChildren();

      try {
        const api = await loadWidgets();
        if (cancelled || !containerRef.current) return;

        const result = await api.widgets?.createTweet?.(tweetId, containerRef.current, {
          dnt: true,
          align: 'center',
          conversation: 'none',
          width: 550,
        });

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
  }, [tweetId]);

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
