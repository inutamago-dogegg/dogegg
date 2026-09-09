import { useEffect, useMemo } from 'react';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

type XEmbedProps = {
  url: string;
};

const WIDGET_SCRIPT_ID = 'twitter-widgets-script';

function normalizeForTwitterWidgets(url: string) {
  return url.replace(/^https:\/\/x\.com\//, 'https://twitter.com/');
}

function getHandle(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.split('/').filter(Boolean)[0] ?? 'X';
  } catch {
    return 'X';
  }
}

export default function XEmbed({ url }: XEmbedProps) {
  const normalizedUrl = useMemo(() => normalizeForTwitterWidgets(url), [url]);
  const isPost = /\/status\/\d+/.test(normalizedUrl);
  const handle = getHandle(normalizedUrl);

  useEffect(() => {
    const loadWidgets = () => {
      window.twttr?.widgets?.load(document.getElementById(`x-embed-${encodeURIComponent(url)}`) ?? undefined);
    };

    const existing = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.twttr?.widgets) {
        loadWidgets();
      } else {
        existing.addEventListener('load', loadWidgets, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = WIDGET_SCRIPT_ID;
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    script.addEventListener('load', loadWidgets, { once: true });
    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', loadWidgets);
    };
  }, [url]);

  return (
    <div id={`x-embed-${encodeURIComponent(url)}`} className="overflow-hidden rounded-xl">
      {isPost ? (
        <blockquote className="twitter-tweet" data-dnt="true">
          <a href={normalizedUrl}>Xの投稿を見る</a>
        </blockquote>
      ) : (
        <a
          className="twitter-timeline"
          data-height="420"
          data-chrome="noheader nofooter transparent"
          data-dnt="true"
          href={normalizedUrl}
        >
          @{handle} の投稿を見る
        </a>
      )}
    </div>
  );
}
