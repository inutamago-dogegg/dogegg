import { useEffect, useRef, useState } from 'react';
import type { ProjectVideo } from '@/data/content';

type ProjectVideoEmbedProps = {
  video: ProjectVideo;
  title: string;
  fallbackUrl?: string;
};

const toPublicUrl = (path: string) => {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\//, '')}`;
};

function SteamHlsVideo({ hlsUrl, title, fallbackUrl }: { hlsUrl: string; title: string; fallbackUrl?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = hlsUrl;
      return;
    }

    let hls: import('hls.js').default | undefined;
    let cancelled = false;

    import('hls.js')
      .then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          setFailed(true);
          return;
        }
        hls = new Hls();
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) setFailed(true);
        });
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoEl);
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [hlsUrl]);

  if (failed) {
    if (!fallbackUrl) return null;
    return (
      <a
        href={fallbackUrl}
        target="_blank"
        rel="noreferrer"
        className="flex aspect-video w-full items-center justify-center rounded-lg bg-black text-sm text-white underline"
      >
        動画を開く
      </a>
    );
  }

  return (
    <video
      ref={videoRef}
      className="aspect-video w-full rounded-lg bg-black"
      controls
      playsInline
      preload="metadata"
      title={title}
    >
      お使いのブラウザは動画再生に対応していません。
    </video>
  );
}

export default function ProjectVideoEmbed({ video, title, fallbackUrl }: ProjectVideoEmbedProps) {
  const embedTitle = video.label ? `${title}(${video.label})` : title;

  return (
    <div className="space-y-1">
      {video.label && <p className="text-xs font-semibold text-current opacity-70">{video.label}</p>}
      {video.type === 'youtube' ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={embedTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : video.type === 'steam' ? (
        <SteamHlsVideo hlsUrl={video.hlsUrl} title={embedTitle} fallbackUrl={fallbackUrl} />
      ) : (
        <video
          className="aspect-video w-full rounded-lg bg-black"
          src={toPublicUrl(video.src)}
          poster={video.poster ? toPublicUrl(video.poster) : undefined}
          controls
          playsInline
          preload="metadata"
          title={embedTitle}
        >
          お使いのブラウザは動画再生に対応していません。
        </video>
      )}
    </div>
  );
}
