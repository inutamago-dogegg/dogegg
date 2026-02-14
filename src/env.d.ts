/// <reference types="astro/client" />
/// <reference types="@astrojs/react/client" />

declare namespace astroHTML.JSX {
  interface IntrinsicAttributes {
    'client:load'?: boolean;
  }
}

declare module '*.png' {
  const src: import('astro').ImageMetadata;
  export default src;
}

