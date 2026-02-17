import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';

// https://astro.build/config
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserSite = owner && repo && repo === `${owner}.github.io`;

export default defineConfig({
  integrations: [react()],
  site: owner ? `https://${owner}.github.io` : undefined,
  base: isUserSite ? '/' : repo ? `/${repo}` : '/',
  vite: {
    plugins: [
      tailwind(),
      compression({ algorithm: 'brotliCompress', ext: '.br', apply: 'build' }),
      compression({ algorithm: 'gzip', ext: '.gz', apply: 'build' }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
