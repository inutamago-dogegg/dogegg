import { useState } from 'react';
import { getSiteFallbackImage } from '@/lib/articleUtils';
import type { PaletteConfig } from '@/lib/theme';

type ArticleCardImageProps = {
  image: string | undefined;
  domain: string;
  config: PaletteConfig;
};

export default function ArticleCardImage({ image, domain, config }: ArticleCardImageProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const siteFallbackImage = getSiteFallbackImage(domain);

  const containerClass = `h-44 w-full rounded-lg border ${config.surfaceBorder} ${config.surfaceBg} mb-4`;

  if (image && !imgFailed) {
    return (
      <img
        src={image}
        alt=""
        className={`${containerClass} object-cover`}
        loading="lazy"
        onError={() => setImgFailed(true)}
      />
    );
  }

  if (siteFallbackImage) {
    return (
      <div className={`${containerClass} flex items-center justify-center`}>
        <img
          src={siteFallbackImage}
          alt={domain}
          className="h-24 w-24 rounded-2xl object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`${containerClass} flex items-center justify-center ${config.textMuted}`}>
      No Image
    </div>
  );
}
